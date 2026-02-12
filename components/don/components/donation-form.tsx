import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import PayPalDonationButton from './paypal-button';
import { DonationResponse } from '@/lib/types';
import * as WebBrowser from 'expo-web-browser';

export const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState('');
  const [showPayPal, setShowPayPal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const PAYPAL_BUSINESS_ID = 'sb-9uyi529618727@business.example.com';
  const CURRENCY = 'EUR';

  const handleDonationSuccess = (details: DonationResponse) => {
    Alert.alert(
      'Thank You!',
      `Your donation of ${details.amount.value} ${details.amount.currency_code} has been processed successfully!`,
      [{
        text: 'OK', onPress: () => {
          setAmount('');
          setShowPayPal(false);
        }
      }]
    );
    // Here you would typically save the donation details to your backend
  };

  const handleDonationError = (error: any) => {
    Alert.alert('Error', 'There was an error processing your donation. Please try again.');
    setShowPayPal(false);
  };

  const handleAmountSubmit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Montant Invalid', 'Veuillez entrer un montant valid!');
      return;
    }
    setShowPayPal(true);
    setIsLoading(true);

    try {
      // Construct PayPal donation URL
      const donationUrl = `https://www.paypal.com/donate?business=${encodeURIComponent(PAYPAL_BUSINESS_ID!)}` +
        `&amount=${amount}` +
        `&currency_code=${CURRENCY}`;

      // Open in system browser
      const result = await WebBrowser.openBrowserAsync(donationUrl);

      // Handle browser result
      if (result.type === 'cancel') {
        Alert.alert('Donation annulee', 'Merci d\'avoir voulu a faire un don');
      }
    } catch (error) {
      console.error('Donation Error:', error);
      Alert.alert('Erreur', 'Impossible de proceder. Veuiller reessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="p-4 w-full">
      <Text className="text-xl font-bold mb-4 text-gray-300">Faire un Don</Text>
      <View>
        <View className='flex-row w-full rounded
                justify-between items-center
                 bg-gray-800 pr-2 my-2 '>
          <TextInput
            className="bg-transparent
              p-2 rounded w-[80%]
               text-white 
              h-100"
            placeholder="Veuillez entrer le montant du don"
            keyboardType="decimal-pad"
            value={amount}
            onChangeText={(amount) => setAmount(amount)}
            placeholderTextColor={"#404757"}
          />
          <Text className="text-white ml-2">€</Text>
        </View>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg p-3"
          onPress={handleAmountSubmit}
        >
          {isLoading ? <ActivityIndicator size={"small"} color={"gray"} /> : <Text className="text-white text-center font-semibold">
            Faite un don
          </Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};