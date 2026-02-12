

// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Image, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
// import { AntDesign, Ionicons } from '@expo/vector-icons';
// import useApiOps from '@/hooks/use-api';
// import { Category, Publication } from '@/lib/types';
// import { getAllCategories, getCurrentUser, getFileUrlFromProvider, uploadResourceData } from '@/lib/api';
// import { SelectItem } from '@/components/picker';
// import * as ImagePicker from "expo-image-picker";
// import { useForm, Controller } from 'react-hook-form';
// import { icons } from '@/constants';
// import * as DocumentPicker from 'expo-document-picker';
// import useUserGlobal from '@/hooks/use-user-hook';
// import Constants from "expo-constants";
// import * as FileSystem from 'expo-file-system';

// const initialFormState: Publication = {
//     datePub: new Date().toISOString(),
//     etat: false,
//     favories: false,
//     idCat: undefined,
//     idUser: undefined,
//     imagePub: '',
//     libelePub: '',
//     montantEstime: 0,
//     documentUrl: '',
// };

// type DocumentFile = {
//     name: string;
//     type: string;
//     size: number;
//     uri: string;
// }

// type Publicationtype = {
//     libelePub: string;
//     montantEstime: number;
//     imagePub: ImagePicker.ImagePickerAsset;
//     documentUrl: DocumentFile;
//     idCat: Category['id'];
// }

// // Updated types to match the form data structure
// interface FormInputs {
//     libelePub: string;
//     montantEstime: number;
//     imagePub: ImagePicker.ImagePickerAsset | null;
//     documentUrl: {
//         name: string;
//         type: string;
//         size: number;
//         uri: string;
//     } | null;
//     idCat: string | undefined;
// }

// // Type for the final publication data to be uploaded
// interface PublicationUpload {
//     idUser: string | undefined;
//     idCat: string | undefined;
//     imagePub: string | null;
//     documentUrl: string | null;
//     datePub: string;
//     libelePub: string;
//     etat: boolean;
//     montantEstime: number;
// }


// const CreatePostScreen: React.FC = () => {
//     const [form, setForm] = useState(initialFormState);
//     const [currentCat, setCurrentCat] = useState<Category>();
//     const { currentUser, currentUserObj } = useUserGlobal();
//     const [uploading, setUploading] = useState(false);
//     const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

//     const [documentFile, setDocumentFile] = useState<{
//         name: string, type: string, size: number, uri: string
//     } | null>(null);
//     const [globalError, setGlobalError] = useState<string | null>(null);

//     const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormInputs>({
//         defaultValues: {
//             libelePub: '',
//             montantEstime: 0,
//             imagePub: null,
//             documentUrl: null,
//             idCat: undefined
//         },
//         mode: 'onChange'
//     });


//     // Rest of your existing useEffect and API hooks...

//     const {
//         data: categories,
//         refetch: refetchCategories,
//         isLoading
//     } = useApiOps<Category[]>(() => {
//         return getAllCategories()
//     });

//     useEffect(() => {
//         if (!categories?.length)
//             refetchCategories();

//         (async () => {
//             if (Constants.platform && Constants.platform.ios) {
//                 const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
//                 const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
//                 if (
//                     cameraRollStatus.status !== "granted" ||
//                     cameraStatus.status !== "granted"
//                 ) {
//                     alert("Sorry, we need these permissions to make this work!");
//                 }
//             }
//             await getCurrentUser()
//         })();

//     }, []);


//     const onDocumentPicker = async (onChange: (value: FormInputs['documentUrl']) => void) => {
//         try {
//             const result = await DocumentPicker.getDocumentAsync({
//                 type: [
//                     'text/plain',
//                     'application/pdf',
//                     'application/msword',
//                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
//                 ],
//                 copyToCacheDirectory: true // this usefull when you use the data right after capturing them.
//             });

//             if (!result.canceled && result.assets[0]) {
//                 const file = result.assets[0];
//                 const documentData = {
//                     name: file.name,
//                     type: file.mimeType as string,
//                     size: file.size as number,
//                     uri: file.uri
//                 };
//                 onChange(documentData);
//                 setDocumentFile(documentData);
//             }
//         } catch (error) {
//             console.error('Document picking error:', error);
//             setGlobalError("Erreur lors de la sélection du document");
//         }
//     };



