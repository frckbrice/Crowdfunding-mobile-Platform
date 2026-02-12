

import React, { memo, useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/lib/types';
import { useQuery } from '@tanstack/react-query';
import { getResourceByItsId } from '@/lib/api';

export interface ExtendedComment {
    id?: string;
    idPub?: string;
    idUser?: string;
    libeleCom?: string;
    createdAt: string;
    etatCom?: boolean;
    replies?: ExtendedComment[];
    idParent?: string | null;
    userName?: string;
    photoUser?: string;
    replyToUser?: string;
    likes?: number;
    isReplied?: boolean;
    isLikedByCurrentUser?: boolean;
}

interface CommentItemProps {
    comment: ExtendedComment;
    currentUser: User;
    onReply: (comment: ExtendedComment) => void;
    onLike: (commentId: string, isReply: boolean, parentId?: string) => void
    onAddReply: (idParent: string, text: string) => Promise<any>;
    depth?: number;
    maxDepth?: number;
    commentAuthorId?: string;
}

const CommentItem = memo(({
    comment,
    currentUser,
    onReply,
    onLike,
    onAddReply, // persist the reply of a comment to a database
    depth = 0,
    maxDepth = 3,
}: CommentItemProps) => {
    // State
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [localLikeState, setLocalLikeState] = useState({
        isLiked: comment?.isLikedByCurrentUser || false, //comment.isLikedByCurrentUser this is fake
        count: comment?.likes || 0,
        isProcessing: false
    });

    console.log("\n\n comment: ", comment);    // we fetch the author of each comment
    const { data: commentAuthor } = useQuery({
        queryKey: ["comment_author", comment?.idUser],
        queryFn: async () => {
            const author = await getResourceByItsId(comment?.idUser as string, "users", "useUserGlobal");
            return author;
        },
        enabled: !!comment?.idUser,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: Infinity,
    })

    // Animation
    const scaleAnim = useRef(new Animated.Value(1)).current;


    // Handlers
    const handleLike = useCallback(() => {
        if (localLikeState.isProcessing) return;

        setLocalLikeState(prev => ({
            ...prev,
            isProcessing: true
        }));

        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1.2,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                useNativeDriver: true,
            }),
        ]).start();

        // Only proceed with like if not already liked
        if (!localLikeState.isLiked) {
            setLocalLikeState(prev => ({
                isLiked: true,
                count: prev.count + 1,
                isProcessing: false
            }));
            onLike(comment.id as string, !!comment.idParent, comment.idParent as string);
        }
        setLocalLikeState(prev => ({
            isLiked: true,
            count: prev.count - 1,
            isProcessing: false
        }));

        // only allow onLike, and don't consider unlike.
        // onLike(comment.id as string, !!comment.idParent, comment.idParent as string);
    }, [comment.id, localLikeState.isLiked, localLikeState.isProcessing, onLike, scaleAnim]);

    const handleReplyPress = useCallback(() => {
        setIsReplying(true);
        onReply(comment);
    }, [comment, onReply]);

    const handleSubmitReply = useCallback(async () => {
        if (!replyText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onAddReply(comment.id as string, replyText);
            setReplyText('');
            setIsReplying(false);
            setShowReplies(true);
        } catch (error) {
            console.error('Error submitting reply:', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [comment.id, replyText, isSubmitting, onAddReply]);

    return (
        <View className={`flex-row mb-2 ${depth > 0 ? 'ml-0' : ''}`}>
            <Image
                source={currentUser?.photoUser ? { uri: currentUser?.photoUser } : require('@/assets/images/1riche1povreAvatar.png')}
                className="w-8 h-8 rounded-full mr-2"
            />

            <View className="flex-1">
                {/* Comment Content */}
                <View className="bg-gray-700 rounded-2xl px-3 py-2">
                    <Text className="text-gray-400 font-medium text-[11px]">
                        {commentAuthor?.nomUser || 'User'}
                    </Text>
                    {comment?.replyToUser && commentAuthor && (
                        <Text className="text-blue-400 text-xs mb-1">
                            Répondre à @{commentAuthor.nomUser}
                        </Text>
                    )}
                    <Text className="text-white text-sm mt-1">{comment?.libeleCom}</Text>
                </View>

                {/* Actions Section */}
                <View className="flex-row items-center mt-1 ml-2 space-x-4">
                    {/* Like Button */}
                    <TouchableOpacity
                        onPress={handleLike}
                        disabled={localLikeState.isProcessing}
                        className="flex-row items-center space-x-1"
                    >
                        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                            {localLikeState.isProcessing ? (
                                <ActivityIndicator size="small" color="#60A5FA" />
                            ) : (
                                <Ionicons
                                    name={localLikeState.isLiked ? "heart" : "heart-outline"}
                                    size={16}
                                    color={localLikeState.isLiked ? "#EF4444" : "#9CA3AF"}
                                />
                            )}
                        </Animated.View>
                        <Text className={`text-xs ${localLikeState.isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                            {localLikeState.count}
                        </Text>
                    </TouchableOpacity>

                    {/* Reply Button */}
                    {depth < maxDepth && (
                        <TouchableOpacity
                            onPress={handleReplyPress}
                            className="flex-row items-center space-x-1"
                        >
                            <Ionicons name="chatbubble-outline" size={16} color="#9CA3AF" />
                            <Text className="text-xs text-gray-400">Répondre</Text>
                        </TouchableOpacity>
                    )}

                    {/* Timestamp */}
                    <Text className="text-xs text-gray-500">
                        {new Date(comment?.createdAt).toLocaleString()}
                    </Text>
                </View>

                {/* Reply Input */}
                {isReplying && (
                    <View className="mt-2">
                        <View className="flex-row items-center bg-gray-600 rounded-full px-3 py-1">
                            <TextInput
                                value={replyText}
                                onChangeText={setReplyText}
                                placeholder={`Répondre à ${commentAuthor?.nomUser}...`}
                                placeholderTextColor="#9CA3AF"
                                className="flex-1 text-white text-sm"
                            />
                            {isSubmitting ? (
                                <ActivityIndicator size="small" color="#60A5FA" className="ml-2" />
                            ) : (
                                <TouchableOpacity
                                    onPress={handleSubmitReply}
                                    disabled={!replyText?.trim() || isSubmitting}
                                    className="ml-2"
                                >
                                    <Ionicons
                                        name="send"
                                        size={20}
                                        color={replyText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}

                {/* Nested Replies */}
                {comment?.replies && comment.replies.length > 0 && (
                    <View className="mt-2">
                        {!showReplies ? (
                            <TouchableOpacity
                                onPress={() => setShowReplies(true)}
                                className="flex-row items-center"
                            >
                                <View className="w-8 h-0.5 bg-gray-600" />
                                <Text className="text-blue-400 text-sm ml-2">
                                    {comment.replies.length} réponse {comment.replies.length === 1 ? '' : 's'}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View>
                                {comment.replies.map((reply) => (
                                    <CommentItem
                                        key={reply.id}
                                        comment={reply}
                                        currentUser={currentUser}
                                        onReply={onReply}
                                        onLike={onLike}
                                        onAddReply={onAddReply}
                                        depth={depth + 1}
                                        maxDepth={maxDepth}
                                        commentAuthorId={comment?.idUser}
                                    />
                                ))}
                                <TouchableOpacity
                                    onPress={() => setShowReplies(false)}
                                    className="mt-1"
                                >
                                    <Text className="text-blue-400 text-sm">Masquer les réponses</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
});

export { CommentItem };