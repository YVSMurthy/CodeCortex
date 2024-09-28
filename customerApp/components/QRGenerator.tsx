import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import tw from 'twrnc';

export default function QRGenerator({ route, navigation }: any) {
  const { products, hash } = route.params;
  const qrContent = JSON.stringify({ products, hash });

  return (
    <View style={tw`flex-1 justify-center items-center bg-gray-100 p-5`}>
      <Text style={tw`text-2xl font-bold mb-5`}>QR Code Generated</Text>
      <QRCode value={qrContent} size={200} />
      <Text style={tw`text-lg text-center mt-5`}>Scan this QR to proceed with the checkout.</Text>
      <TouchableOpacity 
        onPress={() => navigation.navigate('dashboard')}
        style={tw`mt-10 bg-blue-500 px-10 py-2 rounded-full`}
      >
        <Text style={tw`text-white text-lg`}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}