//     const onPicker = async (onChange: (value: FormInputs['imagePub']) => void) => {
//         try {
//             const result = await ImagePicker.launchImageLibraryAsync({
//                 mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                 allowsEditing: false,
//                 aspect: [4, 3],
//                 quality: 1,
//                 base64: true,
//             });

//             if (!result.canceled) {
//                 setForm({ ...form, imagePub: result.assets[0] });
//                 onChange(result.assets[0]);
//             }
//         } catch (error) {
//             console.error('Image picking error:', error);
//             setGlobalError("Erreur lors de la sélection de l'image");
//         }
//     };


//     const renderSubmitButton = () => {
//         switch (submitStatus) {
//             case 'loading':
//                 return <ActivityIndicator size="small" color="white" />;
//             case 'success':
//                 return (
//                     <View className="flex-row items-center justify-center space-x-2">
//                         <Text className="text-white text-center font-bold">PUBLIÉ</Text>
//                         <Ionicons name="checkmark-circle" size={20} color="white" />
//                     </View>
//                 );
//             case 'error':
//                 return (
//                     <View className="flex-row items-center justify-center space-x-2">
//                         <Text className="text-white text-center font-bold">RÉESSAYER</Text>
//                         <Ionicons name="alert-circle" size={20} color="white" />
//                     </View>
//                 );
//             default:
//                 return <Text className="text-white text-center font-bold">PUBLIER</Text>;
//         }
//     };

//     const getSubmitButtonStyle = () => {
//         switch (submitStatus) {
//             case 'success':
//                 return 'bg-green-500';
//             case 'error':
//                 return 'bg-red-500';
//             default:
//                 return uploading ? 'bg-blue-400' : 'bg-blue-500';
//         }
//     };

//     const validateForm = (data: FormInputs): boolean => {
//         let errorMessage = '';

//         if (!form?.idCat) {
//             errorMessage += '- Veuillez sélectionner une catégorie\n';
//         }
//         if (!data.imagePub) {
//             errorMessage += '- Veuillez ajouter une image\n';
//         }
//         if (!data.documentUrl) {
//             errorMessage += '- Veuillez télécharger un document\n';
//         }

//         if (errorMessage) {
//             setGlobalError(errorMessage.trim());
//             return false;
//         }

//         setGlobalError(null);
//         return true;
//     };

//     const onSubmit = async (data: FormInputs) => {
//         if (!validateForm(data)) {
//             setSubmitStatus('error');
//             return;
//         }

//         setUploading(true);
//         setSubmitStatus('loading');

//         try {
//             // Upload image and get URL
//             const imgUrl = data.imagePub
//                 ? await getFileUrlFromProvider(form.imagePub)
//                 : null;

//             // Upload document and get URL
//             const docUrl = data.documentUrl
//                 ? await getFileUrlFromProvider(documentFile as DocumentFile)
//                 : null;

//             const publicationData: PublicationUpload = {
//                 idUser: currentUser?.userId,
//                 idCat: form?.idCat,
//                 // imagePub: imgUrl as unknown as string,
//                 // documentUrl: docUrl as unknown as string,
//                 imagePub: form.imagePub?.uri as unknown as string,
//                 documentUrl: documentFile?.uri as unknown as string,
//                 datePub: new Date().toISOString(),
//                 libelePub: form?.libelePub,
//                 etat: false,
//                 montantEstime: Number(form?.montantEstime)
//             };

//             const newPub = await uploadResourceData(publicationData, "publications");

//             if (newPub) {
//                 setSubmitStatus('success');
//                 setGlobalError(null);

//                 // Reset form after successful submission
//                 setTimeout(() => {
//                     reset();
//                     setCurrentCat(undefined);
//                     setSubmitStatus('idle');
//                     setGlobalError(null);
//                 }, 2000);
//             }
//         } catch (error) {
//             console.error('Upload error:', error);
//             setSubmitStatus('error');
//             setGlobalError("Une erreur s'est produite lors de la publication. Veuillez réessayer.");
//         } finally {
//             setUploading(false);
//         }
//     };

