import React from 'react';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';



export default function App() {
    return (
        <>
            <Stack screenOptions={{ headerShown: false }} initialRouteName="parameters" >

                <Stack.Screen name="AccountIdentification" options={{ headerShown: false }} />
                <Stack.Screen name="modifier-pwd" options={{ headerShown: false }} />
                <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
                <Stack.Screen name="politique-confidentialite" options={{ headerShown: false }} />
                <Stack.Screen name="parameters" options={{ headerShown: false }} />

            </Stack>
            <StatusBar style="light" animated networkActivityIndicatorVisible backgroundColor='#000' />
        </>
    );
}