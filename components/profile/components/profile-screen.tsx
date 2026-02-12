import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllResourcesByTarget } from '@/lib/api';
import { Jaime, Publication } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { Colors } from '@/constants';
import { ProfileClickArea, ProfileModal } from './profile-details';

type TProfileScreen = {
    postsNumber: number;
    likesNumber: number;
    islikeLoading?: boolean;
    isPostsLoading?: boolean
}

const ProfileScreen: React.FC<TProfileScreen> = ({
    likesNumber,
    postsNumber,
    isPostsLoading,
    islikeLoading
}) => {

    const { currentUser, currentUserObj } = useUserGlobal();

    const router = useRouter();

    return (
        <>
            <View className="bg-gray-900 ">
                <View className="flex-row items-center mb-2 px-4 bg-gray-800 p-2 rounded-tl-xl rounded-tr-xl">
                    <Image
                        source={currentUserObj?.photoUser
                            ? { uri: currentUserObj?.photoUser }
                            : require('@/assets/images/1riche1povreAvatar.png')}
                        className="w-10 h-10 rounded-full mr-2" />
                    <View>
                        <Text className="text-white text-[14.5px] font-bold">{currentUser?.nomUser ?? "Anonymous"} </Text>
                        <Text className="text-gray-400">{currentUserObj?.localisation ?? "ville inconnue"}</Text>
                    </View>
                </View>

                <View className="flex-row justify-around mb-4">
                    <View>
                        <Text className="text-white text-center font-bold">

                            {isPostsLoading
                                ? <ActivityIndicator size="large" color={Colors.primary} />
                                : postsNumber || 0}
                        </Text>
                        <Text className="text-gray-400">Rêves</Text>
                    </View>
                    <View>
                        <Text className="text-white text-center font-bold">

                            {islikeLoading ? (
                                <ActivityIndicator size="large" color={Colors.primary} />
                            ) : likesNumber ?? 0}
                        </Text>
                        <Text className="text-gray-400">J'aime</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className="bg-blue-500 p-2 ml-4 rounded-xl mb-1 w-[90%]"
                    onPress={() => router.push("/(settings)/edit-profile")}
                >
                    <Text className="text-white text-center">Éditer profil</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default ProfileScreen;
