import React from 'react';
import { View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreenComponent = () => {
    return (
        <View className="flex-1">
            <LinearGradient
                colors={['#87CEEB', '#4169E1']}
                className="flex-1 items-center justify-center"
            >
                <View className="w-24 h-24 bg-white/10 
                rounded-2xl shadow-lg flex
                 items-center justify-center relative">
                    <Image
                        source={require('@/assets/images/splash.png')}
                        className="w-full h-full rounded-2xl"

                        resizeMode="cover"
                    />
                </View>
            </LinearGradient>
        </View>
    );
};

export default SplashScreenComponent;
