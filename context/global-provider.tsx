// libraries
import React,
{ createContext, useContext, useEffect, useState } from "react";

// local imports
import { getCurrentUser } from "@/lib/api";
import { Models } from "react-native-appwrite";

export const GlobalContext = createContext({});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalAppWriteProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<Models.Document | undefined | null>(null);
    const [isLoading, setLoading] = useState(true);
    // userID: frckbrice484065 pwd: +frckbrice@065484
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
            .catch((error: any) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return { user, isLoggedIn }
};

export default GlobalAppWriteProvider;