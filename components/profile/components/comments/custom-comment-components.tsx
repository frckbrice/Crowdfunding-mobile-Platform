

// import React, { memo, useState, useCallback, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     TextInput,
//     KeyboardAvoidingView,
//     Platform,
//     Alert,
//     ActivityIndicator,
// } from 'react-native';
// import { Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { CommentItem, ExtendedComment } from './commentItem';
// import { useMutation } from '@tanstack/react-query';
// import { updateResource, uploadResourceData } from '@/lib/api';
// import { queryClient } from '@/lib/react-query-client';


// const EnhancedCommentSection = memo(({
//     post,
//     currentUser,
//     onAddComment,
//     onAddReply,
//     initialComments = []
// }: {
//     post: any;
//     currentUser: any;
//     onAddComment: (comment: Partial<ExtendedComment>) => Promise<any>;
//     onAddReply: (idParent: string, text: string) => Promise<any>;
//     initialComments?: ExtendedComment[];
// }) => {
//     const [comments, setComments] = useState<ExtendedComment[]>(initialComments);
//     const [isLoading, setIsLoading] = useState(false);
//     const [commentText, setCommentText] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [replyingTo, setReplyingTo] = useState<ExtendedComment | null>(null);

//     // Load initial comments
//     useEffect(() => {
//         if (initialComments?.length > 0) {
//             setComments(initialComments);
//         } else if (post?.comments?.length > 0) {
//             setComments(post.comments);
//         }
//     }, [initialComments, post?.comments]);

//     // Handle adding a new comment
//     const handleAddComment = useCallback(async () => {
//         if (!commentText.trim() || isSubmitting) return;

//         setIsSubmitting(true);

//         const newComment: Partial<ExtendedComment> = {
//             idPub: post?.id,
//             idUser: currentUser?.userId,
//             libeleCom: commentText,
//         };

//         try {
//             const result = await onAddComment(newComment);

//             if (result) {
//                 const formattedComment = {
//                     id: result.id,
//                     idPub: result.idPub,
//                     idUser: result.idUser,
//                     createdAt: result.createdAt,
//                     etatCom: result.etatCom,
//                     libeleCom: result.libeleCom,
//                     replies: result.replies?.length ? result.replies : [],
//                 } as ExtendedComment;

//                 // Update comments based on whether it's a reply or new comment
//                 setComments(prevComments => {
//                     if (replyingTo) {
//                         return prevComments.map(comment => {
//                             if (comment.id === replyingTo.id) {
//                                 return {
//                                     ...comment,
//                                     replies: [...(comment.replies || []), formattedComment]
//                                 };
//                             }
//                             return comment;
//                         });
//                     }
//                     return [formattedComment, ...prevComments];
//                 });

//                 setCommentText('');
//                 setReplyingTo(null);
//             }
//         } catch (error) {
//             Alert.alert('Error', 'Failed to add comment');
//         } finally {
//             setIsSubmitting(false);
//         }
//     }, [commentText, post?.id, currentUser?.userId, replyingTo, onAddComment]);

//     // Handle reply to comment
//     const handleReply = useCallback((comment: ExtendedComment) => {
//         setReplyingTo(comment);
//     }, []);

//     // Handle like comment
//     const handleLike = useCallback(async (commentId: string) => {
//         setComments(prevComments =>
//             prevComments.map(comment => {
//                 if (comment.id === commentId) {
//                     // Only increment if not already liked
//                     if (!comment.isLikedByCurrentUser) {
//                         return {
//                             ...comment,
//                             likes: (comment.likes || 0) + 1,
//                             isLikedByCurrentUser: true
//                         };
//                     }
//                 }
//                 return comment;
//             })
//         );
//     }, []);



