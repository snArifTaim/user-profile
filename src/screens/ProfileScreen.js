import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { getUserProfile } from '../firebase/firestoreHelpers';
import ProfileHeader from '../components/ProfileHeader';

// Using a fixed user ID for this demo
const DEMO_USER_ID = 'user123';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    // Reload profile when screen comes into focus
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadProfile();
        });
        return unsubscribe;
    }, [navigation]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const userProfile = await getUserProfile(DEMO_USER_ID);

            // If profile doesn't exist, create a default one
            if (!userProfile) {
                setProfile({
                    name: 'Demo User',
                    bio: 'Welcome to my profile! Click Edit Profile to customize.',
                    photoURL: null,
                });
            } else {
                setProfile(userProfile);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <ProfileHeader profile={profile} />

            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditProfile', { userId: DEMO_USER_ID })}
                >
                    <Text style={styles.editButtonText}>✏️ Edit Profile</Text>
                </TouchableOpacity>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Name:</Text>
                            <Text style={styles.infoValue}>{profile?.name || 'Not set'}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Bio:</Text>
                            <Text style={styles.infoValue}>
                                {profile?.bio || 'No bio added yet'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    content: {
        padding: 16,
    },
    editButton: {
        backgroundColor: '#6366f1',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    infoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '600',
        width: 80,
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
});

export default ProfileScreen;
