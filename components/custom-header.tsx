import * as React from 'react';
import { Colors } from '@/constants';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Href, Link, usePathname, useRouter } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';

const CustomHeader = () => {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const pathname = usePathname();

    console.log("\n\n current path: ", pathname);

    const {
        currentUserObj
    } = useUserGlobal();

    // currentUserObj?.photoUser &&
    return (
        <BlurView
            intensity={10}
            tint={'systemMaterialDark'}
            style={{
                paddingTop: top + 10,
                height: 60,
                borderTopWidth: 0.5,
                borderTopColor: Colors.light.tint,
                // borderBottomWidth: 0.5,
                // borderBottomColor: Colors.light.tint,
                padding: 0,
                margin: 0
            }}
            className={`pb-1 bg-gray-900 `}
        >
            <View

                className='flex-row  justify-between items-center gap-[10px] px-[20px] bg-transparent my-5'
            >
                {pathname.toString().toLowerCase() !== '/accueil' ?

                    <Link href={'/accueil' as Href<string>} asChild>
                        <TouchableOpacity

                            className='w-[36px] h-[36px] rounded-[20px] bg-[#626D77] justify-center items-center'
                        >
                            <Text style={{ color: '#fff', fontWeight: '500', fontSize: 16 }}>
                                <Ionicons name="arrow-back" size={22} color={'#fff'} />
                            </Text>
                        </TouchableOpacity>
                    </Link> : <Image
                        source={currentUserObj?.photoUser
                            ? { uri: currentUserObj?.photoUser }
                            : require("@/assets/images/1riche1povreAvatar.png")
                        }
                        className="w-10 h-10 rounded-full mr-2"
                        resizeMode='cover'
                    />}

                <TouchableOpacity onPress={() => router.push('/(settings)/parameters')}
                    className='w-[40px] h-[40px] rounded-[30px] bg-lightGray justify-center items-center'
                >
                    <Ionicons
                        name={'settings'}
                        size={30}
                        color={'white'}
                        className='text-darkness'
                    />
                </TouchableOpacity>
            </View>
        </BlurView>
    );
};

export default CustomHeader;
