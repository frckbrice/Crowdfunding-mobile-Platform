import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import useUserGlobal from '@/hooks/use-user-hook';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { QueryClientProvider } from '@tanstack/react-query';

import { ErrorBoundary } from '@/components/error-boundary';
import { queryClient } from '@/lib/react-query-client';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export function Layout() {
  // const colorScheme = useColorScheme();
  // // If the fonts fail to load, your splash screen might remain visible indefinitely. Verify the font file path:
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { currentUser } = useUserGlobal();


  useEffect(() => {
    if (error) throw error;
    if (loaded) {
      SplashScreen.hideAsync(); // to hide splash screen on android only.
      setIsLoading(false);
    }

  }, [loaded, error]);

  // Handle navigation based on auth state
  useEffect(() => {

    (async () => {
      if (!isLoading) {
        const token =
          await SecureStore.getItemAsync('currentUser');
        if (token)
          router.replace('/(tabulate)/accueil');
      }
    })();
  }, [currentUser, isLoading]);

  // if (isLoading) {
  //   return <SplashScreenComponent />;
  // }

  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(settings)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabulate)" options={{ headerShown: false }} />
        <Stack.Screen
          name="post/[id]"
          options={{
            // headerShown: false,
            headerTitle: 'Detail du rêve',
            headerStyle: {
              backgroundColor: '#111827',
              // reduce the height of the header
            },
            headerTitleStyle: {
              color: '#fff',
            },
            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => router.replace('/(tabulate)/accueil')} className='pr-4'>
                  <Ionicons name='arrow-back' size={24} color={'#fff'} className='p-4 bg-red-50' />
                </TouchableOpacity>
              );
            }
          }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="contribute/[idPub]"
          options={{
            headerTitle: 'Contribuer pour un rêve',
            // headerShown: false,
            headerStyle: {
              backgroundColor: '#111827',
              // reduce the height of the header
            },
            headerTitleStyle: {
              color: '#fff',
            },

            headerLeft: () => {
              return (
                <TouchableOpacity onPress={() => router.back()} className='pr-4 p-2 rounded-full bg-black-200'>
                  <Ionicons name='arrow-back' size={24} color={'#fff'} className='p-4 bg-red-50' />
                </TouchableOpacity>
              );
            }
          }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerTitle: 'Re-initialiser le mot de passe' }} />

      </Stack>
      <StatusBar style="light" animated networkActivityIndicatorVisible backgroundColor="#000" />
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout />
    </QueryClientProvider>
  );
}