//     return (
//         <ScrollView className="flex-1 bg-gray-900 px-4 py-2">
//             <Text className="text-white text-xl font-bold mb-4 left-2">Poster un rêve</Text>

//             <View className='mb-20'>
//                 {/* User Info Section */}
//                 <View className="flex-row items-center mb-4">
//                     <Image
//                         source={currentUserObj?.photoUser ? { uri: currentUserObj?.photoUser } : require("@/assets/images/1riche1povreAvatar.png")}
//                         className="w-10 h-10 rounded-full mr-2"
//                     />
//                     <View className='gap-[0.3px]'>
//                         <Text className="text-white">{currentUser?.nomUser}</Text>
//                         <Text className="text-white">de {currentUserObj?.localisation}</Text>
//                     </View>
//                 </View>

//                 {/* Category Selection */}
//                 <View className='my-4'>
//                     <Controller
//                         control={control}
//                         name="idCat"
//                         rules={{
//                             required: 'La catégorie est requise'
//                         }}
//                         render={({ field: { onChange, value } }) => (
//                             <View>

//                                 <SelectItem options={categories} getCurrentCat={(catId) => {
//                                     onChange(catId); // not yet
//                                     // setCurrentCat(cat);
//                                     setForm({ ...form, idCat: catId });
//                                 }} important={true} />
//                                 {errors?.idCat && !form?.idCat && (
//                                     <Text className="text-red-500 text-sm mt-1">
//                                         {errors.idCat?.message}
//                                     </Text>
//                                 )}
//                             </View>
//                         )}
//                     />
//                 </View>

//                 {/* Description Input */}
//                 <Controller
//                     control={control}
//                     name="libelePub"
//                     rules={{
//                         required: 'La description est requise',
//                         minLength: {
//                             value: 10,
//                             message: 'La description doit contenir au moins 10 caractères'
//                         }
//                     }}
//                     render={({ field: { onChange, value } }) => (
//                         <View className="mb-4">
//                             <TextInput
//                                 placeholder="Donnez un résumé de votre rêve..."
//                                 placeholderTextColor="gray"
//                                 className={`bg-gray-800 p-2 rounded text-white mb-1 min-h-[100px] ${errors.libelePub ? 'border border-red-500' : ''}`}
//                                 multiline
//                                 textAlignVertical="top"
//                                 numberOfLines={5}
//                                 value={value}
//                                 onChangeText={(text) => {
//                                     onChange(text);
//                                     setForm({ ...form, libelePub: text });
//                                 }}
//                             />
//                             {errors.libelePub && (
//                                 <Text className="text-red-500 text-sm mt-1">
//                                     {errors.libelePub.message}
//                                 </Text>
//                             )}
//                         </View>
//                     )}
//                 />




//                 {/* Cost Estimation */}
//                 <View className='mb-4'>
//                     <Controller
//                         control={control}
//                         name="montantEstime"
//                         rules={{
//                             required: 'Le montant est requis',
//                             min: {
//                                 value: 1,
//                                 message: 'Le montant doit être supérieur à 0'
//                             },
//                             validate: {
//                                 isNumber: value => !isNaN(Number(value)) || 'Le montant doit être un nombre'
//                             }
//                         }}
//                         render={({ field: { onChange, value } }) => (
//                             <View>
//                                 <Text className="text-white mb-2">
//                                     Estimation du coût <Text className="text-red-500">*</Text>
//                                 </Text>
//                                 <View className='flex-row w-full rounded justify-between items-center bg-gray-800 pr-2'>
//                                     <TextInput
//                                         placeholder="Estimation..."
//                                         placeholderTextColor="gray"
//                                         className={`bg-transparent p-2 rounded w-[80%] text-white ${errors.montantEstime ? 'border border-red-500' : ''}`}
//                                         keyboardType="numeric"
//                                         value={value?.toString()}
//                                         onChangeText={(text) => {
//                                             onChange(text ? parseInt(text) : '');
//                                             setForm(value => ({ ...value, montantEstime: text ? parseInt(text) : 0 }));
//                                         }}
//                                     />
//                                     <Text className="text-white ml-2">€</Text>
//                                 </View>
//                                 {errors.montantEstime && (
//                                     <Text className="text-red-500 text-sm mt-1">
//                                         {errors.montantEstime.message}
//                                     </Text>
//                                 )}
//                             </View>
//                         )}
//                     />
//                 </View>


