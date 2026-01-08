import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebaseConfig';

// Upload profile image to Firebase Storage
export const uploadProfileImage = async (uri, userId) => {
    try {
        // Fetch the image from the local URI
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create a reference to the storage location
        const filename = `profile_${userId}_${Date.now()}.jpg`;
        const storageRef = ref(storage, `profiles/${filename}`);

        // Upload the image
        console.log('Uploading profile image...');
        await uploadBytes(storageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Profile image uploaded successfully');

        return downloadURL;
    } catch (error) {
        console.error('Error uploading profile image:', error);
        throw error;
    }
};

// Upload post image to Firebase Storage
export const uploadPostImage = async (uri) => {
    try {
        // Fetch the image from the local URI
        const response = await fetch(uri);
        const blob = await response.blob();

        // Create a reference to the storage location
        const filename = `post_${Date.now()}.jpg`;
        const storageRef = ref(storage, `posts/${filename}`);

        // Upload the image
        console.log('Uploading post image...');
        await uploadBytes(storageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Post image uploaded successfully');

        return downloadURL;
    } catch (error) {
        console.error('Error uploading post image:', error);
        throw error;
    }
};
