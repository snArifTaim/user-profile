import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PostCard = ({ post }) => {
    // Format timestamp
    const formatDate = (timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <View style={styles.card}>
            {/* Post Image */}
            {post.imageUrl && (
                <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.image}
                    resizeMode="cover"
                />
            )}

            {/* Caption */}
            <View style={styles.content}>
                {post.caption ? (
                    <Text style={styles.caption}>{post.caption}</Text>
                ) : null}

                {/* Timestamp */}
                {post.createdAt && (
                    <Text style={styles.timestamp}>
                        {formatDate(post.createdAt)}
                    </Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        marginBottom: 16,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: 300,
        backgroundColor: '#f0f0f0',
    },
    content: {
        padding: 16,
    },
    caption: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
});

export default PostCard;
