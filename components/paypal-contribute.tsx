
import React, { useState, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { PAYPAL_DONATION_BUTTON_ID } from '@/constants/constants';
import * as Device from 'expo-device';

const PAYPAL_BUTTON_ID = process.env.EXPO_PUBLIC_PAYPAL_DONATION_BUTTON_ID || (PAYPAL_DONATION_BUTTON_ID ?? 'LW7NY7QKHDVY2');

// Create the PayPal URL - using https is critical for iOS
const paypalDonationURL = `https://www.paypal.com/donate?hosted_button_id=${PAYPAL_BUTTON_ID}`;

export default function PayPalDonation() {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const webViewRef = useRef<WebView>(null);


    // iOS requires additional user agent for some payment processors
    const userAgent = Platform.OS === 'ios'
        ? `Mozilla/5.0 (iPhone; CPU iPhone OS ${Device.osVersion?.replace('.', '_') ?? '11_0'} 
        like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/${Device.osVersion ?? '11_0'} Mobile Safari/605.1`
        : undefined;

    // This JavaScript helps with iOS compatibility

    const injectedJavaScript = `
        window.onerror = function(message, sourcefile, lineno, colno, error) {
            window.ReactNativeWebView.postMessage('error:' + message);
            return true;
        };
        true;
    `;

    const handleMessage = (event: any) => {
        const { data } = event.nativeEvent;
        if (data.startsWith('error:')) {
            console.warn('WebView JavaScript error:', data.substr(6));
            setHasError(true);
        }
    };

    const reload = () => {
        setHasError(false);
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {isLoading && (
                    <ActivityIndicator
                        size="large"
                        color="#0070ba"
                        style={styles.loader}
                    />
                )}

                {hasError ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>
                            There was a problem loading the payment page.
                        </Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={reload}
                        >
                            <Text style={styles.retryButtonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <WebView
                        ref={webViewRef}
                        source={{ uri: paypalDonationURL }}
                        style={styles.webview}
                        userAgent={userAgent}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        originWhitelist={['https://*', 'http://*']}
                        allowsInlineMediaPlayback={true}
                        mediaPlaybackRequiresUserAction={false}
                        mixedContentMode="compatibility"
                        onLoadStart={() => {
                            setIsLoading(true);
                            setHasError(false);
                        }}
                        onLoadEnd={() => setIsLoading(false)}
                        onError={(syntheticEvent) => {
                            const { nativeEvent } = syntheticEvent;
                            console.warn('WebView error: ', nativeEvent);
                            setHasError(true);
                            setIsLoading(false);
                        }}
                        injectedJavaScript={injectedJavaScript}
                        onMessage={handleMessage}
                        decelerationRate="normal"
                        sharedCookiesEnabled={true}
                        cacheEnabled={true}
                        incognito={false}
                        thirdPartyCookiesEnabled={true}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#111827',
    },
    container: {
        flex: 1,
        backgroundColor: '#111827',
    },
    webview: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: '#0070ba', // PayPal blue
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});