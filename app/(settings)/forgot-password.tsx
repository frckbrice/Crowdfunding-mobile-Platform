import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useUserGlobal from '@/hooks/use-user-hook';
import { useForm, Controller } from 'react-hook-form';
import renderSubmitButton from '@/components/submited-button';
import { API_URL, MESSAGES } from '@/constants/constants';
import CustomToast from '@/components/custom-toast';
import axios from 'axios';

interface ForgotPasswordFormData {
  email: string;
}

// export default ResetPassword;
// Profile Edit Screen
const ForgotPassword: React.FC = () => {
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

  const router = useRouter();

  useEffect(() => {
    if (resetEmailStatus === 'success') {
      router.push('/login');
    }
  }, [resetEmailStatus]);

  const showToast = (messageKey:
    "erreur_de_connection"
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


    try {
      // const res = await fetch(`${API_URL}/users/forgot-password`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     username: data.email,
      //     // mdpUser: data.confirmPassword
      //   }),
      // });

      // if (!res.ok) {
      //   throw new Error('Password reset request failed');
      // }

      const options = {
        url: `${API_URL}/users/forgot-password`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          username: data.email,
          // mdpUser: data.confirmPassword
        },
      }

      const response = await axios.request(options);

      setResetEmailStatus('success');
      Alert.alert('REUSSI', 'Un email vous a été envoyé pour changer votre mot de passe');
    } catch (err: any) {
      console.error('API Error:', err?.response?.data || err.message);
      setResetEmailStatus('error');
      showToast("erreur_de_connection");
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
    ><TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView className="h-full">
          <ScrollView contentContainerStyle={{ justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
            <View className="px-4 justify-center flex-1 w-full">

              <Text className="text-center mb-8 text-gray-600">
                Entrez votre adresse email pour reinitialiser votre compte
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
                    <View className={`flex-row items-center border border-gray-300 rounded-lg p-2 ${forgotPasswordErrors.email ? 'border-red-500' : ''}`}>

                      <Ionicons name="mail" size={24} color="#2563eb" />
                      <TextInput
                        className="flex-1 ml-2 text-black-200"
                        placeholder="Entrer votre email"
                        value={value}
                        onChangeText={onChange}
                        autoCapitalize="none"
                        keyboardType="email-address"
                      />
                    </View>
                  )}
                />
                {forgotPasswordErrors.email && (
                  <Text className="text-red-500 text-sm mt-1">
                    {forgotPasswordErrors.email.message}
                  </Text>
                )}
              </View>

              <CustomToast
                message={toast.message}
                isVisible={toast.visible}
                type={toast.type}
              />
              <TouchableOpacity
                onPress={handleForgotPasswordSubmit(onForgotPasswordPress)}
                className={`rounded-lg p-3 ${getSubmitButtonStyle()}`}
                disabled={submitStatus === 'loading' || submitStatus === 'success'}
              >

                {renderSubmitButton(resetEmailStatus, "REUSSI", "RÉESSAYER", "ENVOYER")}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
}



export default ForgotPassword;
