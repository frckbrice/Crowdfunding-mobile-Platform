// src/lib/react-query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 3, // Adjust retry behavior
            refetchOnWindowFocus: false, // Adjust based on app behavior
        },
    },
});
