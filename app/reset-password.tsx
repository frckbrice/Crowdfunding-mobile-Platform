import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';
import { useForm, Controller } from 'react-hook-form';
import renderSubmitButton from '@/components/submited-button';
import { API_URL, MESSAGES } from '@/constants/constants';
import CustomToast from '@/components/custom-toast';

interface ForgotPasswordFormData {
    email: string;
    token?: string;
    newPassword: string;
    confirmPassword: string;
}

export default function ResetPassword() {
    const { token } = useLocalSearchParams(); // Get token from URL
    const router = useRouter();

    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [resetEmailStatus, setResetEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "error",
    });


    const { currentUser } = useUserGlobal();

    const { control: forgotPasswordControl, handleSubmit: handleForgotPasswordSubmit, formState: { errors: forgotPasswordErrors } } = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: '',
        },
        mode: 'onChange'
    });

    const showToast = (messageKey:
        "erreur_de_connection" | "success_de_modification_de_mot_de_passe"
        | "Non_Correspondance_de_mots_de_passes"
        | "Error_resetting_password"
        | 'mauvais_identifiants',
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

    const onForgotPasswordPress = async (data: ForgotPasswordFormData) => {
        setResetEmailStatus('loading');
        if (!token || !data.email) {
            Alert.alert("Error", "Invalid or expired token");
            return;
        }

        // Check if passwords match
        if (!data?.newPassword.includes(data?.confirmPassword)) {
            return showToast("Non_Correspondance_de_mots_de_passes");
        }


        try {
            const res = await fetch(API_URL + "/users/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    newPassword: data.newPassword,
                    email: data.email
                }),
            });

            if (!res.ok) {
                throw new Error('Password reset request failed');
            }

            setResetEmailStatus('success');
            // showToast("Error_resetting_password");
            setTimeout(() => {
                router.replace('/login');
            }, 2000);
        } catch (err) {
            console.error(err);
            setResetEmailStatus('error');
            showToast("Error_resetting_password");
        }
    };


    const getSubmitButtonStyle = () => {
        switch (submitStatus) {
            case 'success':
                return 'bg-green-600';
            case 'error':
                return 'bg-red-600';
            case 'loading':
                return 'bg-blue-400';
            default:
                return 'bg-blue-600';
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="h-full">
                <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                    <View className="px-4 justify-center flex-1 w-full">
                        {/* <View className="items-center mb-5">
              <TouchableOpacity
                onPress={() => setShowForgotPassword(false)}
                className="self-start mb-4"
              >
                <Ionicons name="arrow-back" size={24} color="#2563eb" />
              </TouchableOpacity>
              <Text className="text-2xl font-bold text-blue-600">Mot de passe oublié</Text>
            </View> */}
                        <Text className="text-center mb-8 text-gray-600 text-base leading-6">
                            Entrer votre email qui a besoin d'avoir son mot de passe reinitialisé et le nouveau mot de passe
                        </Text>

                        <View className="mb-4">
                            <Controller
                                control={forgotPasswordControl}
                                name="email"
                                rules={{
                                    required: 'L\'email est requis',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Adresse email invalide'
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <Text>email: </Text>
                                        <View className={`flex-row items-center border rounded-lg p-2 
                                    ${forgotPasswordErrors.email ? 'border-red-500' : 'border-gray-300'}`}>
                                            <Ionicons name="mail" size={24} color="#2563eb" />
                                            <TextInput
                                                className="flex-1 ml-2 text-black-200"
                                                placeholder="Entrer votre email "
                                                value={value}
                                                onChangeText={onChange}
                                                autoCapitalize="none"
                                                keyboardType="email-address"
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                            {forgotPasswordErrors.email && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {forgotPasswordErrors.email.message}
                                </Text>
                            )}
                        </View>

                        <View className="mb-4">
                            <Controller
                                control={forgotPasswordControl}
                                name="newPassword"
                                rules={{
                                    required: 'Le nouveau mot de passe est requis',
                                    // pattern: {
                                    //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    //     message: 'Adresse newPassword invalide'
                                    // }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <Text>nouveau mot de passe: </Text>
                                        <View className={`flex-row items-center border rounded-lg p-2 
                                    ${forgotPasswordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}>
                                            <Ionicons name="lock-closed" size={24} color="#2563eb" />
                                            <TextInput
                                                className="flex-1 ml-2 text-black-200"
                                                placeholder="Entrer votre nouveau mot de passe"
                                                value={value}
                                                onChangeText={onChange}
                                                autoCapitalize="none"
                                                secureTextEntry
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                            {forgotPasswordErrors.newPassword && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {forgotPasswordErrors.newPassword.message}
                                </Text>
                            )}
                        </View>

                        <View className="mb-4">
                            <Controller
                                control={forgotPasswordControl}
                                name="confirmPassword"
                                rules={{
                                    required: 'Le nouveau mot de passe de confirmation est requis',
                                    // pattern: {
                                    //     value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    //     message: 'Adresse newPassword invalide'
                                    // }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <View>
                                        <Text>confirmer le nouveau mot de passe: </Text>
                                        <View className={`flex-row items-center border rounded-lg p-2 
                                    ${forgotPasswordErrors.newPassword ? 'border-red-500' : 'border-gray-300'}`}>
                                            <Ionicons name="lock-closed" size={24} color="#2563eb" />
                                            <TextInput
                                                className="flex-1 ml-2 text-black-200"
                                                placeholder="Entrer votre mot de passe de confirmation"
                                                value={value}
                                                onChangeText={onChange}
                                                autoCapitalize="none"
                                                secureTextEntry
                                            />
                                        </View>
                                    </View>
                                )}
                            />
                            {forgotPasswordErrors.confirmPassword && (
                                <Text className="text-red-500 text-sm mt-1">
                                    {forgotPasswordErrors.confirmPassword.message}
                                </Text>
                            )}
                        </View>

                        <CustomToast
                            message={toast.message}
                            isVisible={toast.visible}
                            type={toast.type}
                        />
                        <TouchableOpacity
                            // className={`rounded-lg p-3 ${resetEmailStatus === 'loading' ? 'bg-blue-400' : 'bg-blue-600'}`}
                            onPress={handleForgotPasswordSubmit(onForgotPasswordPress)}
                            // disabled={resetEmailStatus === 'loading'}
                            className={`rounded-lg p-3 ${getSubmitButtonStyle()}`}
                            disabled={submitStatus === 'loading' || submitStatus === 'success'}
                        >
                            {/* {resetEmailStatus === 'loading' ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white text-center font-bold">ENVOYER</Text>
              )} */}
                            {renderSubmitButton(resetEmailStatus, "REUSSI", "RÉESSAYER", "ENVOYER")}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
