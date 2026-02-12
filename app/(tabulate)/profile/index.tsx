import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useApiOps from '@/hooks/use-api';
import { Post } from '@/lib/types';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget } from '@/lib/api';
import { ActivityIndicator, FlatList, RefreshControl, View } from 'react-native';
import EmptyState from '@/components/empty-state';
import { usePathname } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useIsFocused } from '@react-navigation/native';


const SocialFeedScreen = () => {

    const { currentUser, currentUserObj } = useUserGlobal();
    const isFocused = useIsFocused();

    const [refreshing, setRefreshing] = useState(false);
    const pathname = usePathname();
    // const [isPostsLoading, setIsPostsLoading] = useState(false);
    // const [userPosts, setUserPosts] = useState<Post[]>([]);


    const getPublicationsOfThisUser = async () => {

        // setIsPostsLoading(true)
        if (!currentUser?.userId) return []

        try {
            const publications = await getAllResourcesByTarget<Post>(
                'publications', currentUser?.userId, 'idUser'); // get the publications made by this user with id : idUser
            // setUserPosts(publications?.data);
            return publications?.data;
        } catch (error) {
            console.error('Failed to get all publications:', error);
            return [];
        }
        // finally {
        //     setIsPostsLoading(false);
        // }
    }

    // optimistically fetch data when there is stale data or there is no data in the cache
    const { data: userPosts, isLoading, error, refetch } = useQuery({
        queryKey: ['publications', currentUser?.userId],
        queryFn: getPublicationsOfThisUser,
        enabled: !!currentUser?.userId,
        staleTime: 5 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
    })


    useEffect(() => {
        // if (pathname.toString().toLowerCase() === '/profile' )
        //     onRefresh();
        // if (pathname.toString().toLowerCase() === '/profile' && !userPosts?.length)
        if (isFocused)
            setTimeout(() => {
                // getPublicationsOfThisUser();
                refetch()
            }, 2000);
    }, [pathname, userPosts]);


    const onRefresh = React.useCallback(() => {
        if (!isLoading) {
            setRefreshing(true);
            getPublicationsOfThisUser().finally(() => setRefreshing(false));
        }
    }, [getPublicationsOfThisUser, isLoading]);

    if (isLoading)
        return (
            <View className='flex-1 justify-center items-center'>
                <ActivityIndicator size="small" color={'gray'} />
            </View>
        );

    return (
        <View className="flex-1 bg-gray-900 px-4 ">
            <FlatList
                // data={posts?.data}
                data={userPosts}
                keyExtractor={(post) => String(post?.id)}
                renderItem={({ item: post }) => {

                    return <PostCard
                        currentUser={currentUserObj}
                        currentPost={post}
                    />
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={() => (
                    <EmptyState
                        title="Aucun rêve"
                        subtitle="Commencer par publier un rêve."
                        label="Poster un rêve"
                        titleStyle='text-white font-bold text-[16px]'
                        subtitleStyle="text-[13px] text-center font-psemibold text-white"
                        route={'/poster'}
                    />
                )}
            />
        </View>
    );
};
export default SocialFeedScreen;