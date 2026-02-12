import { View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Post, User } from '@/lib/types'
import { tokenCache } from '@/store/persist-token-cache';
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET, TOKEN_KEY } from '@/constants/constants';
import { getResourceByItsId, getSingleResource } from '@/lib/api';

const useAuthorAndPubGlobal = () => {

    const [postAuthor, setPostAuthor] = useState<User | null>(null);
    const [currentPub, setCurrentPub] = useState<Post>();

    const getCurrentPost = async () => {
        return JSON.parse(await tokenCache.getToken('post') as string);
    };

    // get the author of this publication fromthe API
    const getPostAuthor = useCallback(async (idUser: string) => {
        try {
            console.log("\n\n current Post user ID ", idUser);
            const postAuthor = await getResourceByItsId(idUser as string, "User");
            setPostAuthor(postAuthor);
        } catch (error: any) {
            console.error(` failed to fetch a user by its id ${idUser} : ${error}`);
            throw Error(error);
        }
    }, [getResourceByItsId, setPostAuthor]);

    useEffect(() => {
        getCurrentPost().then((post: Post) => {
            setCurrentPub(post);
            getPostAuthor(post?.idUser as string)
        });
    }, []);

    const refetch = () => {
        getPostAuthor(currentPub?.idUser as string);
    };

    return { postAuthor, currentPub, refetch };
}

export default useAuthorAndPubGlobal;
