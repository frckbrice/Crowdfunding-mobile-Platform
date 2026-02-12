
import React, { memo, useState } from "react";
import {
    Animated,
    Text,
} from "react-native";


const Toast = ({ message, isVisible, type = "error" }: { message: string, isVisible: boolean, type?: string }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    React.useEffect(() => {
        if (isVisible) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(3000),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    const backgroundColor = type === "error" ? "#FEE2E2" : "#ECFDF5";
    const textColor = type === "error" ? "#DC2626" : "#059669";
    const borderColor = type === "error" ? "#FECACA" : "#A7F3D0";

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                position: "absolute",
                top: -50,
                left: 0,
                right: 0,
                zIndex: 100,
                backgroundColor,
                borderColor,
            }}
            className={`px-4 py-2 rounded-lg border mx-4`}
            style={{
                backgroundColor,
                borderColor,
            }}
        >
            <Text
                style={{ color: textColor }}
                className="text-sm font-psemibold text-center"
            >
                {message}
            </Text>
        </Animated.View>
    );
};

export default memo(Toast);
