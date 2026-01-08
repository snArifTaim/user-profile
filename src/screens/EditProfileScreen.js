import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { getUserProfile, updateUserProfile, createUserProfile } from '../firebase/firestoreHelpers';
import { uploadProfileImage } from '../firebase/storageHelpers';
import { pickImageFromGallery } from '../utils/imagePicker';

const EditProfileScreen = ({ route, navigation }) => {
    const { userId } = route.params;
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [photoURL, setPhotoURL] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const profile = await getUserProfile(userId);
            if (profile) {
                setName(profile.name || '');
                setBio(profile.bio || '');
                setPhotoURL(profile.photoURL || null);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePickImage = async () => {
        const uri = await pickImageFromGallery();
        if (uri) {
            setImageUri(uri);
        }
    };

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        try {
            setUploading(true);

            let uploadedPhotoURL = photoURL;

            // Upload new image if selected
            if (imageUri) {
                uploadedPhotoURL = await uploadProfileImage(imageUri, userId);
            }

            // Update profile data
            const profileData = {
                name: name.trim(),
                bio: bio.trim(),
                photoURL: uploadedPhotoURL,
            };

            // Check if profile exists
            const existingProfile = await getUserProfile(userId);

            if (existingProfile) {
                await updateUserProfile(userId, profileData);
            } else {
                await createUserProfile(userId, profileData);
            }

            Alert.alert('Success', 'Profile updated successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('Error', 'Failed to save profile. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = () => {
        Alert.alert(
            'Remove Photo',
            'Are you sure you want to remove your profile photo?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: () => {
                        setImageUri(null);
                        setPhotoURL(null);
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    const displayImage = imageUri || photoURL;

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Photo Section */}
                <View style={styles.photoSection}>
                    <Text style={styles.sectionTitle}>Profile Photo</Text>
                    <View style={styles.photoContainer}>
                        {displayImage ? (
                            <Image
                                source={{ uri: displayImage }}
                                style={styles.photo}
                                resizeMode="cover"
                            />
                        ) : (
                            <View style={styles.photoPlaceholder}>
                                <Text style={styles.photoPlaceholderText}>
                                    {name ? name.charAt(0).toUpperCase() : '?'}
                                </Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.photoButtons}>
                        <TouchableOpacity
                            style={styles.photoButton}
                            onPress={handlePickImage}
                            disabled={uploading}
                        >
                            <Text style={styles.photoButtonText}>
                                {displayImage ? 'Change Photo' : 'Add Photo'}
                            </Text>
                        </TouchableOpacity>

                        {displayImage && (
                            <TouchableOpacity
                                style={[styles.photoButton, styles.removeButton]}
                                onPress={handleRemovePhoto}
                                disabled={uploading}
                            >
                                <Text style={styles.removeButtonText}>Remove</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {/* Name Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Name *</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                        editable={!uploading}
                    />
                </View>

                {/* Bio Input */}
                <View style={styles.inputSection}>
                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us about yourself..."
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={!uploading}
                    />
                    <Text style={styles.characterCount}>{bio.length} / 200</Text>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={[styles.saveButton, uploading && styles.saveButtonDisabled]}
                    onPress={handleSave}
                    disabled={uploading}
                >
                    {uploading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save Profile</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollContent: {
        padding: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    photoSection: {
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    photoContainer: {
        marginBottom: 16,
    },
    photo: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
    },
    photoPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    photoPlaceholderText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
    },
    photoButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    photoButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    photoButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    removeButton: {
        backgroundColor: '#ef4444',
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    inputSection: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fafafa',
    },
    bioInput: {
        height: 100,
        paddingTop: 12,
    },
    characterCount: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 4,
    },
    saveButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    saveButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;
