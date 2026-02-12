

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';

import FormField from '@/components/form-field';
import * as SecureStore from 'expo-secure-store';
import { API_URL, MESSAGES } from '@/constants/constants';
import CustomToast from '@/components/custom-toast';
import axios, { AxiosResponse } from 'axios';

interface LoginFormData {
    username: string;
    password: string;
}

const LoginScreen: React.FC = () => {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "error",
    });
    const router = useRouter();
    const abortControllerRef = useRef<AbortController | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Clean up any pending requests when component unmounts
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        defaultValues: {
            username: '',
            password: ''
        },
        mode: 'onChange'
    });

    // Improved toast function
    const showToast = useCallback((messageKey: "erreur_de_connection" | 'mauvais_identifiants', type = "error") => {
        const language = "fr"; // or "en" based on your app's language setting
        setToast({
            visible: true,
            message: MESSAGES[messageKey][language],
            type,
        });

        // Hide toast after 3.5 seconds
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3500);
    }, []);

    const onSignInPress = useCallback(async (data: LoginFormData) => {
        // Clear any existing token
        await
            SecureStore.deleteItemAsync('currentUser');
        // Quick validation
        if (!data.username.trim() || !data.password.trim()) {
            showToast("mauvais_identifiants");
            return;
        }

        // Clean up existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setSubmitStatus('loading');
        abortControllerRef.current = new AbortController();

        try {
            // Create a separate timeout variable that we can clear
            const timeoutPromise = new Promise((_, reject) => {
                timerRef.current = setTimeout(() => {
                    reject(new Error('Request timeout'));
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                }, 10000); // Slightly longer timeout for iOS
            });

            // Race between the actual request and the timeout
            const response: AxiosResponse | unknown = await Promise.race([
                axios({
                    url: `${API_URL}/auth/login`, // Use the constant, not hardcoded URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        username: data.username,
                        mdpUser: data.password
                    },
                    signal: abortControllerRef.current.signal,
                }),
                timeoutPromise
            ]);

            // Clear timeout if request succeeded
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            const responseData = (response as AxiosResponse).data;

            if (responseData?.accessToken) {
                try {
                    // First set status to success
                    setSubmitStatus('success');

                    // Wait for SecureStore operation to complete
                    await SecureStore.setItemAsync('currentUser', responseData.accessToken);

                    // Only navigate after token is stored
                    router.replace('/accueil');
                } catch (storageError) {
                    console.error("Error saving token:", storageError);
                    await SecureStore.setItemAsync('currentUser', responseData.accessToken);
                    // Show error but still try to navigate
                    router.replace('/accueil');
                }
            } else {
                setSubmitStatus('error');
                showToast("mauvais_identifiants");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            setSubmitStatus('error');

            // Clear any pending timeout
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            // More specific error handling
            if (err.name === 'AbortError' || err.code === 'ECONNABORTED' || err.message === 'Request timeout') {
                showToast("erreur_de_connection");
            } else if (err.response && err.response.status === 401) {
                showToast("mauvais_identifiants");
            }
        }
    }, [router, showToast]);

    const renderSubmitButton = (status: "idle" | "loading" | "success" | "error") => {
        switch (status) {
            case 'loading':
                return (
                    <View className="flex-row items-center justify-center gap-2">
                        <ActivityIndicator size="small" color="white" />
                        <Text className="text-white text-center font-bold italic">
                            connection
                        </Text>
                    </View>
                );
            case 'success':
                return (
                    <View className="flex-row items-center justify-center space-x-2">
                        <Text className="text-white text-center font-bold">CONNECTÉ</Text>
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
                return <Text className="text-white text-center font-bold">CONNEXION</Text>;
        }
    };

    const getSubmitButtonStyle = () => {
        switch (submitStatus) {
            case 'success': return 'bg-green-600';
            case 'error': return 'bg-red-600';
            case 'loading': return 'bg-blue-400';
            default: return 'bg-blue-600';
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="h-full">
                <ScrollView contentContainerStyle={{
                    flexGrow: 1,
                    marginTop: 20,
                    paddingTop: Platform.OS === 'ios' ? 20 : 10,
                    paddingBottom: Platform.select({ ios: 50, android: 30 })
                }}>
                    <View className="px-4 justify-center flex-1 w-full">
                        <View className="items-center mb-5">
                            <Image
                                source={require('../../assets/images/favicon.png')}
                                resizeMode='contain'
                                className="w-24 h-24 mb-4"
                            />
                            <Text className="text-3xl font-bold text-blue-600">Se connecter !</Text>
                        </View>
                        <Text className="text-center mb-8 text-gray-600">
                            Veuillez saisir votre nom d'utilisateur et votre mot de passe pour vous connecter
                        </Text>

                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">
                                Email
                                <Text className='text-red-500'>*</Text>
                            </Text>
                            <Controller
                                control={control}
                                name="username"
                                rules={{
                                    required: 'Le nom d\'utilisateur est requis',
                                    minLength: {
                                        value: 3,
                                        message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères'
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Adresse email invalide'
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <View className={`flex-row items-center border rounded-lg p-2 
                                            ${errors.username ? 'border-red-500' : 'border-gray-300'}`}>
                                        <Ionicons name="person" size={24} color="#2563eb" />
                                        <TextInput
                                            className="flex-1 ml-2 text-black-200"
                                            placeholder="Entrer votre nom d'utilisateur"
                                            value={value}
                                            onChangeText={onChange}
                                            autoCapitalize="none"
                                            autoComplete="email"
                                            keyboardType="email-address"
                                            testID="email-input"
                                        />
                                    </View>
                                )}
                            />
                            {errors.username && (
                                <Text className="text-red-500 text-sm mt-1">{errors.username.message}</Text>
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">
                                Mot de passe
                                <Text className='text-red-500'>*</Text>
                            </Text>
                            <Controller
                                control={control}
                                name="password"
                                rules={{
                                    required: 'Le mot de passe est requis',
                                    minLength: {
                                        value: 4,
                                        message: 'Le mot de passe doit contenir au moins 6 caractères'
                                    }
                                }}
                                render={({ field: { onChange, value } }) => (
                                    <FormField
                                        title={"Mot de passe"}
                                        value={value}
                                        placeholder="Entrer votre mot de pass..."
                                        handleChangeText={onChange}
                                        inputStyle="placeholder:text-gray-200 text-black-200"
                                    />
                                )}
                            />
                            {errors.password && (
                                <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
                            )}
                        </View>

                        <TouchableOpacity
                            onPress={() => router.push('/forgot-password')}
                            className="mb-4"
                        >
                            <Text className="text-blue-600 text-right">Mot de passe oublié ?</Text>
                        </TouchableOpacity>

                        <View className='w-full mt-4'>
                            <TouchableOpacity
                                className={`rounded-lg p-3 ${getSubmitButtonStyle()}`}
                                onPress={handleSubmit(onSignInPress)}
                                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                                testID="login-button"
                            >
                                {renderSubmitButton(submitStatus)}
                            </TouchableOpacity>

                            <CustomToast
                                message={toast.message}
                                isVisible={toast.visible}
                                type={toast.type}
                            />

                            <View className="flex-row justify-center items-center mt-4">
                                <Text className="text-gray-500 font-extrabold">Vous n'avez pas de compte ? </Text>
                                <TouchableOpacity
                                    onPress={() => router.replace('/register')}
                                    disabled={submitStatus === 'loading'}
                                >
                                    <Text className="text-lg text-blue-600 font-extrabold">S'inscrire</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;