

const React = require('react');
import { useEffect, useState } from 'react';
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
                const userToken = await SecureStore.getItemAsync('currentUser');
                if (userToken) {
                    router.replace('/(tabulate)/accueil');
                } else {
                    setAppState('onboarding');
                }
            } catch {
                setAppState('onboarding');
            }
        };

        checkAuthAndOnboarding();
    }, [router]);

    if (appState === 'loading') {
        return <LoadingScreen />;
    }

    if (appState === 'onboarding') {
        return <OnboardingScreen />;
    }

    return <LoadingScreen />;
};

export default IndexPage;