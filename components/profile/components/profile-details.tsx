import React, { memo, useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions
} from 'react-native';
import { Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatTimeAgo } from '@/lib/api';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.7;

// User type definition
type User = {
    createdAt: string | undefined;
    dateNaiss: Date | string;
    etatUser: boolean;
    id: string;
    localisation: string;
    mdpUser: string;
    nomUser: string;
    photoUser: string;
    pieceIdb: string;
    pieceIdf: string;
    username: string;
};

// ProfileModal Component
const ProfileModal = memo(({ isVisible, onClose, user }: {
    isVisible: boolean;
    onClose: () => void;
    user: User | null;
}) => {
    if (!user) return null;

    const router = useRouter();

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}

        >
            <View className="flex-1 bg-black/50 mt-32">
                <View className="bg-gray-800 rounded-t-3xl h-4/5">
                    <View className="flex-row justify-between items-center p-4 border-b border-gray-700">
                        <Text className="text-white text-lg ">detail de mon Profile</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-4">
                        {/* Profile Header */}
                        <View className="items-center mb-6">
                            <Image
                                source={user?.photoUser ? { uri: user?.photoUser } : require('@/assets/images/1riche1povreAvatar.png')}
                                className="w-24 h-24 rounded-full mb-3"
                            />
                            <Text className="text-white text-xl font-bold">{user?.nomUser}</Text>
                            <Text className="text-gray-400">@{user?.nomUser}</Text>
                        </View>

                        {/* Profile Details */}
                        <View className="space-y-2">
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <Ionicons name="location" size={20} color="white" className="mr-2" />
                                    <View>
                                        <Text className="text-gray-400 text-sm">Ville</Text>
                                        <Text className="text-white">{user?.localisation ?? 'Origine non definie'}</Text>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity
                                        className="bg-blue-500 p-2 ml-4 rounded-xl "
                                        onPress={() => router.push("/(settings)/edit-profile")}
                                    >
                                        <Text className="text-white text-center">
                                            <Ionicons name="pencil" size={30} color="white" className="mr-2" />
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <Ionicons name="calendar" size={20} color="white" className="mr-2" />
                                <View>
                                    <Text className="text-gray-400 text-sm">Membre depuis</Text>
                                    <Text className="text-white">
                                        {/* {format(new Date(user.dateCrea), 'MMMM dd, yyyy')} */}
                                        {new Date(user?.createdAt as string).toLocaleDateString('en-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <Ionicons name="person" size={20} color="white" className="mr-2" />
                                <View>
                                    <Text className="text-gray-400 text-sm">Date de naissance</Text>
                                    <Text className="text-white">
                                        {new Date(user?.dateNaiss).toLocaleDateString('en-FR', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-3">
                                <Ionicons name="radio-button-on" size={20}
                                    color={user?.etatUser ? '#4CAF50' : '#F44336'}
                                    className="mr-2"
                                />
                                <View>
                                    <Text className="text-gray-400 text-sm">Status</Text>
                                    <Text className="text-white">
                                        {user?.etatUser ? 'Active' : 'Inactive'}
                                    </Text>
                                </View>
                            </View>

                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
});

// Modify the profile click area in your existing PostPublication component
const ProfileClickArea = memo(({
    user,
    onPress,
    postDate
}:
    {
        user: any;
        onPress: () => void;
        postDate?: string
    }) => {

    // console.log("\n\n from profile clic component: ", user);

    return (
        <TouchableOpacity
            onPress={onPress}
            className="flex-row items-center"
        >
            <Image
                source={user?.photoUser ? { uri: user?.photoUser } : require('@/assets/images/1riche1povreAvatar.png')}
                className="w-10 h-10 rounded-full mr-2"
            />
            <View className="flex justify-center items-start">
                <Text className="text-white font-medium">
                    {user?.nomUser?.includes('@')
                        ? user?.nomUser?.substring(0, user?.nomUser.indexOf('@'))
                        : user?.nomUser}
                </Text>
                <Text className="text-gray-400 text-xs">{user?.localisation ?? 'Origine non definie'}</Text>
                <Text className="text-gray-400 text-xs">{formatTimeAgo(new Date(postDate as string))}</Text>
            </View>
        </TouchableOpacity>
    );
});

export { ProfileModal, ProfileClickArea };