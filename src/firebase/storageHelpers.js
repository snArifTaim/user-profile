import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

// Upload profile image to Firebase Storage
export const uploadProfileImage = async (uri, userId) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const filename = `profile_${userId}_${Date.now()}.jpg`;
        const storageRef = ref(storage, `profiles/${filename}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

// Upload post image to Firebase Storage
export const uploadPostImage = async (uri) => {
    try {
        const response = await fetch(uri);
        const blob = await response.blob();

        const filename = `post_${Date.now()}.jpg`;
        const storageRef = ref(storage, `posts/${filename}`);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
    } catch (error) {
        console.error('Error uploading post image:', error);
        throw error;
    }
};
