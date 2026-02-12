import React, { useCallback, useEffect, useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { Colors } from '@/constants';
import useUserGlobal from '@/hooks/use-user-hook';
import { Alert } from 'react-native';
import { patchResource } from '@/lib/api';
import FormField from '@/components/form-field';
import { MESSAGES } from '@/constants/constants';
import CustomToast from '@/components/custom-toast';


// Profile Edit Screen
const ProfileAdressEditScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [currentPasword, setCurrentPasword] = useState('');

  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "error",
  });
  const { currentUser } = useUserGlobal();

  const router = useRouter();


  console.log("credentials: ", {
    password, confirmPwd
  });

  const showToast = (messageKey: "Mauvais_mot_de_passe"
    | "success_de_modification_de_mot_de_passe"
    | "Non_Correspondance_de_mots_de_passes"
    | "error_de_modification_de_mot_de_passe"
    | 'No_Current_user_ID',
    type = "error"
  ) => {
    // You can determine the language based on your app's language settings
    const language = "fr"; // or "en" based on your app's language setting
    setToast({
      visible: true,
      message: MESSAGES[messageKey][language],
      type,
    });

    // Hide toast after 3.5 seconds
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };


  const onSignInPress = React.useCallback(async () => {
    if (!password.trim() || !confirmPwd.trim() || !currentPasword.trim()) {
      showToast("Mauvais_mot_de_passe");
      return;
    }
    console.log("password correspondance:", password.includes(confirmPwd))

    // Check if passwords match
    if (!password.includes(confirmPwd)) {
      return showToast("Non_Correspondance_de_mots_de_passes");
    }

    setIsSubmitting(true);
    try {
      const dataObj = {
        currentPasword,
        mdpUser: password,
      };

      console.log("\n\n object to upload: ", dataObj);

      if (!currentUser?.userId)
        return showToast("No_Current_user_ID");

      const data = await patchResource(
        'users',
        currentUser?.userId,
        dataObj,
      );

      console.log("\n\n from api file connect fct", data);
      // Alert.alert('Reussi', 'Mot de pass mis a jour avec success!');
      showToast("success_de_modification_de_mot_de_passe");
      router.push('/(tabulate)/profile');
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      showToast("error_de_modification_de_mot_de_passe");
    } finally {
      setIsSubmitting(false);
    }
  }, [password]);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 bg-gray-900 p-4 pt-5">

        <View className="flex-row items-center mb-6 gap-4">
          <TouchableOpacity onPress={() => router.push("/parameters")}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View className=' flex justify-center items-center gap-2 mb-2'>
            <Text className="text-white text-xl font-bold ml-4">Modification Mot de passe</Text>
            {/* <Text className="text-gray-400 text-[14px] font-bold ml-4">saisir votre nouveau mot de pass et confirmer</Text> */}
          </View>
        </View>
        <ScrollView><View className="mb-4">
          <Text className="mb-2 text-gray-300">Entrer le mot de passe actuel</Text>
          <FormField
            title={"Mot de passe actuel"}
            value={currentPasword}
            placeholder="Entrer votre mot de pass actuel..."
            handleChangeText={(text) => setCurrentPasword(text)}
            inputStyle="text-white"
            placeholderTextColor="#404757"
          />
        </View>

          <View className="mb-4">
            <Text className="mb-2 text-gray-300">Mot de passe</Text>
            <FormField
              title={"Mot de passe"}
              value={password}
              placeholder="Entrer votre mot de pass..."
              handleChangeText={(text) => setPassword(text)}
              inputStyle="text-white"
              placeholderTextColor="#404757"
            />
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-gray-300">Confirmer le mot de passe</Text>
            <FormField
              title={"Confirmer Mot de passe"}
              value={confirmPwd}
              placeholder="Entrer votre mot de pass..."
              handleChangeText={(text) => setConfirmPwd(text)}
              inputStyle=" text-white"
              placeholderTextColor="#404757"
            />
          </View>
        </ScrollView>

        <CustomToast
          message={toast.message}
          isVisible={toast.visible}
          type={toast.type}
        />

        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-blue-600 rounded-lg p-3 mt-4 justify-center items-center"
        >

          <Text>
            {isSubmitting &&
              <ActivityIndicator size="large" color={Colors.primary} />
            }<Text className="text-white text-center font-bold text-[16px]">&nbsp;Modifier</Text>
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </KeyboardAvoidingView>

  );
};

export default ProfileAdressEditScreen;
