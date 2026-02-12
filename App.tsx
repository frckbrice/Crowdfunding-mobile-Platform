import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const App = () => {
  return (
    <LinearGradient
      colors={['#87CEFA', '#4169E1']}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 100 }}
    >
      <View className="bg-white rounded-2xl p-4 shadow-lg w-16 h-16">
        <Text className="text-4xl font-bold text-blue-600">
          <Image
            source={require('../assets/images/favicon.png')}
            resizeMode='contain'
            className="w-8 h-8"
          />
        </Text>
        {/* <Image
          source={require('../assets/images/adaptive-icon.png')}
          resizeMode='contain'
        // className="w-16 h-16 mb-4"
        /> */}
      </View>
    </LinearGradient>
  );
};

export default App;