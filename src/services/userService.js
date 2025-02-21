import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  where,
  increment,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Get user profile
export const getUserProfile = async (userId) => {
  try {
    console.log('getUserProfile called with userId:', userId);
    const userRef = doc(db, 'users', userId);
    console.log('Getting document from path:', userRef.path);
    
    const userDoc = await getDoc(userRef);
    console.log('Document exists?', userDoc.exists());
    
    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log('User data:', data);
      return data;
    }
    console.log('No user document found');
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Create or update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    console.log('updateUserProfile called with:', { userId, profileData });
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return await getUserProfile(userId);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Follow a user
export const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error('Cannot follow yourself');
  }

  const batch = writeBatch(db);

  try {
    console.log('followUser called:', { followerId, followingId });
    
    // Create follow relationship
    const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
    batch.set(followRef, {
      followerId,
      followingId,
      createdAt: serverTimestamp()
    });

    // Update follower count
    const followingUserRef = doc(db, 'users', followingId);
    batch.update(followingUserRef, {
      followerCount: increment(1)
    });

    // Update following count
    const followerUserRef = doc(db, 'users', followerId);
    batch.update(followerUserRef, {
      followingCount: increment(1)
    });

    await batch.commit();
    console.log('Follow relationship created successfully');
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};

// Unfollow a user
export const unfollowUser = async (followerId, followingId) => {
  const batch = writeBatch(db);

  try {
    console.log('unfollowUser called:', { followerId, followingId });
    
    // Remove follow relationship
    const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
    batch.delete(followRef);

    // Update follower count
    const followingUserRef = doc(db, 'users', followingId);
    batch.update(followingUserRef, {
      followerCount: increment(-1)
    });

    // Update following count
    const followerUserRef = doc(db, 'users', followerId);
    batch.update(followerUserRef, {
      followingCount: increment(-1)
    });

    await batch.commit();
    console.log('Unfollow completed successfully');
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
};

// Check if user is following another user
export const isFollowing = async (followerId, followingId) => {
  try {
    console.log('isFollowing check:', { followerId, followingId });
    const followRef = doc(db, 'follows', `${followerId}_${followingId}`);
    const followDoc = await getDoc(followRef);
    const exists = followDoc.exists();
    console.log('Follow relationship exists?', exists);
    return exists;
  } catch (error) {
    console.error('Error checking follow status:', error);
    throw error;
  }
};

// Get user's followers
export const getFollowers = async (userId) => {
  try {
    console.log('getFollowers called for userId:', userId);
    const followsQuery = query(
      collection(db, 'follows'),
      where('followingId', '==', userId)
    );
    const querySnapshot = await getDocs(followsQuery);
    
    // Get full user profiles for followers
    const followerProfiles = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const followerData = doc.data();
        const userProfile = await getUserProfile(followerData.followerId);
        return {
          ...userProfile,
          followedAt: followerData.createdAt
        };
      })
    );
    
    console.log('Found followers:', followerProfiles);
    return followerProfiles;
  } catch (error) {
    console.error('Error getting followers:', error);
    throw error;
  }
};

// Get users that a user is following
export const getFollowing = async (userId) => {
  try {
    console.log('getFollowing called for userId:', userId);
    const followsQuery = query(
      collection(db, 'follows'),
      where('followerId', '==', userId)
    );
    const querySnapshot = await getDocs(followsQuery);
    
    // Get full user profiles for following
    const followingProfiles = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const followingData = doc.data();
        const userProfile = await getUserProfile(followingData.followingId);
        return {
          ...userProfile,
          followedAt: followingData.createdAt
        };
      })
    );
    
    console.log('Found following:', followingProfiles);
    return followingProfiles;
  } catch (error) {
    console.error('Error getting following:', error);
    throw error;
  }
};