//                 <View className="flex mb-4">
//                     <Controller
//                         control={control}
//                         name="imagePub"
//                         rules={{
//                             required: "L'image est requise"
//                         }}
//                         render={({ field: { onChange, value } }) => (
//                             <View className=''>
//                                 <Text className="text-white mt-2">
//                                     Image de la publication <Text className="text-red-500">*</Text>
//                                 </Text>
//                                 <TouchableOpacity
//                                     onPress={() => onPicker(onChange)}
//                                     className={`bg-gray-900 p-4 rounded-xl border-blue-400 border-0.5 ${!form.imagePub ? 'border-red-500' : ''}`}
//                                 >
//                                     {form.imagePub ? (
//                                         <Image
//                                             source={{ uri: form.imagePub.uri }}
//                                             className="w-full h-36 rounded-xl mt-3"
//                                             resizeMode="cover"
//                                         />
//                                     ) : (
//                                         <View className="w-full h-16 p-4 bg-black-100/60 rounded-lg justify-center items-center border-2 border-black-200 flex-row space-x-2">
//                                             <Image
//                                                 source={icons.upload}
//                                                 resizeMode="contain"
//                                                 className="w-5 h-5"
//                                             />
//                                             <Text className="text-sm text-gray-100 font-pmedium">
//                                                 Choisir un fichier
//                                             </Text>
//                                         </View>
//                                     )}
//                                 </TouchableOpacity>
//                             </View>
//                         )}
//                     />
//                     {errors.imagePub && (
//                         <Text className="text-red-500 text-sm mt-1">{errors.imagePub.message}</Text>
//                     )}
//                 </View>

//                 {/* Document Upload */}
//                 <View className='mb-4'>
//                     <Controller
//                         control={control}
//                         name='documentUrl'
//                         rules={{
//                             required: 'Le document est requis'
//                         }}
//                         render={({ field: { onChange } }) => (
//                             <View>
//                                 <Text className="text-white mb-2">
//                                     Document <Text className="text-red-500">*</Text>
//                                 </Text>
//                                 <TouchableOpacity
//                                     onPress={() => onDocumentPicker(onChange)}
//                                     className={`bg-gray-700 p-2 rounded flex-row items-center justify-center ${errors.documentUrl ? 'border border-red-500' : ''}`}
//                                 >
//                                     <Ionicons name="document-outline" size={20} color="gray" />
//                                     <Text className="text-gray-400 mx-2">
//                                         Importer un document
//                                     </Text>
//                                 </TouchableOpacity>
//                                 {documentFile && (
//                                     <View className="flex-row items-center mt-2">
//                                         <Ionicons name="document" size={20} color="green" />
//                                         <Text className="text-white ml-2">{documentFile.name}</Text>
//                                     </View>
//                                 )}
//                                 {errors?.documentUrl && (
//                                     <Text className="text-red-500 text-sm mt-1">
//                                         {errors.documentUrl.message?.toString()}
//                                     </Text>
//                                 )}
//                             </View>
//                         )}
//                     />
//                 </View>

//                 {/* Global Error Messages */}
//                 {globalError && (
//                     <View className="my-4 p-3 bg-red-500/20 rounded">
//                         <Text className="text-red-500 font-medium">Erreurs:</Text>
//                         {globalError.split('\n').map((error, index) => (
//                             <Text key={index} className="text-red-500 mt-1">
//                                 {error}
//                             </Text>
//                         ))}
//                     </View>
//                 )}

//                 {/* Submit Button */}
//                 <TouchableOpacity
//                     className={`p-3 rounded ${getSubmitButtonStyle()} ${uploading ? 'opacity-70' : ''}`}
//                     onPress={handleSubmit(onSubmit)}
//                     disabled={uploading || submitStatus === 'success'}
//                 >
//                     {renderSubmitButton()}
//                 </TouchableOpacity>



//             </View>
//         </ScrollView>
//     );
// };

// export default CreatePostScreen;



