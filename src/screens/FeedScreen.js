import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { subscribeToPostsRealtime } from '../firebase/firestoreHelpers';
import PostCard from '../components/PostCard';

const FeedScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Set up real-time listener
        const unsubscribe = subscribeToPostsRealtime((updatedPosts) => {
            setPosts(updatedPosts);
            setLoading(false);
            setRefreshing(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        // The real-time listener will automatically update the posts
        setTimeout(() => setRefreshing(false), 1000);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptyText}>
                Be the first to create a post!
            </Text>
            <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigation.navigate('CreatePost')}
            >
                <Text style={styles.createButtonText}>Create Post</Text>
            </TouchableOpacity>
        </View>
    );

    const renderPost = ({ item }) => <PostCard post={item} />;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading feed...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#6366f1']}
                        tintColor="#6366f1"
                    />
                }
            />

            {/* Floating Action Buttons */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={[styles.fab, styles.fabSecondary]}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <Text style={styles.fabIcon}>👤</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => navigation.navigate('CreatePost')}
                >
                    <Text style={styles.fabIcon}>➕</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    createButton: {
        backgroundColor: '#6366f1',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    createButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        flexDirection: 'column',
        gap: 12,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    fabSecondary: {
        backgroundColor: '#8b5cf6',
    },
    fabIcon: {
        fontSize: 24,
    },
});

export default FeedScreen;
