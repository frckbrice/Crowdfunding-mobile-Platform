import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Alert, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';
import { icons } from '@/constants';
import { getFileUrlFromProvider, getSingleResource, updateResource } from '@/lib/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import AddIdAccount from '../../components/profile/components/identification';

// Define User interface to match the backend model
// Profile Edit Screen
const ProfileEditScreen: React.FC = () => {
    const [imagePub, setImagePub] = useState<any>();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [city, setCity] = useState('Paris');
    const [ville, setVille] = useState('');

    // State for date picker
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [birthDate, setBirthDate] = useState('');
    const [mdpUser, setMdpUser] = useState();
    const [userImg, setUserImg] = useState("");
    const [motPwd, setMotPwd] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [etatuser, setEtatuser] = useState(false);
    const [pseudo, setPseudo] = useState('');

    const [registering, setRegistering] = useState(false);
    const router = useRouter();
    const [idF, setIdf] = useState("");
    const [idB, setIdB] = useState("");

    // state of the id card
    const [pieceIdf, setPieceIdf] = useState<any>();
    const [pieceIdb, setPieceIdb] = useState<any>();
    const [passport, setPassport] = useState<any>();
    const [phone, setPhone] = useState('');

    const [isIdentificationComplete, setIsIdentificationComplete] = useState(false);


    const { currentUser, currentUserObj } = useUserGlobal();

    const getTheCurrentUserData = useCallback(async (user_id: string) => {

        try {// api call
            const userData = await getSingleResource("users", user_id);

            console.log("\n\n curent user data: ", userData);
            setName(userData?.data.nomUser);
            setUsername(userData?.data.username);
            setCity(userData?.data.localisation);
            setMdpUser(userData?.data.mdpUser);
            setUserImg(userData?.data.photoUser);
            setMotPwd(userData?.data.mdpUser);
            setDateNaiss(userData?.data.dateNaiss);
            setEtatuser(userData?.data.etatUser);
            setIdf(userData?.data.pieceIdf);
            setIdB(userData?.data.pieceIdb);
            setPseudo(userData?.data.pseudo);
            setPhone(userData?.data.phone);

            // Parse and set birth date if exists
            if (userData?.data.dateNaiss) {
                const parsedDate = new Date(userData?.data.dateNaiss);
                setDate(parsedDate);
                setBirthDate(formatDate(parsedDate));
            }

            // Check if identification is complete
            const hasIdOrPassport = userData?.data.pieceIdf || userData?.data.pieceIdb;
            setIsIdentificationComplete(!!hasIdOrPassport);


        } catch (error) {
            console.error(error);
        }
    }, [setImagePub, setBirthDate, setCity, setUsername, setName]);

    // call the support.
    const showSupportContactAlert = (field: string) => {

        Alert.alert(
            'Modification Non Autorisée',
            `Votre ${field} est sécurisé et ne peut être modifié sans validation. Cette restriction protège votre identité et vos informations personnelles.`,
            [
                {
                    text: 'Contacter Support',
                    style: 'default',
                    onPress: () => Linking.openURL(`mailto:Unricheunpauvre@gmail.com?subject=Demande de modification de/du ${field}`)
                },
                {
                    text: 'Plus d\'Informations',
                    style: 'default',
                    onPress: () => Alert.alert(
                        'Pourquoi Cette Restriction?',
                        'Nos protocoles de sécurité exigent une vérification manuelle pour toute modification de données personnelles sensibles afin de prévenir toute usurpation d\'identité.'
                    )
                },
                {
                    text: 'Annuler',
                    style: 'cancel'
                }
            ],
            {
                cancelable: true,
                userInterfaceStyle: 'dark'
            }
        );
    };



    // get data from child component.
    const getIdData = (data: any, fileType: 'idFront' | 'idBack' | 'passport') => {

        console.log("\n\n getIdData fct: ", data, fileType)
        if (fileType === "idFront")
            setPieceIdf(data);
        else if (fileType === "idBack")
            setPieceIdb(data);
        else setPassport(data);
    }

    useEffect(() => {
        if (currentUser?.userId) {
            getTheCurrentUserData(currentUser?.userId)
        }
    }, [currentUser]);

    // Utility function to format date
    const formatDate = (date: Date): string => {

        return date.toISOString();
    };

    // Handle date change
    const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || date;

        // Hide picker on both platforms
        setShowDatePicker(Platform.OS === 'ios');

        // Update date state
        setDate(currentDate);

        // Format and set birth date
        setBirthDate(formatDate(currentDate));
    };

    // Open date picker
    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    // save user
    const onSaveUser = async () => {
        setRegistering(true);
        console.log("\n\n imagePub : ", imagePub);
        let pieceIdfUrl, pieceIdbUrl, passportUrl;

        // Check if user is attempting to modify restricted fields
        if (isIdentificationComplete) {
            const hasChangedRestrictedFields =
                (currentUserObj?.username !== username) ||
                (currentUserObj?.dateNaiss !== birthDate);

            if (hasChangedRestrictedFields) {
                setRegistering(false);
                if (currentUserObj?.username !== username) {
                    showSupportContactAlert('nom d\'utilisateur');
                    return;
                }

                if (currentUserObj?.dateNaiss !== birthDate) {
                    showSupportContactAlert('date de naissance');
                    return;
                }
            }
        }


        try {
            const imgUrl = imagePub ? await getFileUrlFromProvider(imagePub) : userImg;;
            if (pieceIdf?.uri)
                pieceIdfUrl = await getFileUrlFromProvider(pieceIdf) as URL;
            if (pieceIdb?.uri)
                pieceIdbUrl = await getFileUrlFromProvider(pieceIdf) as URL;
            if (passport && !(pieceIdf?.uri && pieceIdb?.uri))
                passportUrl = await getFileUrlFromProvider(passport) as URL;


            const dataObj = {
                nomUser: name ?? currentUser?.nomUser,
                username: username,
                localisation: city ?? ville,
                pieceIdf: !(pieceIdf?.uri && pieceIdb?.uri) ? passportUrl : pieceIdf?.uri ? pieceIdfUrl : idF,
                pieceIdb: pieceIdb?.uri ? pieceIdbUrl : idB,
                etatUser: etatuser || false,
                dateNaiss: birthDate ?? dateNaiss,
                photoUser: imgUrl ?? userImg,
                mdpUser: mdpUser ?? motPwd,
                dateCrea: new Date(Date.now()).toISOString(),
                pseudo: pseudo ?? currentUser?.pseudo
            };

            console.log("\n\n object to upload: ", dataObj);

            const result = await updateResource(
                'users',
                currentUser?.userId,
                dataObj,
            );
            Alert.alert('Reussi', 'Profil mis à jour avec succès');
            router.push('/(tabulate)/profile');

        } catch (error) {
            console.error(error);
        } finally {
            setRegistering(false);
        }
    };

    // Handle Image Picker Permissions
    const checkImagePickerPermissions = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Permission refusée", "Vous devez autoriser l'accès aux images.");
            return false;
        }
        return true;
    };

    const onCaptureImage = async () => {

        const hasPermission = await checkImagePickerPermissions();
        if (!hasPermission) return;


        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.75,
            base64: true, //<--- important
        });


        if (!result.canceled) {
            // const base64 = `data:image/png;base64,${result.assets[0].base64}`;
            setImagePub(result.assets[0]);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900 p-4">
            <View className="flex-row items-center mb-6">
                <TouchableOpacity onPress={() => router.push('/profile')}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-bold ml-4">Modifier votre profil</Text>
            </View>
            <ScrollView>
                <View className="mb-4">
                    <Text className="text-white mb-2">Nom d'utilisateur</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={name as string}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Pseudo</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={name as string}
                            onChangeText={(text) => setPseudo(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Telephone</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={phone as string}
                            onChangeText={(text) => setPhone(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Username ou email</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="person-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={username as string}
                            onChangeText={(text) => setUsername(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Ville, pays &nbsp;&nbsp;&nbsp; (ex. Paris, France)</Text>
                    <View className="bg-gray-800 rounded-lg p-3 flex-row items-center">
                        <Ionicons name="location-outline" size={24} color="gray" />
                        <TextInput
                            className="flex-1 ml-2 text-white"
                            value={city}
                            onChangeText={(text) => setCity(text)}
                        />
                    </View>
                </View>
                <View className="mb-4">
                    <Text className="text-white mb-2">Date de naissance</Text>
                    <TouchableOpacity
                        onPress={showDatepicker}
                        className="bg-gray-800 rounded-lg p-3 flex-row items-center"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="calendar-outline" size={24} color="gray" />
                        <Text className="flex-1 ml-2 text-white">
                            {birthDate ? new Date(birthDate).toLocaleString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }) : 'Sélectionner une date'}
                        </Text>
                    </TouchableOpacity>

                    {/* Date Picker */}
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            mode="date"
                            is24Hour={true}
                            onChange={onDateChange}
                            maximumDate={new Date()} // prevent future date.
                            textColor="black" // Force light mode on iOS
                        />

                    )}
                </View>

                <View className="flex mb-2 gap-3">

                    <TouchableOpacity
                        onPress={() => onCaptureImage()}
                        className="bg-gray-900 p-4 
                        rounded-xl border-blue-400 border-0.5"
                        activeOpacity={0.8}
                    >
                        {(imagePub || userImg) ? (
                            <Image
                                source={{ uri: imagePub?.uri || userImg }}// uri is used for non local images.
                                className="w-full h-36 rounded-xl mt-3"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="w-full h-16 p-4 bg-black-100/60 
                            rounded-lg justify-center items-center
                             border-2 border-black-200 flex-row space-x-2"
                            >
                                <Image
                                    source={icons.upload}
                                    resizeMode="contain"
                                    className="w-5 h-5"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                        <Text className="text-white">Photo de profile</Text>
                    </TouchableOpacity>
                </View>

                {/* account identification component */}
                <AddIdAccount
                    getIdData={getIdData}
                    restrictModification={isIdentificationComplete}
                    onRestrictedAttempt={() => showSupportContactAlert('pièce d\'identité')}
                />

                <TouchableOpacity
                    className="bg-blue-500 rounded-lg p-3 my-3 justify-center items-center"
                    onPress={onSaveUser}
                >
                    <Text>
                        {registering &&
                            <Text className='mx-2'>
                                <ActivityIndicator size="small" color="white" />
                            </Text>
                        } <Text className="text-white text-[16px] text-center font-bold">
                            Enregister
                        </Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
};

export default ProfileEditScreen;