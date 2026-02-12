import { BlurView } from 'expo-blur';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomHeader from '@/components/custom-header';
import { StatusBar } from 'expo-status-bar';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';


export default function TabulateLayoutPage() {

  const router = useRouter();

  return (
    <SafeAreaProvider className='h-full'>
      <Tabs
        initialRouteName="accueil"
        screenOptions={{
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: 'gray',

          tabBarBackground: () => (
            // adding the blur with BlurView component.
            <BlurView
              intensity={80}
              tint='light'
              className={` bg-transparent `}
            />
          ),
          tabBarStyle: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderTopWidth: 0,
            elevation: 0,
            position: 'absolute',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            bottom: 0,
            left: 0,
            right: 0,
          }
        }}

      >
        <Tabs.Screen
          name="accueil"
          options={{
            title: 'Accueil',
            tabBarLabel: "Accueil",
            tabBarIcon: ({ size, color, focused }: { size: number, color: string, focused: boolean }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            header: () => <CustomHeader />,
            // headerTransparent: true
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: 'Recherche',
            tabBarLabel: "Recherche",
            tabBarIcon: ({ size, color, focused }: { size: number, color: string, focused: boolean }) => (
              <Ionicons name="search" size={size} color={color} />
            ),
            header: () => <CustomHeader />,
            // headerTransparent: true
          }}
        />
        <Tabs.Screen
          name="poster"
          options={{
            title: 'Poster',
            tabBarLabel: "Poster",
            tabBarIcon: ({ size, color, focused }: { size: number, color: string, focused: boolean }) => (
              <Ionicons name="add-outline" size={30} color={color} />
            ),
            header: () => <CustomHeader />,
            // headerTransparent: true
          }}
        />
        {/* <Tabs.Screen
          name="notifications"
          options={{
            title: '',
            tabBarLabel: "Notifications",
            tabBarIcon: ({ size, color, focused }: { size: number, color: string, focused: boolean }) => (
              <Ionicons name="notifications" size={size} color={color} />
            ),
            header: () => <CustomHeader />,
            // headerTransparent: true
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarLabel: "Profile",
            tabBarIcon: ({ size, color, focused }: { size: number, color: string, focused: boolean }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
            header: () => <CustomHeader />,
            // headerTransparent: true
          }}
        />

      </Tabs >
      <StatusBar style="light" networkActivityIndicatorVisible />

    </SafeAreaProvider>
  );
}