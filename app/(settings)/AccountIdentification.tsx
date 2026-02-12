// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';
// import { getFileUrlFromProvider, patchResource } from '@/lib/api';
// import useUserGlobal from '@/hooks/use-user-hook';

// interface UploadedFile {
//     uri?: string;
//     //   type: string;
//     //   name: string;
//     editProfile?: boolean;
//     classname?: string;
//     getIdData: (data: any, fileType: "idFront" | "idBack" | "passport") => void
// }

// const AccountIdentificationScreen: React.FC<UploadedFile> = ({ editProfile,
//     getIdData
// }) => {
//     const router = useRouter();
//     const [showIdOptions, setShowIdOptions] = useState(false);
//     const [files, setFiles] = useState<{
//         idFront?: any;
//         idBack?: any;
//         passport?: any;
//     }>({});

//     const [isUploading, setUploading] = useState(false);
//     const [idF, setIdf] = useState("");
//     const [idB, setIdB] = useState("");

//     const { currentUser } = useUserGlobal();

//     const pickImage = async (fileType: 'idFront' | 'idBack' | 'passport') => {
//         // Request permissions
//         const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//         if (permissionResult.granted === false) {
//             Alert.alert('Permission requise', 'Vous devez allouer des droits d\'access a votre camera.');
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: false,
//             aspect: [4, 3],
//             quality: 1,
//         });

//         if (!result.canceled) {
//             setFiles(prev => ({
//                 ...prev,
//                 [fileType]: result.assets[0],
//             }));

//         }
//     };

//     const handleSubmit = async () => {
//         setUploading(true)
//         try {
//             // Create FormData instance
//             const formData = new FormData();
//             let userData: any = {};
//             let idFrontUrl, idBackUrl, passportUrl;
//             if (files.idFront && files.idBack) {
//                 // get the url link from appWrite
//                 [idFrontUrl, idBackUrl] = await Promise.all([
//                     getFileUrlFromProvider(files.idFront),
//                     getFileUrlFromProvider(files.idBack),
//                 ]);
//             }

//             if (files?.passport)
//                 passportUrl = await getFileUrlFromProvider(files.passport)

//             if (files.idFront && files.idBack)
//                 userData = {
//                     idUser: currentUser?.userId,
//                     idFront: idFrontUrl,
//                     idBack: idBackUrl,
//                 }
//             else if (files.passport)
//                 userData = {
//                     idUser: currentUser?.userId,
//                     passport: passportUrl,
//                     idBack: null
//                 }
//             else return;

//             // only consider the back face od if if it's Id that is chosen. in other case only passport is sent as Identification element.
//             const dataObj = {
//                 pieceIdf: !(files.idFront && files.idBack) ? passportUrl : idFrontUrl || idF,
//                 pieceIdb: files.idBack ? idBackUrl : idB,
//             };

//             console.log("\n\n object to load: ", dataObj);

//             if ((!dataObj.pieceIdb && !dataObj.pieceIdf) || currentUser?.userId)
//                 return console.error(`no identification piece added or no current user id ${currentUser?.userId} found`);


//             const result = await patchResource(
//                 'users',
//                 currentUser?.IdUser,
//                 dataObj,
//             );
//             Alert.alert('Success', 'Profile mis a jour avec succes!');
//             router.push('/(tabulate)/profile');
//         } catch (err) {
//             console.error(JSON.stringify(err, null, 2));
//         } finally {
//             setUploading(false);
//         }
//     };

//     const renderFilePreview = (file?: UploadedFile) => {
//         if (!file) return null;
//         return (
//             <Image
//                 source={{ uri: file.uri }}
//                 className="w-20 h-20 rounded-lg mt-2"
//                 resizeMode="cover"
//             />
//         );
//     };

//     return (
//         <SafeAreaView className="flex-1 bg-gray-900 p-4">
//             <ScrollView>
//                 {!editProfile ? <View className="flex-row items-center mb-6">
//                     <TouchableOpacity onPress={() => router.replace('/(settings)/parameters')}>
//                         <Ionicons name="arrow-back" size={24} color="white" />
//                     </TouchableOpacity>
//                     <Text className="text-white text-xl font-bold ml-4">Identification de compte</Text>
//                 </View> : null}

