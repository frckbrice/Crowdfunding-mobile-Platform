import { getAllCategories } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';



export const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: getAllCategories,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1000 * 60, // 30 minutes
    });
};
