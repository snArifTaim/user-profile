import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ProfileHeader = ({ profile }) => {
    return (
        <View style={styles.container}>
            {/* Profile Image */}
            <View style={styles.imageContainer}>
                {profile?.photoURL ? (
                    <Image
                        source={{ uri: profile.photoURL }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.placeholderImage}>
                        <Text style={styles.placeholderText}>
                            {profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}
                        </Text>
                    </View>
                )}
            </View>

            {/* User Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{profile?.name || 'No Name'}</Text>
                {profile?.bio && (
                    <Text style={styles.bio}>{profile.bio}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    imageContainer: {
        marginBottom: 16,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
    },
    placeholderImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 48,
        color: '#fff',
        fontWeight: 'bold',
    },
    infoContainer: {
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    bio: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
});

export default ProfileHeader;