//                 <Text className={editProfile ? "text-white text-[12px] mb-4" : "text-white text-lg mb-6"}>Choisissez une option et identifiez-vous</Text>

//                 <TouchableOpacity
//                     className="bg-gray-800 rounded-lg p-4 mb-4"
//                     onPress={() => setShowIdOptions(!showIdOptions)}
//                 >
//                     <Text className={editProfile ? "text-white text-[12px] text-center w-full" : "text-white text-lg"}>Pièce Nationale D'identité</Text>
//                     {showIdOptions && (
//                         <View className="mt-4">
//                             <TouchableOpacity
//                                 className="bg-gray-700 p-3 rounded-lg mb-2"
//                                 onPress={() => pickImage('idFront')}
//                             >
//                                 <Text className="text-white">Recto de la carte</Text>
//                                 {renderFilePreview(files.idFront)}
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 className="bg-gray-700 p-3 rounded-lg"
//                                 onPress={() => pickImage('idBack')}
//                             >
//                                 <Text className="text-white">Verso de la carte</Text>
//                                 {renderFilePreview(files.idBack)}
//                             </TouchableOpacity>
//                         </View>
//                     )}
//                 </TouchableOpacity>

//                 {!showIdOptions && <TouchableOpacity
//                     className={`bg-gray-800 rounded-lg p-4 mb-6 ${editProfile ? "p-2 flex justify-center items-center text-[12px]" : ""}`}
//                     onPress={() => pickImage('passport')}
//                 >
//                     <Text className={editProfile ? "text-white text-sm w-full" : "text-white text-lg"}>Passeport</Text>
//                     {renderFilePreview(files.passport)}
//                 </TouchableOpacity>}


//                 {(files.passport || (files.idFront && files.idBack)) && (
//                     <TouchableOpacity
//                         className="bg-blue-500 rounded-lg p-4"
//                         onPress={handleSubmit}
//                     >
//                         {isUploading && <ActivityIndicator size="small" color="white" />}  <Text className="text-white text-lg text-center">&nbsp;Soumettre</Text>
//                     </TouchableOpacity>
//                 )}
//             </ScrollView>
//         </SafeAreaView>
//     );
// };

// export default AccountIdentificationScreen;

import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
    ActivityIndicator,
    StyleSheet,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getFileUrlFromProvider, patchResource } from '@/lib/api';
import useUserGlobal from '@/hooks/use-user-hook';

interface UploadedFile {
    uri?: string;
    //   type: string;
    //   name: string;
    editProfile?: boolean;
    classname?: string;
    getIdData: (data: any, fileType: "idFront" | "idBack" | "passport") => void
}

