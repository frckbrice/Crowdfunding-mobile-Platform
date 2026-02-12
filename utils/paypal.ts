// import { WebView } from 'react-native-webview';
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET } from '@/constants/constants';

export const generatePayPalToken = async (amount: string, currency: string = 'USD') => {
  try {
    const response =
      await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer
            .from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)
            .toString('base64')}`,
        },
        body: 'grant_type=client_credentials',
      });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error generating PayPal token:', error);
    throw error;
  }
};

export const createPayPalOrder = async (
  amount: string,
  currency: string = 'USD',
  token: string) => {
  try {
    const response =
      await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: currency,
              value: amount,
            },
            description: 'Charitable Donation',
          }],
        }),
      });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    throw error;
  }
};
