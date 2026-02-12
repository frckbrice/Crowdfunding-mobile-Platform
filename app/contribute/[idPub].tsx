
// import React, { useState } from 'react';
// import { View, StyleSheet, ActivityIndicator } from 'react-native';
// import { WebView } from 'react-native-webview';


// export default function PayPalDonation() {
//     const [isLoading, setIsLoading] = useState(true);
//     const paypalDonationURL = `https://www.paypal.com/donate?hosted_button_id=${process.env.EXPO_PUBLIC_PAYPAL_DONATION_BUTTON_ID}`;

//     console.log("\n\n paypalDonationURL: ", paypalDonationURL);
//     return (
//         <View style={styles.container}>
//             {isLoading && (
//                 <ActivityIndicator
//                     size="large"
//                     color="#0000ff"
//                     style={styles.loader}
//                 />
//             )}
//             <WebView
//                 source={{ uri: paypalDonationURL }}
//                 style={styles.webview}
//                 javaScriptEnabled={true}
//                 domStorageEnabled={true}
//                 startInLoadingState={true}
//                 originWhitelist={['*']}
//                 allowsInlineMediaPlayback={true}
//                 mediaPlaybackRequiresUserAction={false}
//                 onLoadStart={() => setIsLoading(true)}
//                 onLoadEnd={() => setIsLoading(false)}
//                 onError={(syntheticEvent) => {
//                     const { nativeEvent } = syntheticEvent;
//                     console.warn('WebView error: ', nativeEvent);
//                 }}
//             />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#111827',
//     },
//     webview: {
//         flex: 1,
//     },
//     loader: {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         right: 0,
//         bottom: 0,
//         justifyContent: 'center',
//         alignItems: 'center',
//         zIndex: 1,
//     },
// });

/**
 *
 <form action="https://www.paypal.com/donate" method="post" target="_top">
<input type="hidden" name="hosted_button_id" value="LW7NY7QKHDVY2" />
<input type="image" src="https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donate_SM.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Bouton Faites un don avec PayPal" />
<img alt="" border="0" src="https://www.paypal.com/fr_FR/i/scr/pixel.gif" width="1" height="1" />
</form>

 */
/**
 * https://www.paypal.com/donate/?hosted_button_id=LW7NY7QKHDVY2
 */

import PayPalDonation from "@/components/paypal-contribute";

export default PayPalDonation;
