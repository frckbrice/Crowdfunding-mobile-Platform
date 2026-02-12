

// import React, { useCallback, useEffect, useState } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import PostCard from '../../../components/profile/components/post-card';
// import useUserGlobal from '@/hooks/use-user-hook';
// import { getAllResourcesByTarget, getResourceByItsId } from '@/lib/api';
// import { ActivityIndicator, FlatList, View, RefreshControl } from 'react-native';
// import EmptyState from '@/components/empty-state';
// import { usePathname } from 'expo-router';

// const Favorites = () => {
//     const { currentUser, currentUserObj } = useUserGlobal();
//     const [refreshing, setRefreshing] = useState(false);
//     const pathname = usePathname();
//     const [favoritePosts, setFavoritePosts] = useState<any[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     // Memoize the function to fetch post author
//     const getPostAuthor = useCallback(async (idUser: string) => {
//         try {
//             const author = await getResourceByItsId(idUser, "users", "useUserGlobal");
//             return author;
//         } catch (error) {
//             console.error('Failed to get author:', error);
//             return null;
//         }
//     }, []);

//     // Fetch favorites and combine with author data
//     const fetchFavoritesWithAuthors = useCallback(async () => {
//         setIsLoading(true);
//         try {
//             // Get favorite posts
//             const favorites = await getAllResourcesByTarget(
//                 'favorites',
//                 currentUser?.userId,
//                 'idUser'
//             );

//             if (!favorites?.data) {
//                 setFavoritePosts([]);
//                 return;
//             }

//             // Get authors for each post
//             const postsWithAuthors = await Promise.all(
//                 favorites.data.map(async (fav: any) => {
//                     const author = await getPostAuthor(fav?.pub?.authorId);
//                     return {
//                         ...fav,
//                         pub: {
//                             ...fav.pub,
//                             pubId: fav?.idPub,
//                             ...(author || {})
//                         }
//                     };
//                 })
//             );

//             setFavoritePosts(postsWithAuthors.filter(post => post.pub)); // Filter out any posts without pub data
//         } catch (error) {
//             console.error('Failed to fetch favorites:', error);
//             setFavoritePosts([]);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [currentUser?.userId, getPostAuthor]);

//     // Handle refresh
//     const handleRefresh = useCallback(async () => {
//         if (!isLoading) {
//             setRefreshing(true);
//             await fetchFavoritesWithAuthors();
//             setRefreshing(false);
//         }
//     }, [fetchFavoritesWithAuthors, isLoading]);

//     // Initial fetch and pathname-based fetch
//     useEffect(() => {
//         if (currentUser?.userId && (
//             favoritePosts.length === 0 ||
//             pathname.toLowerCase() === '/profile/favorite'
//         )) {
//             fetchFavoritesWithAuthors();
//         }
//     }, [currentUser?.userId, pathname]);

//     if (isLoading) {
//         return (
//             <View className='flex-1 justify-center items-center bg-gray-900'>
//                 <ActivityIndicator size="large" color='gray' />
//             </View>
//         );
//     }

//     return (
//         <SafeAreaView className="flex-1 bg-gray-900 px-4 mb-6">
//             <FlatList
//                 data={favoritePosts}
//                 keyExtractor={(post) => String(post?.id)}
//                 renderItem={({ item: post }) => (
//                     <PostCard
//                         currentPost={post?.pub}
//                         currentUser={currentUserObj}
//                     />
//                 )}
//                 ListEmptyComponent={() => (
//                     <EmptyState
//                         title="Pas de publications favories..."
//                         subtitle="Vous devez ajouter au moins un rêve a vos favoris."
//                         label="Revenir a l'accueil"
//                         subtitleStyle="text-[14px] text-center text-white"
//                         route={'/accueil'}
//                         titleStyle='text-[17px] font-bold text-center text-white'
//                     />
//                 )}
//                 refreshControl={
//                     <RefreshControl
//                         refreshing={refreshing}
//                         onRefresh={handleRefresh}
//                         colors={['gray']}
//                         tintColor={'gray'}
//                     />
//                 }
//                 onEndReachedThreshold={0.5}
//                 showsVerticalScrollIndicator={false}
//             />
//         </SafeAreaView>
//     );
// };

// export default Favorites;



