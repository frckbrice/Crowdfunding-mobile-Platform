

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import OnboardingScreen from './(auth)/onboarding';
import * as SecureStore from 'expo-secure-store';

const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563EB" />
    </View>
);

const IndexPage = () => {
    const [appState, setAppState] = useState<'loading' | 'onboarding' | null>(
        'loading'
    );
    const router = useRouter();

    useEffect(() => {
        const checkAuthAndOnboarding = async () => {
            try {

                // Check if user is authenticated
                const userToken = await SecureStore.getItemAsync('currentUser');

                // Wait to make sure all async operations are complete before deciding navigation
                if (userToken) {
                    // User is authenticated, go straight to accueil
                    console.log("User is authenticated, redirecting to home");
                    router.replace('/(tabulate)/accueil');
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
                // In case of error, default to onboarding
                setAppState('onboarding');
            }
        };

        checkAuthAndOnboarding();
    }, []);


    // Show loading screen while checking the state
    if (appState === 'loading') {
        return <LoadingScreen />;
    }

    // This will be reached if router.replace was called but hasn't completed yet
    return <LoadingScreen />;
};

export default IndexPage;