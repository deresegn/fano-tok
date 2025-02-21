import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const migrateUserProfile = async (userDoc, user) => {
    const existingData = userDoc.data();
    const updatedData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: existingData.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
      followerCount: existingData.followerCount || 0,
      followingCount: existingData.followingCount || 0,
      videoCount: existingData.videoCount || 0,
      likedVideos: existingData.likedVideos || [],
      videos: existingData.videos || []
    };

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, updatedData, { merge: true });
    console.log('User profile migrated successfully');
    return updatedData;
  };

  const createUserProfile = async (user) => {
    if (!user) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      try {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          followerCount: 0,
          followingCount: 0,
          videoCount: 0,
          likedVideos: [],
          videos: []
        };
        
        await setDoc(userRef, userData);
        console.log('User profile created successfully');
        return userData;
      } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
      }
    } else {
      // Migrate existing profile if it doesn't have the new fields
      const data = userSnap.data();
      if (!data.followerCount || !data.followingCount || !data.videos) {
        return await migrateUserProfile(userSnap, user);
      }
      return data;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserProfile(user);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const profile = await createUserProfile(result.user);
      console.log('Profile after sign in:', profile);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
