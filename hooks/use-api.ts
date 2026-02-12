
// import libs
import { useEffect, useRef, useState } from "react";

const useApiOps = <T>(fn: () => Promise<T | T[]>,): T | T[] | any => {
    const [data, setData] = useState<T | T[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const abortController = useRef<AbortController | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        // Cancel previous request if exists
        abortController.current?.abort();
        abortController.current = new AbortController();
        setIsLoading(true);
        fn()
            .then((res: any) => {
                console.log("\n\n from use api ops", res);
                if (res)
                    return setData(res);
            })
            .catch((err: any) => {
                if (err.name !== 'AbortError') {
                    setError(err as Error);
                    console.error('API Error:', err);
                }
                console.error("Error", err.message)
                setData([]);
            })
            .finally(() => setIsLoading(false));
    }

    useEffect(() => {
        fetchData()
    }, []);

    // called when refresh the screen from home screen
    const refetch = () => fetchData()

    return { isLoading, data, refetch, error };
}

export default useApiOps;
