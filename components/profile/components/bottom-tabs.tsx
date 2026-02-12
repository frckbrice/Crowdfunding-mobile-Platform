import React from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';



const BottomTab = () => (
    <View className="flex-row justify-between items-center px-4 py-2 bg-gray-900">
        <Ionicons name="home-outline" size={24} color="white" />
        <Ionicons name="search-outline" size={24} color="white" />
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Ionicons name="notifications-outline" size={24} color="white" />
        <Ionicons name="person-outline" size={24} color="white" />
    </View>
);

export default BottomTab;
