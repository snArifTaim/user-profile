import React, { useState } from 'react';
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
import { createPost } from '../firebase/firestoreHelpers';
import { uploadPostImage } from '../firebase/storageHelpers';
import { pickImageFromGallery } from '../utils/imagePicker';

const CreatePostScreen = ({ navigation }) => {
    const [caption, setCaption] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handlePickImage = async () => {
        const uri = await pickImageFromGallery();
        if (uri) {
            setImageUri(uri);
        }
    };

    const handleCreatePost = async () => {
        if (!imageUri) {
            Alert.alert('Error', 'Please select an image for your post');
            return;
        }

        if (!caption.trim()) {
            Alert.alert('Error', 'Please add a caption to your post');
            return;
        }

        try {
            setUploading(true);

            // Upload image to Firebase Storage
            const imageUrl = await uploadPostImage(imageUri);

            // Create post in Firestore
            await createPost({
                imageUrl,
                caption: caption.trim(),
            });

            Alert.alert('Success', 'Post created successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Clear form
                        setCaption('');
                        setImageUri(null);
                        // Navigate back to feed
                        navigation.navigate('Feed');
                    },
                },
            ]);
        } catch (error) {
            console.error('Error creating post:', error);
            Alert.alert('Error', 'Failed to create post. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        if (imageUri || caption) {
            Alert.alert(
                'Discard Post?',
                'Are you sure you want to discard this post?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    {
                        text: 'Discard',
                        style: 'destructive',
                        onPress: () => {
                            setCaption('');
                            setImageUri(null);
                            navigation.goBack();
                        },
                    },
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Image Section */}
                <View style={styles.imageSection}>
                    <Text style={styles.sectionTitle}>Post Image *</Text>
                    {imageUri ? (
                        <View>
                            <Image
                                source={{ uri: imageUri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.changeImageButton}
                                onPress={handlePickImage}
                                disabled={uploading}
                            >
                                <Text style={styles.changeImageText}>Change Image</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.imagePlaceholder}
                            onPress={handlePickImage}
                            disabled={uploading}
                        >
                            <Text style={styles.imagePlaceholderIcon}>📷</Text>
                            <Text style={styles.imagePlaceholderText}>
                                Tap to select an image
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Caption Input */}
                <View style={styles.captionSection}>
                    <Text style={styles.sectionTitle}>Caption *</Text>
                    <TextInput
                        style={styles.captionInput}
                        value={caption}
                        onChangeText={setCaption}
                        placeholder="Write a caption for your post..."
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        editable={!uploading}
                        maxLength={500}
                    />
                    <Text style={styles.characterCount}>{caption.length} / 500</Text>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.cancelButton]}
                        onPress={handleCancel}
                        disabled={uploading}
                    >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.button,
                            styles.postButton,
                            uploading && styles.postButtonDisabled,
                        ]}
                        onPress={handleCreatePost}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.postButtonText}>Post</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {uploading && (
                    <View style={styles.uploadingContainer}>
                        <Text style={styles.uploadingText}>
                            Uploading your post...
                        </Text>
                    </View>
                )}
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
    imageSection: {
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },
    changeImageButton: {
        marginTop: 12,
        padding: 12,
        backgroundColor: '#6366f1',
        borderRadius: 8,
        alignItems: 'center',
    },
    changeImageText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    imagePlaceholder: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#d0d0d0',
        backgroundColor: '#fafafa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    imagePlaceholderText: {
        fontSize: 16,
        color: '#999',
    },
    captionSection: {
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
    captionInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#fafafa',
        height: 120,
        paddingTop: 12,
    },
    characterCount: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#d0d0d0',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    postButton: {
        backgroundColor: '#6366f1',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    postButtonDisabled: {
        backgroundColor: '#9ca3af',
    },
    postButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    uploadingContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#e0e7ff',
        borderRadius: 8,
        alignItems: 'center',
    },
    uploadingText: {
        color: '#6366f1',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default CreatePostScreen;
