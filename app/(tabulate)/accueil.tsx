

import React, { useMemo, useState, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    ActivityIndicator,
    RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import EmptyState from '@/components/empty-state';
import PublicationPost from '@/components/publication/post';
import { Post } from '@/lib/types';
import { useChunkedApiOps } from '@/hooks/use-api-in-chunck';
import { getAllPublications } from '@/lib/api';

const HomeScreen: React.FC = () => {
    const [refreshing, setRefreshing] = useState(false);
    // const [publications, setPublications] = useState<Post[]>([]);
    const {
        data: posts,
        isLoading: isLoadingPosts,
        loadMore,
        refresh,
        hasMore
    } = useChunkedApiOps<Post>(
        () => getAllPublications(1, 10),
        10
    );


    const uniquePosts = useMemo(() => {
        if (!posts?.length) return [];
        return posts.reduce((unique: Post[], post: Post) => {
            if (!unique.some((p: Post) => p.id === post.id)) {
                unique.push(post);
            }
            return unique;
        }, []);
    }, [posts]);

    const refreshData = useCallback(async () => {
        setRefreshing(true);
        refresh();
        setRefreshing(false);
    }, [refresh]);

    const renderPost = useCallback(({ item }: { item: Post }) => (
        <PublicationPost post={item} isPostDetail={false} />
    ), []);

    const renderHeader = useCallback(() => (
        <View className="px-4">
            <View className="flex-row justify-center items-center gap-2">
                <Text className="text-white text-sm font-bold">Donner pour aider</Text>
                <Image
                    source={require('../../assets/images/favicon.png')}
                    className="w-10 h-10"
                />
                <Text className="text-white text-sm font-bold">Recevoir pour rêver</Text>
            </View>
        </View>
    ), []);

    const renderEmpty = useCallback(() => (
        <EmptyState
            title="Aucun rêve publié"
            subtitle="Debutez votre premier rêve."
            label="Creer une Publication"
            titleStyle='text-white font-bold text-[16px]'
            subtitleStyle="text-[13px] text-center font-psemibold text-white"
            route={'/poster'}
        />
    ), []);

    const renderFooter = useCallback(() =>
        isLoadingPosts ? (
            <View className="items-center justify-center py-4">
                <ActivityIndicator size="large" color="green" />
            </View>
        ) : null,
        [isLoadingPosts]
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-900 pb-12">
            <FlatList
                data={uniquePosts}
                keyExtractor={(post) => String(post.id)}
                renderItem={renderPost}
                ListHeaderComponent={renderHeader}
                ListEmptyComponent={renderEmpty}
                ListFooterComponent={renderFooter}

                // Performance optimization
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                removeClippedSubviews={true}
                updateCellsBatchingPeriod={50}

                // Pagination
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}

                // Refresh control
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refreshData} />
                }
            />
        </SafeAreaView>
    );
};

export default HomeScreen;