
import React from 'react';
import { View, Text, Image, } from 'react-native';



const Header = () => (
    <View style={{ marginTop: 20 }}>
        <View className="flex-row 
    justify-evenly items-center px-10 py-4 pt-2 bg-gray-900 gap-6">
            <Text className="text-white text-sm  mt-2">Donner pour aider</Text>
            <Image source={require('../../../assets/images/favicon.png')} className="w-10 h-10 mt-2" />
            <Text className="text-white text-sm  mt-2">Recevoir pour rêver</Text>
        </View>
    </View>
);

export default Header;
