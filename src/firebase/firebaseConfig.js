import { initializeApp } from 'firebase/app';
import { initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Replace with your Firebase project configuration
// Get this from Firebase Console > Project Settings > General > Your apps
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY?.trim(),
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim(),
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID?.trim(),
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim(),
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim(),
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID?.trim()
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
// Using memory cache to avoid "client offline" loops due to corrupted persistence
export const db = initializeFirestore(app, {
    localCache: memoryLocalCache(),
    experimentalForceLongPolling: true,
});

// Initialize Storage
export const storage = getStorage(app);

export default app;
