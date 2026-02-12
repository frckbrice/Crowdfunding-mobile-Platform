//libraries
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Image, View } from "react-native";


export default function AuthLayout() {
    const router = useRouter();

    return (
        <>
            <Stack >
                <Stack.Screen
                    name="login"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="register"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="onboarding"
                    options={{
                        // headerShown: false,
                        headerStyle: {
                            backgroundColor: "#000",
                        },
                        headerTitle: () => (
                            <View style={{ alignItems: "center" }}>
                                <Image
                                    source={require("@/assets/images/icon.png")}
                                    resizeMode="contain"
                                    className="w-20 h-20"
                                />
                            </View>
                        ),

                    }}
                />

            </Stack>
            <StatusBar style="auto" />

        </>
    );
}
