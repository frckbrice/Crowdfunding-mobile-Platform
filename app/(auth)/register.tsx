

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    Image, KeyboardAvoidingView,
    Platform, ScrollView,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import FormField from '@/components/form-field';
import Checkbox from 'expo-checkbox';
import { API_URL, MESSAGES } from '@/constants/constants';
import CustomToast from '@/components/custom-toast';
import { debounce } from 'lodash';// Import debounce for better input handling
import axios, { AxiosResponse } from 'axios';

// Submit button states renderer with memoization
const RenderSubmitButton = React.memo(({ status }: {
    status: "idle" | "loading" | "success" | "error"
}) => {
    switch (status) {
        case 'loading':
            return (
                <View className="flex-row items-center justify-center gap-2">
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-center font-bold italic ml-2">
                        inscription...
                    </Text>
                </View>
            );
        case 'success':
            return (
                <View className="flex-row items-center justify-center space-x-2">
                    <Text className="text-white text-center font-bold">INSCRIT</Text>
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
            return <Text className="text-white text-center font-bold">S'INSCRIRE</Text>;
    }
});

// Form field component for better reusability
const FormInputField = React.memo(({
    label,
    value,
    onChangeText,
    placeholder,
    icon,
    error,
    keyboardType = "default",
    autoCapitalize = "none"
}: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    icon: typeof Ionicons.defaultProps;
    error: string;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) => (
    <View className="mb-4">
        <Text className="mb-2 text-gray-700">
            {label}
            <Text className='text-red-300'>*</Text>
        </Text>
        <View className="flex-row items-center border border-gray-300 rounded-lg p-2">
            <Ionicons name={icon} size={24} color="#2563eb" />
            <TextInput
                className="flex-1 ml-2 text-black-200"
                placeholder={placeholder}
                style={{ color: '#232533' }}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
            />
        </View>
        {error ? (
            <Text className={`text-red-300 text-sm mt-1 ${Platform.OS === 'ios' ? 'font-semibold' : ''}`}>
                {error}
            </Text>
        ) : null}
    </View>
));

const Register = () => {
    const router = useRouter();
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [toast, setToast] = useState({
        visible: false,
        message: "",
        type: "error",
    });

    // Form state with single useState for better performance
    const [formData, setFormData] = useState({
        nomUser: '',
        mdpUser: '',
        username: '',
        acceptPrivacy: false
    });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
        nomUser: '',  // ici nomUser est mis pour pseudo.
        privacy: ''
    });

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

    // Optimized form update with field name parameter
    const handleInputChange = useCallback((field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: '' }));
    }, []);

    // Debounced validation for better performance
    const debouncedValidation = useCallback(
        () => {
            let isValid = true;
            const newErrors = {
                username: '',
                password: '',
                nomUser: '',
                privacy: ''
            };

            if (!formData.username.trim()) {
                newErrors.username = "L'identifiant d'utilisateur est obligatoire";
                isValid = false;
            }

            if (!formData.nomUser.trim()) {
                newErrors.nomUser = "Le nom d'utilisateur est obligatoire";
                isValid = false;
            }

            if (!formData.mdpUser.trim()) {
                newErrors.password = 'Le mot de passe est obligatoire';
                isValid = false;
            }

            if (!formData.acceptPrivacy) {
                newErrors.privacy = 'Vous devez accepter les conditions d\'utilisation';
                isValid = false;
            }

            setErrors(newErrors);
            return isValid;
        },
        [formData]
    );

    const showToast = useCallback((messageKey: "erreur_de_connection" | 'mauvais_identifiants' | '', type = "error", errorMessage?: string) => {
        const language = "fr";
        setToast({
            visible: true,
            message: errorMessage ? errorMessage : MESSAGES[messageKey][language],
            type,
        });

        // Automatically hide toast after delay
        setTimeout(() => {
            setToast(prev => ({ ...prev, visible: false }));
        }, 3300);
    }, []);

    const handlePrivacyPolicyPress = useCallback(() => {
        router.replace('/politique-confidentialite');
    }, [router]);

    const getSubmitButtonStyle = useCallback(() => {
        switch (submitStatus) {
            case 'success': return 'bg-green-600';
            case 'error': return 'bg-red-600';
            case 'loading': return 'bg-blue-400';
            default: return 'bg-blue-600';
        }
    }, [submitStatus]);

    // Memoized signup function with AbortController for cancellable fetch
    const onSignUpPress = useCallback(async () => {
        // Run validation before submission
        //debouncedValidation.cancel(); // Cancel any pending validation
        const isValid = debouncedValidation();

        if (!isValid) {
            showToast("mauvais_identifiants");
            return;
        }

        // Clean up existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        setSubmitStatus('loading');
        abortControllerRef.current = new AbortController();


        // Use AbortController for better fetch management
        // const timeoutId = setTimeout(() => controller.abort(), 20000); // 15s timeout

        const { mdpUser, username, nomUser } = formData;

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
                    url: `${API_URL}/users/signup`, // Use the constant, not hardcoded URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: {
                        mdpUser,
                        username,
                        nomUser,
                    },
                    signal: abortControllerRef.current.signal,
                }),
                timeoutPromise
            ]);


            // Clear timeout if request succeeded
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            const newUser = (response as AxiosResponse).data;

            if (newUser.data) {
                setSubmitStatus('success');
                // Add a success toast
                setToast({
                    visible: true,
                    message: `${newUser?.message}`,
                    type: "success",
                });

                // Navigation delay for better UX
                setTimeout(() => {
                    router.replace('/login');
                }, 300);
            } else {
                throw new Error('Response undefined');
            }
        } catch (err: any) {
            console.error("Signup error:", err.response?.data?.message?.message);
            setSubmitStatus('error');

            // Check if it was a timeout
            if (err?.name === 'AbortError') {
                showToast("erreur_de_connection");
            } else {
                showToast('', 'error', err.response?.data?.message?.message || "mauvais_identifiants");
            }

            // Reset status after delay
            setTimeout(() => setSubmitStatus('idle'), 2000);
        }
    }, [formData, router, showToast, debouncedValidation]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <SafeAreaView className="h-full">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        marginTop: 20,
                        paddingTop: Platform.OS === 'ios' ? 20 : 10,
                        paddingBottom: Platform.select({ ios: 50, android: 30 })
                    }}
                    keyboardShouldPersistTaps="handled" // Improves keyboard handling
                >
                    <View className="px-4 justify-center flex-1">
                        <View className="items-center mb-5">
                            <Image
                                source={require('../../assets/images/favicon.png')}
                                resizeMode='contain'
                                className="w-16 h-16 mb-4"
                            />
                            <Text className="text-2xl font-bold text-blue-600">S'inscrire</Text>
                        </View>
                        <Text className="text-center mb-8 text-gray-600">
                            Veuillez entrer vos identifiants de compte
                        </Text>

                        {/* Form fields using the reusable component */}
                        <FormInputField
                            label="Pseudo"
                            value={formData.nomUser}
                            onChangeText={(text) => handleInputChange('nomUser', text)}
                            placeholder="Entrer votre nom"
                            icon="person"
                            error={errors.nomUser}
                        />

                        <FormInputField
                            label="Email"
                            value={formData.username}
                            onChangeText={(text) => handleInputChange('username', text)}
                            placeholder="Entrer votre adresse email"
                            icon="mail"
                            error={errors.username}
                            keyboardType="email-address"
                        />

                        <View className="mb-4">
                            <Text className="mb-2 text-gray-700">
                                Mot de passe
                                <Text className='text-red-300'>*</Text>
                            </Text>
                            <FormField
                                title={"Mot de passe"}
                                value={formData.mdpUser}
                                placeholder="Entrez votre mot de passe"
                                handleChangeText={(text: string) => handleInputChange('mdpUser', text)}
                                inputStyle="text-black-200"
                            />
                            {errors.password ? (
                                <Text className="text-red-300 text-sm mt-1">{errors.password}</Text>
                            ) : null}
                        </View>

                        <View className="mb-4">
                            <View className="flex-row items-start">
                                <Checkbox
                                    value={formData.acceptPrivacy}
                                    onValueChange={(value) => handleInputChange('acceptPrivacy', value)}
                                    color={formData.acceptPrivacy ? '#2563eb' : undefined}
                                    className="mr-2 mt-1"
                                />
                                <View className="flex-1">
                                    <Text className="text-gray-700">
                                        <Text> J'accepte les</Text>
                                        <Text
                                            className="text-blue-600 underline"
                                            onPress={handlePrivacyPolicyPress}
                                        >
                                            &nbsp;conditions d'utilisation et la politique de confidentialité
                                        </Text>
                                        <Text className='text-red-300'>*</Text>
                                    </Text>
                                </View>
                            </View>
                            {errors.privacy ? (
                                <Text className="text-red-300 text-sm mt-1 mb-2">{errors.privacy}</Text>
                            ) : null}
                        </View>
                    </View>
                    <View className='w-full h-80 rounded-tr-[40px] rounded-tl-[40px]'>
                        <View className='bg-transparent justify-center'>
                            <TouchableOpacity
                                className={`rounded-lg p-3 my-4 mx-5 ${getSubmitButtonStyle()}`}
                                onPress={onSignUpPress}
                                disabled={submitStatus === 'loading' || submitStatus === 'success'}
                                activeOpacity={0.7}
                            >
                                <RenderSubmitButton status={submitStatus} />
                            </TouchableOpacity>

                            <CustomToast
                                message={toast.message}
                                isVisible={toast.visible}
                                type={toast.type}
                            />

                            <View className="flex-row justify-center items-center mt-2">
                                <Text className="text-gray-400 font-extrabold">
                                    Avez-vous un compte ?
                                </Text>
                                <TouchableOpacity onPress={() => router.replace('/login')}>
                                    <Text className="text-lg text-blue-600 font-extrabold ml-2">Se connecter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default Register;