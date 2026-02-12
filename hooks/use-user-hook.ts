import React from 'react';
import JWT from 'expo-jwt';
import { EncodingKey, JWTBody, JWTDefaultBody } from 'expo-jwt/dist/types/jwt';
import { useRouter } from 'expo-router';
import { User } from '@/lib/types';
import { getResourceByItsId } from '@/lib/api';
import { TOKEN_KEY } from '@/constants/constants';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query-client';

const useUserGlobal = () => {
    const router = useRouter();

    // Fetch and decode the token
    const { data: currentUser, isLoading: isTokenLoading } = useQuery({
        queryKey: ['currentUserToken'],
        queryFn: async () => {
            const token = await SecureStore.getItemAsync('currentUser');
            if (!token) {
                throw new Error('No token found');
            }
            const decoded = JWT.decode(token, TOKEN_KEY as EncodingKey);
            return decoded;
        },
        staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    });

    // Fetch the current user profile
    const { data: currentUserObj, isLoading: isProfileLoading } = useQuery({
        queryKey: ['currentUserProfile', currentUser?.userId],
        queryFn: async () => {
            if (!currentUser?.userId) {
                throw new Error('No user ID found');
            }
            const user = await getResourceByItsId(currentUser.userId, 'users', 'useUserGlobal');
            return user;
        },
        enabled: !!currentUser?.userId, // Only fetch if userId exists
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
        retry(failureCount, error) {
            return !!error && failureCount < 3;
        },
    });

    // Verify onboarding and handle redirects
    const verifyOnboarding = React.useCallback(async () => {
        const onboardingSeen = await SecureStore.getItemAsync('hasSeenOnboarding');

        // If user is not logged in, handle onboarding
        if (onboardingSeen === 'true') {
            // User has seen onboarding but is not logged in, go to login
            console.log('User has seen onboarding but is not logged in, redirecting to /login');
            router.replace('/login');
        } else {
            // First time user, show onboarding
            console.log('First time user, showing onboarding');
            router.replace('/');
        }
    }, [currentUser, currentUserObj, router]);

    // Check token expiration and verify onboarding
    React.useEffect(() => {
        if (isTokenLoading || isProfileLoading) {
            // Do nothing while data is still loading
            return;
        }

        if (currentUser) {
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            if ((currentUser as { exp: number }).exp < currentTime) {
                Alert.alert('Votre session a expiré', 'Re-connectez vous');
                SecureStore.deleteItemAsync('currentUser'); // Clear expired token
                queryClient.invalidateQueries({ queryKey: ['currentUserToken'] }); // Invalidate token query
                queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] }); // Invalidate profile query
                router.replace('/login'); // Redirect to login
            }
        }
        else {
            SecureStore.getItemAsync('hasSeenOnboarding').then(onboardingSeen => {
                // If user is not logged in, handle onboarding
                if (onboardingSeen === 'true') {
                    // User has seen onboarding but is not logged in, go to login
                    console.log('User has seen onboarding but is not logged in, redirecting to /login');
                    SecureStore.deleteItemAsync('currentUser'); // Clear expired token
                    queryClient.invalidateQueries({ queryKey: ['currentUserToken'] }); // Invalidate token query
                    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] }); // Invalidate profile query
                    // Redirect to login
                    router.replace('/login');
                } else {
                    // First time user, show onboarding
                    console.log('First time user, showing onboarding');
                    router.replace('/');
                }
            });

        }
    }, [currentUser, isTokenLoading, isProfileLoading, queryClient]);

    return {
        currentUser,
        currentUserObj,
        isTokenLoading,
        isProfileLoading,
    };
};

export default useUserGlobal;