const AccountIdentificationScreen: React.FC<UploadedFile> = ({ editProfile,
    getIdData
}) => {
    const router = useRouter();
    const [showIdOptions, setShowIdOptions] = useState(false);
    const [files, setFiles] = useState<{
        idFront?: any;
        idBack?: any;
        passport?: any;
    }>({});

    const [isUploading, setUploading] = useState(false);
    const [idF, setIdf] = useState("");
    const [idB, setIdB] = useState("");

    const { currentUser } = useUserGlobal();

    const pickImage = async (fileType: 'idFront' | 'idBack' | 'passport') => {
        // Request permissions
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission requise', 'Vous devez allouer des droits d\'access a votre camera.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setFiles(prev => ({
                ...prev,
                [fileType]: result.assets[0],
            }));

        }
    };

    const handleSubmit = async () => {
        setUploading(true)
        try {
            // Create FormData instance
            const formData = new FormData();
            let userData: any = {};
            let idFrontUrl, idBackUrl, passportUrl;
            if (files.idFront && files.idBack) {
                // get the url link from appWrite
                [idFrontUrl, idBackUrl] = await Promise.all([
                    getFileUrlFromProvider(files.idFront),
                    getFileUrlFromProvider(files.idBack),
                ]);
            }

            if (files?.passport)
                passportUrl = await getFileUrlFromProvider(files.passport)

            if (files.idFront && files.idBack)
                userData = {
                    idUser: currentUser?.userId,
                    idFront: idFrontUrl,
                    idBack: idBackUrl,
                }
            else if (files.passport)
                userData = {
                    idUser: currentUser?.userId,
                    passport: passportUrl,
                    idBack: null
                }
            else return;

            // only consider the back face od if if it's Id that is chosen. in other case only passport is sent as Identification element.
            const dataObj = {
                pieceIdf: !(files.idFront && files.idBack) ? passportUrl : idFrontUrl || idF,
                pieceIdb: files.idBack ? idBackUrl : idB,
            };

            console.log("\n\n object to load: ", dataObj);

            if ((!dataObj.pieceIdb && !dataObj.pieceIdf) || currentUser?.userId)
                return console.error(`no identification piece added or no current user id ${currentUser?.userId} found`);


            const result = await patchResource(
                'users',
                currentUser?.IdUser,
                dataObj,
            );
            Alert.alert('Success', 'Profile mis a jour avec succes!');
            router.push('/(tabulate)/profile');
        } catch (err) {
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setUploading(false);
        }
    };

    const renderFilePreview = (file?: any) => {
        if (!file?.uri) return null;
        return (
            <View style={styles.previewContainer}>
                <Image
                    source={{ uri: file.uri }}
                    style={styles.previewImage}
                    resizeMode="cover"
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {!editProfile && (
                        <View style={styles.header}>
                            <TouchableOpacity
                                onPress={() => router.replace('/(settings)/parameters')}
                                style={styles.backButton}
                            >
                                <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>
                                Identification de compte
                            </Text>
                        </View>
                    )}

                    <Text style={[styles.subtitle, editProfile && styles.smallText]}>
                        Choisissez une option et identifiez-vous
                    </Text>

                    <TouchableOpacity
                        style={styles.optionButton}
                        onPress={() => setShowIdOptions(!showIdOptions)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.optionText, editProfile && styles.smallText]}>
                            Pièce Nationale D'identité
                        </Text>

                        {showIdOptions && (
                            <View style={styles.subOptionsContainer}>
                                <TouchableOpacity
                                    style={styles.subOption}
                                    onPress={() => pickImage('idFront')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.subOptionText}>
                                        Recto de la carte
                                    </Text>
                                    {renderFilePreview(files.idFront)}
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.subOption}
                                    onPress={() => pickImage('idBack')}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.subOptionText}>
                                        Verso de la carte
                                    </Text>
                                    {renderFilePreview(files.idBack)}
                                </TouchableOpacity>
                            </View>
                        )}
                    </TouchableOpacity>

                    {!showIdOptions && (
                        <TouchableOpacity
                            style={[styles.optionButton, editProfile && styles.editProfileOption]}
                            onPress={() => pickImage('passport')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.optionText, editProfile && styles.smallText]}>
                                Passeport
                            </Text>
                            {renderFilePreview(files.passport)}
                        </TouchableOpacity>
                    )}

                    {(files.passport || (files.idFront && files.idBack)) && (
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                            activeOpacity={0.7}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.submitButtonText}>
                                    Soumettre
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'sans-serif-medium',
            },
        }),
    },
    subtitle: {
        color: 'white',
        fontSize: 16,
        marginBottom: 24,
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'sans-serif',
            },
        }),
    },
    smallText: {
        fontSize: 12,
        marginBottom: 16,
    },
    optionButton: {
        backgroundColor: '#1F2937',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                fontFamily: 'System',
            },
            android: {
                fontFamily: 'sans-serif-medium',
            },
        }),
    },
    subOptionsContainer: {
        marginTop: 16,
        gap: 12,
    },
    subOption: {
        backgroundColor: '#374151',
        padding: 12,
        borderRadius: 8,
    },
    subOptionText: {
        color: 'white',
        marginBottom: 8,
    },
    editProfileOption: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        marginTop: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    submitButton: {
        backgroundColor: '#3B82F6',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default AccountIdentificationScreen;