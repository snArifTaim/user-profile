import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    query,
    orderBy,
    getDocs,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// Get user profile
export const getUserProfile = async (userId) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            return { id: userDoc.id, ...userDoc.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        throw error;
    }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        });
        console.log('Profile updated successfully');
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

// Create or update user profile (used for initial setup)
export const createUserProfile = async (userId, profileData) => {
    try {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, {
            ...profileData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        console.log('Profile created successfully');
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw error;
    }
};

// Create a new post
export const createPost = async (postData) => {
    try {
        const postsRef = collection(db, 'posts');
        const newPost = await addDoc(postsRef, {
            ...postData,
            createdAt: serverTimestamp()
        });
        console.log('Post created with ID:', newPost.id);
        return newPost.id;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// Get all posts
export const getPosts = async () => {
    try {
        const postsQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(postsQuery);

        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ id: doc.id, ...doc.data() });
        });

        return posts;
    } catch (error) {
        console.error('Error getting posts:', error);
        throw error;
    }
};

// Subscribe to real-time posts updates
export const subscribeToPostsRealtime = (callback) => {
    try {
        const postsQuery = query(
            collection(db, 'posts'),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
            const posts = [];
            querySnapshot.forEach((doc) => {
                posts.push({ id: doc.id, ...doc.data() });
            });
            callback(posts);
        }, (error) => {
            console.error('Error in real-time listener:', error);
        });

        return unsubscribe;
    } catch (error) {
        console.error('Error setting up real-time listener:', error);
        throw error;
    }
};
