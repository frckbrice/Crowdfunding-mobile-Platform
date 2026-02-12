// libraries
import React,
{ createContext, useContext, useEffect, useState } from "react";

// local imports
import { getCurrentUser } from "@/lib/api";
import { Models } from "react-native-appwrite";

export const GlobalContext = createContext<{
    user: Models.Document | undefined | null;
    isLoggedIn: boolean;
    isLoading?: boolean;
}>(defaultValue);
export const useGlobalContext = () => useContext(GlobalContext);

const defaultValue = {
    user: null as Models.Document | undefined | null,
    isLoggedIn: false,
    isLoading: true,
};

const GlobalAppWriteProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<Models.Document | undefined | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            })
            .catch(() => {
                setIsLoggedIn(false);
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const value = { user, isLoggedIn, isLoading };
    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalAppWriteProvider;