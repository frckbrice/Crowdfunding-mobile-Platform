

// import React, { useCallback, useEffect, useState } from 'react';
// import { useIsFocused } from '@react-navigation/native';
// import {
//     createMaterialTopTabNavigator,
//     MaterialTopTabNavigationOptions,
//     MaterialTopTabNavigationEventMap
// } from "@react-navigation/material-top-tabs";
// import { ParamListBase, TabNavigationState } from "@react-navigation/native";
// import { withLayoutContext } from "expo-router";
// import { Header, ProfileScreen } from '@/components/profile';
// import useUserGlobal from '@/hooks/use-user-hook';
// import { getAllResourcesByTarget } from '@/lib/api';

// const { Navigator } = createMaterialTopTabNavigator();

// export const MaterialTopTabs = withLayoutContext<
//     MaterialTopTabNavigationOptions,
//     typeof Navigator,
//     TabNavigationState<ParamListBase>,
//     MaterialTopTabNavigationEventMap
// >(Navigator);

// export default function TrainingLayout() {
//     const { currentUser, currentUserObj } = useUserGlobal();
//     const isFocused = useIsFocused();

//     const [profileData, setProfileData] = useState({
//         likes: 0,
//         posts: 0,
//         isLikeLoading: false,
//         isPostsLoading: false,
//         lastFetchTimestamp: 0
//     });

//     // Cache invalidation time (5 minutes)
//     const CACHE_DURATION = 5 * 60 * 1000;

//     const userId = currentUser?.userId || currentUserObj?.id;

//     const fetchProfileData = useCallback(async (forceRefresh = false) => {
//         const now = Date.now();
//         const isCacheValid = (now - profileData.lastFetchTimestamp) < CACHE_DURATION;

//         // Return if data is cached and no force refresh
//         if (!forceRefresh && isCacheValid && profileData.likes > 0) {
//             return;
//         }

//         setProfileData(prev => ({
//             ...prev,
//             isLikeLoading: true,
//             isPostsLoading: true
//         }));

//         try {
//             const [likesResponse, postsResponse] = await Promise.all([
//                 getAllResourcesByTarget('likes', userId, 'idUser'),
//                 getAllResourcesByTarget('publications', userId, 'idUser')
//             ]);

//             setProfileData(prev => ({
//                 ...prev,
//                 likes: likesResponse?.data?.length ?? 0,
//                 posts: postsResponse?.data?.length ?? 0,
//                 lastFetchTimestamp: now,
//                 isLikeLoading: false,
//                 isPostsLoading: false
//             }));
//         } catch (error) {
//             console.error('Failed to fetch profile data:', error);
//             setProfileData(prev => ({
//                 ...prev,
//                 isLikeLoading: false,
//                 isPostsLoading: false
//             }));
//         }
//     }, [userId, profileData.lastFetchTimestamp, profileData.likes]);

//     // Initial fetch and screen focus handling
//     useEffect(() => {
//         if (isFocused && userId) {
//             fetchProfileData();
//         }
//     }, [isFocused, userId]);

//     const tabScreenOptions: MaterialTopTabNavigationOptions = {
//         tabBarActiveTintColor: '#fff',
//         tabBarInactiveTintColor: 'gray',
//         tabBarLabelStyle: {
//             fontSize: 15,
//             fontWeight: 'bold',
//             textTransform: 'capitalize',
//             padding: 0,
//         },
//         tabBarStyle: {
//             width: "100%",
//             backgroundColor: '#111827',
//             height: 47,
//             marginBottom: 0,
//         }
//     };

//     return (
//         <>
//             <Header />
//             <ProfileScreen
//                 likesNumber={profileData.likes}
//                 postsNumber={profileData.posts}
//                 isPostsLoading={profileData.isPostsLoading}
//                 islikeLoading={profileData.isLikeLoading}
//             />
//             <MaterialTopTabs screenOptions={tabScreenOptions}>
//                 <MaterialTopTabs.Screen name="index" options={{ title: 'Rêves' }} />
//                 <MaterialTopTabs.Screen name="about" options={{ title: 'A propos ' }} />
//                 <MaterialTopTabs.Screen name="favorites" options={{ title: 'Favoris' }} />
//             </MaterialTopTabs>
//         </>
//     );
// }

import React from 'react';
import { ParamListBase, TabNavigationState, useIsFocused } from '@react-navigation/native';
import {
    createMaterialTopTabNavigator,
    MaterialTopTabNavigationEventMap,
    MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { Header, ProfileScreen } from '@/components/profile';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function TrainingLayout() {
    const { currentUser, currentUserObj } = useUserGlobal();
    const isFocused = useIsFocused();

    const userId = currentUser?.userId || currentUserObj?.id;

    // Fetch profile data with react-query
    const { data: profileData, isLoading, refetch } = useQuery({
        queryKey: ['profileData', userId],
        queryFn: async () => {
            if (!userId) return { likes: 0, posts: 0 };

            const [likesResponse, postsResponse] = await Promise.all([
                getAllResourcesByTarget('likes', userId, 'idUser'),
                getAllResourcesByTarget('publications', userId, 'idUser')
            ]);

            return {
                likes: likesResponse?.data?.length ?? 0,
                posts: postsResponse?.data?.length ?? 0,
            };
        },
        enabled: !!userId,
        staleTime: CACHE_DURATION, // Prevent refetching within 5 minutes
        refetchOnWindowFocus: false, // Prevent refetching on focus
        refetchOnMount: false,       // Prevent refetching on mount if data is fresh
        refetchOnReconnect: true,    // Still refetch on network reconnects
    });

    // Trigger a refetch when screen gains focus
    React.useEffect(() => {
        if (isFocused) {
            refetch();
        }
    }, [isFocused, refetch]);

    const tabScreenOptions: MaterialTopTabNavigationOptions = {
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
            fontSize: 15,
            fontWeight: 'bold',
            textTransform: 'capitalize',
            padding: 0,
        },
        tabBarStyle: {
            width: "100%",
            backgroundColor: '#111827',
            height: 47,
            marginBottom: 0,
        }
    };

    return (
        <>
            <Header />
            <ProfileScreen
                likesNumber={profileData?.likes || 0}
                postsNumber={profileData?.posts || 0}
                isPostsLoading={isLoading}
                islikeLoading={isLoading}
            />
            <MaterialTopTabs screenOptions={tabScreenOptions}>
                <MaterialTopTabs.Screen name="index" options={{ title: 'Rêves' }} />
                <MaterialTopTabs.Screen name="about" options={{ title: 'A propos ' }} />
                <MaterialTopTabs.Screen name="favorites" options={{ title: 'Favoris' }} />
            </MaterialTopTabs>
        </>
    );
}
