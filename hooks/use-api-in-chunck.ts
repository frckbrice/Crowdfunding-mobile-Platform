// import { useState, useCallback, useEffect } from 'react';

// interface ChunkedApiOpsResult<T> {
//     data: T[];
//     isLoading: boolean;
//     hasMore: boolean;
//     loadMore: () => void;
//     refresh: () => void;
// }

// export function useChunkedApiOps<T>(
//     fetchFunction: (page: number, pageSize: number) => Promise<{ data: T[], total: number }>,
//     initialPageSize = 10
// ): ChunkedApiOpsResult<T> {




//     const [data, setData] = useState<T[]>([]);
//     const [page, setPage] = useState(1);
//     const [isLoading, setIsLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);

//     const fetchData = useCallback(async (reset = false) => {
//         if (isLoading) return;

//         setIsLoading(true);
//         try {
//             const currentPage = reset ? 1 : page;
//             const result = await fetchFunction(currentPage, initialPageSize);

//             setData(prevData =>
//                 reset
//                     ? result.data
//                     : [...prevData, ...result.data]
//             );

//             setPage(reset ? 1 : currentPage + 1);
//             setHasMore(data.length + result.data.length < result.total);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//             setHasMore(false);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [page, isLoading, initialPageSize]);

//     const loadMore = useCallback(() => {
//         if (hasMore && !isLoading) {
//             fetchData();
//         }
//     }, [hasMore, isLoading, fetchData]);

//     const refresh = useCallback(() => {
//         fetchData(true);
//     }, [fetchData]);

//     useEffect(() => {
//         fetchData(true);
//     }, []);

//     return {
//         data,
//         isLoading,
//         hasMore,
//         loadMore,
//         refresh
//     };
// }

import { useInfiniteQuery } from '@tanstack/react-query';

interface ChunkedApiOpsResult<T> {
    data: T[];
    isLoading: boolean;
    hasMore: boolean;
    loadMore: () => void;
    refresh: () => void;
}

export function useChunkedApiOps<T>(
    fetchFunction: (page: number, pageSize: number) => Promise<{ data: T[], total: number }>,
    initialPageSize = 10
): ChunkedApiOpsResult<T> {

    // Infinite query hook
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['chunkedData'],
        queryFn: ({ pageParam = 1 }) => fetchFunction(pageParam, initialPageSize),
        getNextPageParam: (lastPage, allPages) => {
            const loadedItems = allPages.reduce((acc, page) => acc + page.data.length, 0);
            return loadedItems < lastPage.total ? allPages.length + 1 : undefined;
        },
        initialPageParam: 1,
        retry: (failureCount, error) => {
            // TODO: provide custom retry logic here
            // For example, you can retry up to 3 times
            return !!error && failureCount < 3; // here we retry only if there is an error.
        },
    });

    // Flatten pages into a single data array
    const flattenedData = data?.pages.flatMap(page => page.data) || [];

    return {
        data: flattenedData,
        isLoading,
        hasMore: !!hasNextPage,
        loadMore: fetchNextPage,
        refresh: refetch,
        // isFetchingNextPage
    };
}
