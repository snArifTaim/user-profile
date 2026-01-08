import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

// Request media library permissions
export const requestMediaLibraryPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert(
            'Permission Required',
            'Sorry, we need camera roll permissions to upload images!'
        );
        return false;
    }
    return true;
};

// Pick an image from the gallery
export const pickImageFromGallery = async () => {
    try {
        // Request permissions
        const hasPermission = await requestMediaLibraryPermissions();
        if (!hasPermission) {
            return null;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        // Check if user cancelled
        if (result.canceled) {
            return null;
        }

        // Return the selected image URI
        return result.assets[0].uri;
    } catch (error) {
        console.error('Error picking image:', error);
        Alert.alert('Error', 'Failed to pick image. Please try again.');
        return null;
    }
};
