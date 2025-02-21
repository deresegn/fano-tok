import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAzjhnTaniLl8zthA5F4Rb75pc32Q2vOnI",
  authDomain: "fano-tok.firebaseapp.com",
  projectId: "fano-tok",
  storageBucket: "fano-tok.appspot.com",
  messagingSenderId: "1092708603726",
  appId: "1:1092708603726:web:b513f63d472738b717b01f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Storage with custom settings
const storage = getStorage(app);
storage._customDomain = `https://${firebaseConfig.storageBucket}`;

export { storage };
export default app;