import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, TouchableOpacity, ScrollView,
    TextInput, ActivityIndicator, Platform, KeyboardAvoidingView,
    Alert, Keyboard
} from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import useApiOps from '@/hooks/use-api';
import { Category, Publication } from '@/lib/types';
import { getAllCategories, getCurrentUser, getFileUrlFromProvider, uploadResourceData } from '@/lib/api';
import { SelectItem } from '@/components/picker';
import * as ImagePicker from "expo-image-picker";
import { useForm, Controller } from 'react-hook-form';
import { icons } from '@/constants';
import * as DocumentPicker from 'expo-document-picker';
import useUserGlobal from '@/hooks/use-user-hook';
import Constants from "expo-constants";
import * as FileSystem from 'expo-file-system';
import { router } from 'expo-router';

const initialFormState: Publication = {
    datePub: new Date().toISOString(),
    etat: false,
    favories: false,
    idCat: undefined,
    idUser: undefined,
    imagePub: '',
    libelePub: '',
    montantEstime: 0,
    documentUrl: '',
};

type DocumentFile = {
    name: string;
    type: string;
    size: number;
    uri: string;
}

type Publicationtype = {
    libelePub: string;
    montantEstime: number;
    imagePub: ImagePicker.ImagePickerAsset;
    documentUrl: DocumentFile;
    idCat: Category['id'];
}

// Updated types to match the form data structure
interface FormInputs {
    libelePub: string;
    montantEstime: number;
    imagePub: ImagePicker.ImagePickerAsset | null;
    documentUrl: {
        name: string;
        type: string;
        size: number;
        uri: string;
    } | null;
    idCat: string | undefined;
}

// Type for the final publication data to be uploaded
interface PublicationUpload {
    idUser: string | undefined;
    idCat: string | undefined;
    imagePub: string | null;
    documentUrl: string | null;
    datePub: string;
    libelePub: string;
    etat: boolean;
    montantEstime: number;
}


