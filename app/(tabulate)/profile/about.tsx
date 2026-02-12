

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';
import { ProfileModal } from '@/components/profile/components/profile-details';
import { useIsFocused } from '@react-navigation/native';

const About: React.FC = () => {
    const { currentUser, currentUserObj } = useUserGlobal();
    const [isProfileModalVisible, setIsProfileModalVisible] = useState(false);
    const pathname = usePathname();
    const isFocused = useIsFocused();

    const hasModalBeenShown = useRef(false);

    useEffect(() => {
        // Check if modal should be shown only when component mounts or pathname changes
        const shouldShowModal =
            pathname === '/profile/about' &&
            currentUserObj?.id === currentUser?.userId &&
            !hasModalBeenShown.current;

        if (shouldShowModal) {
            hasModalBeenShown.current = true; // Prevent future modal triggers
            setIsProfileModalVisible(true);
        }
    }, [pathname, currentUser?.userId, currentUserObj?.id]);
    // Handler for closing modal
    const handleCloseModal = useCallback(() => {
        setIsProfileModalVisible(false);
    }, []);

    useEffect(() => {
        if (isFocused) {
            hasModalBeenShown.current = false;
        }
    }, [isFocused]);



    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 ">
            <ScrollView className='mb-10'>
                <View className="mb-2">
                    <Text className="text-white mb-2">Pseudo</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className='text-white'>{currentUserObj?.nomUser}</Text>
                    </View>
                </View>
                <View className="mb-2">
                    <Text className="text-white mb-2">Email</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className='text-white/75'>frckbrice@gmail.com</Text>
                    </View>
                </View>

                <View className="mb-2">
                    <Text className="text-white mb-2">Ville</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Text className='text-white/75'>{currentUserObj?.localisation ?? 'Origine non definie'}</Text>
                    </View>
                </View>
            </ScrollView>


            <ProfileModal
                isVisible={isProfileModalVisible}
                onClose={handleCloseModal}
                user={currentUserObj as any}
            />
        </SafeAreaView>
    );
};

export default About;