//     return (
//         <View className="bg-gray-800 rounded-sm py-2">
//             {/* Comment Input Section */}
//             <KeyboardAvoidingView
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 className="mb-4"
//             >
//                 <View className="flex-row items-center bg-gray-700 rounded-[14px] w-full px-2 py-2">
//                     {currentUser?.photoUser ? (
//                         <Image
//                             source={{ uri: currentUser.photoUser }}
//                             className="w-8 h-8 rounded-full mr-2"
//                         />
//                     ) : (
//                         <View className="w-8 h-8 rounded-full mr-2 bg-gray-500 items-center justify-center">
//                             <Text className="text-white font-bold">
//                                 {currentUser?.nomUser?.slice(0, 2)}
//                             </Text>
//                         </View>
//                     )}
//                     <TextInput
//                         value={commentText}
//                         onChangeText={setCommentText}
//                         placeholder={"Laisser un commentaire..."}
//                         placeholderTextColor="#9CA3AF"
//                         multiline
//                         className="flex-1 text-white text-sm mr-2"
//                     />
//                     {isSubmitting ? (
//                         <ActivityIndicator size="small" color="#60A5FA" />
//                     ) : (
//                         <TouchableOpacity
//                             onPress={handleAddComment}
//                             disabled={!commentText?.trim() || isSubmitting}
//                         >
//                             <Ionicons
//                                 name="send"
//                                 size={24}
//                                 color={commentText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
//                             />
//                         </TouchableOpacity>
//                     )}
//                 </View>
//             </KeyboardAvoidingView>

//             {/* Comments List */}
//             {isLoading ? (
//                 <ActivityIndicator size="large" color="#60A5FA" />
//             ) : (
//                 comments.map((comment) => (
//                     <CommentItem
//                         key={comment.id}
//                         comment={comment}
//                         currentUser={currentUser}
//                         onReply={handleReply}
//                         onLike={handleLike}
//                         onAddReply={onAddReply}
//                         depth={0}
//                         maxDepth={3}
//                         commentAuthorId={comment?.idUser}
//                     />
//                 ))
//             )}
//         </View>
//     );
// });

// export default EnhancedCommentSection;

import React, { memo, useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommentItem, ExtendedComment } from './commentItem';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateResource, uploadResourceData } from '@/lib/api';
import { queryClient } from '@/lib/react-query-client';

