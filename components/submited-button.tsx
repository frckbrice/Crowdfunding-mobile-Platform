import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, View, Text } from "react-native";
import React, { memo } from "react";

const renderSubmitButton = (
    submitStatus: "idle" | "loading" | "success" | "error",
    successButton: string,
    errorButton: string,
    defaultButton: string
) => {
    switch (submitStatus) {
        case 'loading':
            return <ActivityIndicator size="small" color="white" />;
        case 'success':
            return (
                <View className="flex-row items-center justify-center space-x-2">
                    <Text className="text-white text-center font-bold">{successButton}</Text>
                    <Ionicons name="checkmark-circle" size={20} color="white" />
                </View>
            );
        case 'error':
            return (
                <View className="flex-row items-center justify-center space-x-2">
                    <Text className="text-white text-center font-bold">{errorButton}</Text>
                    <Ionicons name="alert-circle" size={20} color="white" />
                </View>
            );
        default:
            return <Text className="text-white text-center font-bold">{defaultButton}</Text>;
    }
};

export default renderSubmitButton;