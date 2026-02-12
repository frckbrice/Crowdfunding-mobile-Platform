import useAuthorAndPubGlobal from '@/hooks/current-post-author';
import { Publication } from '@/lib/types';
import { Link } from 'expo-router';
import React, { memo } from 'react';
import { View, Text, Image, TouchableOpacity, } from 'react-native';

type PostCardProps = {
    currentUser: any
    currentPost: any
}

const PostCard = ({
    currentPost,
    currentUser
}: PostCardProps) => {

    // console.log("\n\n currentPost and currentUSer: ", currentPost, currentUser);



    return (

        <View className="bg-gray-800 rounded-lg px-2 pb-0 flex-row items-center p-2 py-1">
            <View className="flex items-center mb-2">
                <Image source={currentUser?.photoUser ?
                    { uri: currentUser?.photoUser } :
                    require("@/assets/images/1riche1povreAvatar.png")}
                    className="w-10 h-10 rounded-full mr-2"
                />
            </View>

            <View className="my-1 
            space-y-2 
            w-[85%]
            border-[0.1px]  border-gray-500 
            bg-gray-800
            rounded-lg
            shadow-xl p-2"
            >
                <Link href={`/post/${currentPost?.pubId}`} className='' asChild>
                    <TouchableOpacity>
                        <Text className="text-white mb-2   text-justify leading-4">
                            {currentPost?.content?.substring(0, 100)}...
                        </Text>
                        <View className="pt-1 mt-2 border-t border-gray-600">
                            <Text className="text-gray-400 font-bold text-xs">
                                envoyé par :
                                {currentPost?.nomUser ?? currentPost?.author?.nomUser} de {currentPost?.localisation ?? (currentPost?.author?.localisation || 'Origine non definie')}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>
        </View>
    );
}

export default memo(PostCard);
