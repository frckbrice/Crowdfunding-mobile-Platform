// import React, { useState } from 'react';
// import { WebView } from 'react-native-webview';
// import { View } from 'react-native';
// import { PAYPAL_CLIENT_ID, PAYPAL_SECRET } from '@/constants/constants';

// type PaypalButtonProps = {
//   amount: number;
//   currency: string;
//   onSuccess: (data: any) => void;
//   onError: (data: any) => void;
// }

// export const PayPalButton: React.FC<PaypalButtonProps> = ({
//   amount,
//   currency = 'USD',
//   onSuccess,
//   onError,
// }) => {
//   const [isLoading, setIsLoading] = useState(false);

//   // Replace with your actual PayPal Business ID and Currency
//   const PAYPAL_BUSINESS_ID = 'sb-9uyi529618727@business.example.com';
//   const CURRENCY = 'USD';


//   const paypalHTML = `
//     <html>
//       <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <script src="https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}"></script>
//       </head>
//       <body>
//         <View id="paypal-button-container"></View>
//         <script>
//           paypal.Buttons({
//             createOrder: function(data, actions) {
//               return actions.order.create({
//                 purchase_units: [{
//                   amount: {
//                     value: '${amount}',
//                     currency_code: '${currency}'
//                   },
//                   description: 'Charitable Donation'
//                 }]
//               });
//             },
//             onApprove: function(data, actions) {
//               return actions.order.capture().then(function(details) {
//                 window.ReactNativeWebView.postMessage(JSON.stringify({
//                   type: 'success',
//                   details: details
//                 }));
//               });
//             },
//             onError: function(err) {
//               window.ReactNativeWebView.postMessage(JSON.stringify({
//                 type: 'error',
//                 error: err
//               }));
//             }
//           }).render('#paypal-button-container');
//         </script>
//       </body>
//     </html>
//   `;

//   const handleMessage = (event: any) => {
//     const data = JSON.parse(event.nativeEvent.data);
//     if (data.type === 'success') {
//       onSuccess(data.details);
//     } else if (data.type === 'error') {
//       onError(data.error);
//     }
//   };

//   return (
//     <View className="h-64 w-full">
//       <WebView
//         source={{ html: paypalHTML }}
//         onMessage={handleMessage}
//         className="flex-1"
//       />
//     </View>
//   );
// };

import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import { styled } from 'nativewind';

// Styled components using NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledButton = styled(TouchableOpacity);

type PaypalButtonProps = {
  amount: number;
  CURRENCY?: string;
  PAYPAL_BUSINESS_ID?: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
};

// PayPal Donation Button Component
const PayPalDonationButton = ({
  CURRENCY,
  PAYPAL_BUSINESS_ID,
  amount,
}: PaypalButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Replace with your actual PayPal Business ID and Currency


  const handleDonation = async () => {
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
        Alert.alert('Donation Cancelled', 'Thank you for considering a donation.');
      }
    } catch (error) {
      console.error('Donation Error:', error);
      Alert.alert('Donation Error', 'Unable to process donation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledView className="flex-1 items-center justify-center p-4">
      <StyledText className="text-xl font-bold mb-4">Support Our Project</StyledText>

      <StyledView className="flex-row space-x-4">
        <StyledButton
          className="text-gray-300 p-3 rounded-lg"
          onPress={() => handleDonation()}
        >
          {isLoading ? (
            <StyledText className="text-gray-500 mt-4">Processing donation...</StyledText>) : <StyledText className="text-white font-bold">
            Donate with Paypal
          </StyledText>
          }
        </StyledButton>
      </StyledView>
    </StyledView>
  );
};

export default PayPalDonationButton;