const CreatePostScreen: React.FC = () => {

    const [form, setForm] = useState(initialFormState);
    const [currentCat, setCurrentCat] = useState<Category>();
    const { currentUser, currentUserObj } = useUserGlobal();
    const [uploading, setUploading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const [documentFile, setDocumentFile] = useState<{
        name: string, type: string, size: number, uri: string
    } | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const { control, handleSubmit, formState: { errors }, setValue, reset } = useForm<FormInputs>({
        defaultValues: {
            libelePub: '',
            montantEstime: 0,
            imagePub: null,
            documentUrl: null,
            idCat: undefined
        },
        mode: 'onChange'
    });


    // Rest of your existing useEffect and API hooks...

    const {
        data: categories,
        refetch: refetchCategories,
        isLoading
    } = useApiOps<Category[]>(() => {
        return getAllCategories()
    });

    useEffect(() => {
        if (!categories?.length)
            refetchCategories();

        console.log("\n\n current user : ", currentUserObj);
        // check if the user has the location set, otherwise just return to /edit-profile
        if (!currentUserObj?.localisation) {
            Alert.alert(
                'Profile non mis a jour',
                'Veuillez ajouter votre localisation',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            router.push('/(settings)/edit-profile');
                        },
                    },
                ],
                { cancelable: false }
            );
        }

        (async () => {
            if (Constants.platform && Constants.platform.ios) {
                const cameraRollStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
                const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
                if (
                    cameraRollStatus.status !== "granted" ||
                    cameraStatus.status !== "granted"
                ) {
                    alert("Permission requise pour acceder a votre camera.");
                }
            }
            await getCurrentUser()
        })();

        const keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => setKeyboardVisible(true)
        );
        const keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardVisible(false)
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);


    // Platform-specific document picker
    const onDocumentPicker = async (onChange: (value: FormInputs['documentUrl']) => void) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: Platform.OS === 'ios'
                    ? ['public.text', 'com.adobe.pdf', 'com.microsoft.word.doc', 'org.openxmlformats.wordprocessingml.document']
                    : ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
                copyToCacheDirectory: true
            });

            if (!result.canceled && result.assets[0]) {
                const file = result.assets[0];
                const uri = Platform.OS === 'ios'
                    ? file.uri.replace('file://', '')
                    : file.uri;

                const documentData = {
                    name: file.name,
                    type: file.mimeType as string,
                    size: file.size as number,
                    uri
                };

                onChange(documentData);
                setDocumentFile(documentData);
            }
        } catch (error) {
            console.error('Document picking error:', error);
            Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la sélection du document",
                [{ text: "OK" }]
            );
        }
    };

    // Platform-specific styles
    const styles = {
        textInput: {
            ...Platform.select({
                ios: {
                    paddingVertical: 12,
                },
                android: {
                    paddingVertical: 8,
                }
            })
        },
        touchableOpacity: {
            opacity: Platform.OS === 'ios' ? 0.7 : 1
        }
    };

    // Platform-specific image picker
    const onPicker = async (onChange: (value: FormInputs['imagePub']) => void) => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission requise",
                    "Nous avons besoin de votre permission pour accéder à vos photos",
                    [{ text: "OK" }]
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: Platform.OS === 'ios' ? 0.8 : 0.6, // Lower quality on Android
                base64: true,
            });

            if (!result.canceled) {
                // Handle iOS vs Android URI format
                const uri = Platform.OS === 'ios'
                    ? result.assets[0].uri.replace('file://', '')
                    : result.assets[0].uri;

                const asset = {
                    ...result.assets[0],
                    uri
                };

                setForm({ ...form, imagePub: asset });
                onChange(asset);
            }
        } catch (error) {
            console.error('Image picking error:', error);
            Alert.alert(
                "Erreur",
                "Une erreur est survenue lors de la sélection de l'image",
                [{ text: "OK" }]
            );
        }
    };


    const renderSubmitButton = () => {
        switch (submitStatus) {
            case 'loading':
                return <ActivityIndicator size="small" color="white" />;
            case 'success':
                return (
                    <View className="flex-row items-center justify-center space-x-2">
                        <Text className="text-white text-center font-bold">PUBLIÉ</Text>
                        <Ionicons name="checkmark-circle" size={20} color="white" />
                    </View>
                );
            case 'error':
                return (
                    <View className="flex-row items-center justify-center space-x-2">
                        <Text className="text-white text-center font-bold">RÉESSAYER</Text>
                        <Ionicons name="alert-circle" size={20} color="white" />
                    </View>
                );
            default:
                return <Text className="text-white text-center font-bold">PUBLIER</Text>;
        }
    };

    const getSubmitButtonStyle = () => {
        switch (submitStatus) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            default:
                return uploading ? 'bg-blue-400' : 'bg-blue-500';
        }
    };

    const validateForm = (data: FormInputs): boolean => {
        let errorMessage = '';

        if (!form?.idCat) {
            errorMessage += '- Veuillez sélectionner une catégorie\n';
        }
        if (!data.imagePub) {
            errorMessage += '- Veuillez ajouter une image\n';
        }
        if (!data.documentUrl) {
            errorMessage += '- Veuillez télécharger un document\n';
        }

        if (errorMessage) {
            setGlobalError(errorMessage.trim());
            return false;
        }

        setGlobalError(null);
        return true;
    };

    const onSubmit = async (data: FormInputs) => {
        if (!validateForm(data)) {
            setSubmitStatus('error');
            return;
        }

        setUploading(true);
        setSubmitStatus('loading');

        try {
            // Upload image and get URL
            const imgUrl = data.imagePub
                ? await getFileUrlFromProvider(form.imagePub)
                : null;

            // Upload document and get URL
            const docUrl = data.documentUrl
                ? await getFileUrlFromProvider(documentFile as DocumentFile)
                : null;

            const publicationData: PublicationUpload = {
                idUser: currentUser?.userId,
                idCat: form?.idCat,
                imagePub: imgUrl as unknown as string,
                documentUrl: docUrl as unknown as string,

                datePub: new Date().toISOString(),
                libelePub: form?.libelePub,
                etat: false,
                montantEstime: Number(form?.montantEstime)
            };

            const newPub = await uploadResourceData(publicationData, "publications");

            if (newPub) {
                setSubmitStatus('success');
                setGlobalError(null);

                // Reset form after successful submission
                setTimeout(() => {
                    reset();
                    setCurrentCat(undefined);
                    setSubmitStatus('idle');
                    setGlobalError(null);
                    setDocumentFile(null);
                    setForm(prev => ({ ...prev, ...{ imagePub: null } }));
                }, 1100);
            }
        } catch (error) {
            console.error('Upload error:', error);
            setSubmitStatus('error');
            setGlobalError("Une erreur s'est produite lors de la publication. Veuillez réessayer.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <ScrollView
                className="flex-1 bg-gray-900"
                contentContainerStyle={{
                    padding: 16,
                    paddingBottom: keyboardVisible ? 120 : 20
                }}
                keyboardShouldPersistTaps="handled" //Determines when the keyboard should stay visible after a tap.
            >
                <Text className="text-white text-xl font-bold my-4 left-2">Poster un rêve</Text>

                <View className='mb-20'>
                    {/* User Info Section */}
                    <View className="flex-row items-center mb-4">
                        <Image
                            source={currentUserObj?.photoUser ? { uri: currentUserObj?.photoUser } : require("@/assets/images/1riche1povreAvatar.png")}
                            className="w-[36px] h-[36px] rounded-full mr-2"
                        />
                        <View className='gap-[0.3px]'>
                            <Text className="text-white">{currentUser?.nomUser}</Text>
                            <Text className="text-white">{currentUserObj?.localisation ?? 'Origine non definie'}</Text>
                        </View>
                    </View>

                    {/* Category Selection */}
                    <View className='my-4'>
                        <Controller
                            control={control}
                            name="idCat"
                            rules={{
                                required: 'La catégorie est requise'
                            }}
                            render={({ field: { onChange, value } }) => (
                                <View>

                                    <SelectItem
                                        options={categories} getCurrentCat={(catId) => {
                                            onChange(catId); // not yet
                                            // setCurrentCat(cat);
                                            setForm({ ...form, idCat: catId });
                                        }}
                                        important={true}
                                        isLoading={isLoading}
                                    />
                                    {errors?.idCat && !form?.idCat && (
                                        <Text className="text-red-500 text-sm mt-1">
                                            {errors.idCat?.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>

                    {/* Description Input */}
                    <Controller
                        control={control}
                        name="libelePub"
                        rules={{
                            required: 'La description est requise',
                            minLength: {
                                value: 10,
                                message: 'La description doit contenir au moins 10 caractères'
                            }
                        }}
                        render={({ field: { onChange, value } }) => (
                            <View className="mb-4">
                                <TextInput
                                    placeholder="Donnez un résumé de votre rêve..."
                                    placeholderTextColor="gray"
                                    className={`bg-gray-800 rounded text-white ${Platform.OS === 'ios' ? 'p-3' : 'p-2'
                                        } ${errors.libelePub ? 'border border-red-500' : ''}`}
                                    multiline
                                    textAlignVertical="top"
                                    numberOfLines={5}
                                    value={value}
                                    onChangeText={(text) => {
                                        onChange(text);
                                        setForm({ ...form, libelePub: text });
                                    }}
                                />
                                {errors.libelePub && (
                                    <Text className="text-red-500 text-sm mt-1">
                                        {errors.libelePub.message}
                                    </Text>
                                )}
                            </View>
                        )}
                    />




                    {/* Cost Estimation */}
                    <View className='mb-4'>
                        <Controller
                            control={control}
                            name="montantEstime"
                            rules={{
                                required: 'Le montant est requis',
                                min: {
                                    value: 1,
                                    message: 'Le montant doit être supérieur à 0'
                                },
                                validate: {
                                    isNumber: value => !isNaN(Number(value)) || 'Le montant doit être un nombre'
                                }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <View>
                                    <Text className="text-white mb-2">
                                        Estimation du coût <Text className="text-red-500">*</Text>
                                    </Text>
                                    <View className='flex-row w-full rounded justify-between items-center bg-gray-800 pr-2'>
                                        <TextInput
                                            placeholder="Estimation..."
                                            placeholderTextColor="gray"
                                            className={`bg-transparent p-2 rounded w-[80%] text-white ${errors.montantEstime ? 'border border-red-500' : ''}`}
                                            keyboardType="numeric"
                                            value={value?.toString()}
                                            onChangeText={(text) => {
                                                onChange(text ? parseInt(text) : '');
                                                setForm(value => ({ ...value, montantEstime: text ? parseInt(text) : 0 }));
                                            }}
                                        />
                                        <Text className="text-white ml-2">€</Text>
                                    </View>
                                    {errors.montantEstime && (
                                        <Text className="text-red-500 text-sm mt-1">
                                            {errors.montantEstime.message}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>


                    <View className="flex mb-4">
                        <Controller
                            control={control}
                            name="imagePub"
                            rules={{
                                required: "L'image est requise"
                            }}
                            render={({ field: { onChange, value } }) => (
                                <View className=''>
                                    <Text className="text-white mt-2">
                                        Image de la publication <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => onPicker(onChange)}
                                        className={`bg-gray-900 p-4 rounded-xl border-blue-400 border-0.5 ${!form.imagePub ? 'border-red-500' : ''}`}
                                    >
                                        {form.imagePub ? (
                                            <Image
                                                source={{ uri: form.imagePub.uri }}
                                                className="w-full h-36 rounded-xl mt-3"
                                                resizeMode="cover"
                                            />
                                        ) : (
                                            <View className="w-full h-16 p-4 bg-black-100/60 rounded-lg justify-center items-center border-2 border-black-200 flex-row space-x-2">
                                                <Image
                                                    source={icons.upload}
                                                    resizeMode="contain"
                                                    className="w-5 h-5"
                                                />
                                                <Text className="text-sm text-gray-100 font-pmedium">
                                                    Choisir un fichier
                                                </Text>
                                            </View>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                        {errors.imagePub && (
                            <Text className="text-red-500 text-sm mt-1">{errors.imagePub.message}</Text>
                        )}
                    </View>

                    {/* Document Upload */}
                    <View className='mb-4'>
                        <Controller
                            control={control}
                            name='documentUrl'
                            rules={{
                                required: 'Le document est requis'
                            }}
                            render={({ field: { onChange } }) => (
                                <View>
                                    <Text className="text-white mb-2">
                                        Document <Text className="text-red-500">*</Text>
                                    </Text>
                                    <TouchableOpacity
                                        onPress={() => onDocumentPicker(onChange)}
                                        className={`bg-gray-700 p-2 rounded flex-row items-center justify-center ${errors.documentUrl ? 'border border-red-500' : ''}`}
                                    >
                                        <Ionicons name="document-outline" size={20} color="gray" />
                                        <Text className="text-gray-400 mx-2">
                                            Importer un document <Text className="text-red-500">(pdf)</Text>
                                        </Text>
                                    </TouchableOpacity>
                                    {documentFile && (
                                        <View className="flex-row items-center mt-2">
                                            <Ionicons name="document" size={20} color="green" />
                                            <Text className="text-white ml-2">{documentFile.name}</Text>
                                        </View>
                                    )}
                                    {errors?.documentUrl && (
                                        <Text className="text-red-500 text-sm mt-1">
                                            {errors.documentUrl.message?.toString()}
                                        </Text>
                                    )}
                                </View>
                            )}
                        />
                    </View>

                    {/* Global Error Messages */}
                    {globalError && (
                        <View className="my-4 p-3 bg-red-500/20 rounded">
                            <Text className="text-red-500 font-medium">Erreurs:</Text>
                            {globalError.split('\n').map((error, index) => (
                                <Text key={index} className="text-red-500 mt-1">
                                    {error}
                                </Text>
                            ))}
                        </View>
                    )}

                    {/* Submit Button */}
                    <TouchableOpacity
                        className={`p-3 rounded ${getSubmitButtonStyle()} ${Platform.OS === 'ios' ? 'active:opacity-70' : ''
                            }`}
                        onPress={handleSubmit(onSubmit)}
                        disabled={uploading || submitStatus === 'success'}
                        style={styles.touchableOpacity}
                    >
                        {renderSubmitButton()}
                    </TouchableOpacity>



                </View>
            </ScrollView>
        </KeyboardAvoidingView>

    );
};

export default CreatePostScreen;