const EnhancedCommentSection = memo(({
    post,
    currentUser,
    onAddComment,
    onAddReply,
    initialComments = []
}: {
    post: any;
    currentUser: any;
    onAddComment: (comment: Partial<ExtendedComment>) => Promise<any>;
    onAddReply: (idParent: string, text: string) => Promise<any>;
    initialComments?: ExtendedComment[];
}) => {
    const [comments, setComments] = useState<ExtendedComment[]>(initialComments);
    const [isLoading, setIsLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ExtendedComment | null>(null);
    const queryClient = useQueryClient();

    // Load initial comments
    useEffect(() => {
        if (initialComments?.length > 0) {
            setComments(initialComments);
        } else if (post?.comments?.length > 0) {
            setComments(post.comments);
        }
    }, [initialComments, post?.comments]);

    // Mutation to handle liking a comment or reply
    const likeMutation = useMutation({
        mutationFn: async ({ commentId, isReply, parentId }:
            { commentId: string; isReply: boolean; parentId?: string }) => {

            if (parentId) {
                const likeAreplyObj = {
                    id: commentId,
                    idParent: parentId,
                    idUser: currentUser?.userId,
                    idPub: post?.id,
                };
                // Handle liking a reply
                return await updateResource('commentaires', commentId, likeAreplyObj);
            } else {
                const likeComObj = {
                    id: commentId,
                    idUser: currentUser?.userId,
                    idPub: post?.id,
                };
                // Handle liking a comment
                return await updateResource('commentaires', commentId, likeComObj);
            }
        },
        onMutate: async ({ commentId, isReply, parentId }) => {
            // Optimistically update the UI
            setComments(prevComments =>
                prevComments.map(comment => {
                    if (comment.id === commentId) {
                        return {
                            ...comment,
                            likes: (comment.likes || 0) + 1,
                            isLikedByCurrentUser: true,
                        };
                    }
                    if (isReply && comment.replies) {
                        return {
                            ...comment,
                            replies: comment.replies.map(reply => {
                                if (reply.id === commentId) {
                                    return {
                                        ...reply,
                                        likes: (reply.likes || 0) + 1,
                                        isLikedByCurrentUser: true,
                                    };
                                }
                                return reply;
                            }),
                        };
                    }
                    return comment;
                })
            );
        },
        onError: (error, variables) => {
            // Rollback optimistic update
            setComments(prevComments =>
                prevComments.map(comment => {
                    if (comment.id === variables.commentId) {
                        return {
                            ...comment,
                            likes: (comment.likes || 0) - 1,
                            isLikedByCurrentUser: false,
                        };
                    }
                    if (variables.isReply && comment.replies) {
                        return {
                            ...comment,
                            replies: comment.replies.map(reply => {
                                if (reply.id === variables.commentId) {
                                    return {
                                        ...reply,
                                        likes: (reply.likes || 0) - 1,
                                        isLikedByCurrentUser: false,
                                    };
                                }
                                return reply;
                            }),
                        };
                    }
                    return comment;
                })
            );
            Alert.alert('Error', 'Failed to like comment');
        },
        onSuccess: () => {
            // Invalidate queries to refetch comments if needed
            queryClient.invalidateQueries({ queryKey: ['post-comments', post.id] });
        },
    });

    // Handle adding a new comment
    const handleAddComment = useCallback(async () => {
        if (!commentText.trim() || isSubmitting) return;

        setIsSubmitting(true);

        const newComment: Partial<ExtendedComment> = {
            idPub: post?.id,
            idUser: currentUser?.userId,
            libeleCom: commentText,
        };

        try {
            const result = await onAddComment(newComment);

            if (result) {
                const formattedComment = {
                    id: result.id,
                    idPub: result.idPub,
                    idUser: result.idUser,
                    createdAt: result.createdAt,
                    etatCom: result.etatCom,
                    libeleCom: result.libeleCom,
                    replies: result.replies?.length ? result.replies : [],
                } as ExtendedComment;

                // Update comments based on whether it's a reply or new comment
                setComments(prevComments => {
                    if (replyingTo) {
                        return prevComments.map(comment => {
                            if (comment.id === replyingTo.id) {
                                return {
                                    ...comment,
                                    replies: [...(comment.replies || []), formattedComment]
                                };
                            }
                            return comment;
                        });
                    }
                    return [formattedComment, ...prevComments];
                });

                setCommentText('');
                setReplyingTo(null);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add comment');
        } finally {
            setIsSubmitting(false);
        }
    }, [commentText, post?.id, currentUser?.userId, replyingTo, onAddComment]);

    // Handle reply to comment
    const handleReply = useCallback((comment: ExtendedComment) => {
        setReplyingTo(comment);
    }, []);

    // Handle like comment or reply
    const handleLike = useCallback((commentId: string, isReply: boolean, parentId?: string) => {
        likeMutation.mutate({ commentId, isReply, parentId });
    }, [likeMutation]);

    return (
        <View className="bg-gray-800 rounded-sm py-2">
            {/* Comment Input Section */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="mb-4"
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View className="flex-row items-center bg-gray-700 rounded-[14px] w-full px-2 py-2">
                    {currentUser?.photoUser ? (
                        <Image
                            source={{ uri: currentUser.photoUser }}
                            className="w-8 h-8 rounded-full mr-2"
                        />
                    ) : (
                        <View className="w-8 h-8 rounded-full mr-2 bg-gray-500 items-center justify-center">
                            <Text className="text-white font-bold">
                                {currentUser?.nomUser?.slice(0, 2)}
                            </Text>
                        </View>
                    )}
                    <TextInput
                        value={commentText}
                        onChangeText={setCommentText}
                        placeholder={"Laisser un commentaire..."}
                        placeholderTextColor="#9CA3AF"
                        multiline
                        className="flex-1 text-white text-sm mr-2"

                    />
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#60A5FA" />
                    ) : (
                        <TouchableOpacity
                            onPress={handleAddComment}
                            disabled={!commentText?.trim() || isSubmitting}
                        >
                            <Ionicons
                                name="send"
                                size={24}
                                color={commentText?.trim() && !isSubmitting ? '#60A5FA' : '#6B7280'}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* Comments List */}
            {isLoading ? (
                <ActivityIndicator size="large" color="#60A5FA" />
            ) : (
                comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        onReply={handleReply}
                        onLike={handleLike}
                        onAddReply={onAddReply}
                        depth={0}
                        maxDepth={3}
                        commentAuthorId={comment?.idUser}
                    />
                ))
            )}
        </View>
    );
});

export default EnhancedCommentSection;