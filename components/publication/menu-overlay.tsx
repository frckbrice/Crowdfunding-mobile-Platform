import React, { memo, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Animated,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Post } from '@/lib/types';

// MenuOverlay component for the dropdown
const MenuOverlay = memo(({
    isVisible,
    onClose,
    onShare,
    onViewDetails,
    post,
    isPostDetail
}: {
    isVisible: boolean;
    onClose: () => void;
    onShare: () => void;
    onViewDetails: () => void;
    post: Post;
    isPostDetail?: boolean
}) => {
    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                className="flex-1"
                activeOpacity={1}
                onPress={onClose}
            >
                <View className="absolute top-16 right-2 bg-white rounded-lg shadow-lg w-48">
                    {!isPostDetail && <TouchableOpacity
                        onPress={onViewDetails}
                        className="flex-row items-center px-4 py-2 border-b border-gray-200"
                    >
                        <Ionicons name="document-text-outline" size={20} color="blue" />
                        <Text className="ml-2 text-black">Voir Detail</Text>
                    </TouchableOpacity>}

                    <TouchableOpacity
                        onPress={onShare}
                        className="flex-row items-center px-4 py-2"
                    >
                        <Ionicons name="share-social-outline" size={20} color="blue" />
                        <Text className="ml-2 text-black">Partager</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
});

export { MenuOverlay };