import React, { useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import PostCard from '../../../components/profile/components/post-card';
import useUserGlobal from '@/hooks/use-user-hook';
import { getAllResourcesByTarget, getResourceByItsId } from '@/lib/api';
import { ActivityIndicator, FlatList, View, RefreshControl } from 'react-native';
import EmptyState from '@/components/empty-state';
import { usePathname } from 'expo-router';
import { useQuery } from '@tanstack/react-query';

const Favorites = () => {
    const { currentUser, currentUserObj } = useUserGlobal();
    const pathname = usePathname();

    // Fetch post author using react-query
    const getPostAuthor = useCallback(async (idUser: string) => {
        try {
            const author = await getResourceByItsId(idUser, "users", "useUserGlobal");
            return author;
        } catch (error) {
            console.error('Failed to get author:', error);
            return null;
        }
    }, []);

    // Fetch favorite posts with authors
    const fetchFavoritesWithAuthors = async () => {
        if (!currentUser?.userId) return [];

        // Get favorite posts
        const favorites = await getAllResourcesByTarget(
            'favorites',
            currentUser.userId,
            'idUser'
        );

        if (!favorites?.data) return [];

        // Get authors for each post
        const postsWithAuthors = await Promise.all(
            favorites.data.map(async (fav: any) => {
                const author = await getPostAuthor(fav?.pub?.authorId);
                return {
                    ...fav,
                    pub: {
                        ...fav.pub,
                        pubId: fav?.idPub,
                        ...(author || {})
                    }
                };
            })
        );

        return postsWithAuthors.filter(post => post.pub); // Filter out posts without pub data
    };

    // Use react-query to fetch and cache favorite posts
    const {
        data: favoritePosts = [],
        isLoading,
        isRefetching,
        refetch
    } = useQuery({
        queryKey: ['favorites', currentUser?.userId], // Unique key for caching
        queryFn: fetchFavoritesWithAuthors,
        enabled: !!currentUser?.userId, // Only fetch if userId exists
        staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
        refetchOnMount: false,
        refetchOnReconnect: true,
        refetchOnWindowFocus: false
    });

    // Handle refresh
    const handleRefresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    if (isLoading) {
        return (
            <View className='flex-1 justify-center items-center bg-gray-900'>
                <ActivityIndicator size="large" color='gray' />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900 px-4 mb-6">
            <FlatList
                data={favoritePosts}
                keyExtractor={(post) => String(post?.id)}
                renderItem={({ item: post }) => (
                    <PostCard
                        currentPost={post?.pub}
                        currentUser={currentUserObj}
                    />
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="Pas de publications favories..."
                        subtitle="Vous devez ajouter au moins un rêve a vos favoris."
                        label="Revenir a l'accueil"
                        subtitleStyle="text-[14px] text-center text-white"
                        route={'/accueil'}
                        titleStyle='text-[17px] font-bold text-center text-white'
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefetching}
                        onRefresh={handleRefresh}
                        colors={['gray']}
                        tintColor={'gray'}
                    />
                }
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

export default Favorites;


















/***
 * this is the post card array 
 * [
    {
        "createdAt": "2025-02-03T05:21:32.283Z",
        "id": "cm6olsgor000dkas6hv1yc6f1",
        "idPub": "cm6o92cp50001kaianjte5jno",
        "idUser": "cm6gzoxh50000me2uurq70pz0",
        "pub": {
            "authorId": "cm6gzoxh50000me2uurq70pz0",
            "content": "Les enfants de la rue sont un phénomène qui requiert notre attention. Nous devons étudier les causes et penser aux solutions éventuelles afin de prévenir. Nous avons besoin d'un financement qui nous permettre de construire une école dans la ville de Yaoundé, précisément au lieu dit pont de la gare. Cette prendra en charge ces enfant qui voudront reprendre le chemin de l'école et nous pensons qu'avec de la sensibilisation nous arriverons a convaincre un grand nombre d'entre eux a re-croire a un avenir meilleur en suivant le chemin de l'école",
            "createdAt": "2025-01-28T21:28:32.042Z",
            "dateCrea": "2025-01-28T22:03:16.353Z",
            "dateNaiss": "2025-01-28T22:01:00.000Z",
            "datePub": "2025-02-02T23:25:17.233Z",
            "documentUrl": "file:///data/user/0/com.unricheunpauvre/cache/DocumentPicker/e8f9761e-e703-466a-982a-73b5b27b3f7c.pdf",
            "etat": false,
            "etatUser": false,
            "id": "cm6gzoxh50000me2uurq70pz0",
            "idCat": "cm6cxgwhk0001kajts2agiyl1",
            "idUser": "cm6gzoxh50000me2uurq70pz0",
            "imagePub": "file:///data/user/0/com.unricheunpauvre/cache/ImagePicker/a5c43194-1394-4c85-a323-b2d5afdcbcfd.jpeg",
            "libelePub": "Les enfants de la rue sont un phénomène qui requiert notre attention. Nous devons étudier les causes et penser aux solutions éventuelles afin de prévenir. Nous avons besoin d'un financement qui nous permettre de construire une école dans la ville de Yaoundé, précisément au lieu dit pont de la gare. Cette prendra en charge ces enfant qui voudront reprendre le chemin de l'école et nous pensons qu'avec de la sensibilisation nous arriverons a convaincre un grand nombre d'entre eux a re-croire a un avenir meilleur en suivant le chemin de l'école",
            "localisation": "Bafia",
            "mdpUser": "$2b$10$.gC3w.xdhSrUnIt/p/dCG.FIoe4o8toIE1GQR3atkpZ3IUzrOQY72",
            "montantEstime": 36490,
            "nomUser": "brice",
            "photoUser": "https://cloud.appwrite.io/v1/storage/buckets/6717f18b0023c23a8416/files/6799541e000e1d6329a8/preview?width=2000&height=2000&gravity=top&quality=100&project=66c879ad0013609a2ce8",
            "pieceIdb": null,
            "pieceIdf": "https://cloud.appwrite.io/v1/storage/buckets/6717f18b0023c23a8416/files/67995422002f10910d0b/preview?width=2000&height=2000&gravity=top&quality=100&project=66c879ad0013609a2ce8",
            "updatedAt": "2025-01-28T22:03:18.647Z",
            "username": "brice@gmail.com"
        },
        "updatedAt": "2025-02-03T05:21:32.283Z"
    }
]
 */