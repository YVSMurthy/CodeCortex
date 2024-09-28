import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

export default function Checkout({ navigation }: any) {
  const route = useRoute();
  const { cart, totalAmount }: any = route.params;

  const gstRate = 0.12;
  const gstAmount = totalAmount * gstRate;
  const finalTotal = totalAmount + gstAmount;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Disable default back action by hiding the header back button
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false, // Disable swipe back gesture on iOS
    });
  }, [navigation]);

  const handlePayAndProceed = async () => {
    setLoading(true);
    try {
      const ip = 'http://192.168.210.206:3001';
      const response = await axios.post(`${ip}/getProductHash`, {
        cart: cart.map((item: any) => ({ product_id: item.product_id })),
        totalAmount: finalTotal,
      });

      if (response.status === 200 && response.data) {
        // Ensure both products and hash are sent
        navigation.navigate('qrGenerator', {
          products: cart, // Assuming `cart` contains the products
          hash: response.data.hash
        });
      } else {
        throw new Error('Failed to get product hash');
      }
    } catch (error: any) {
      console.error('Error details:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      Alert.alert('Error', error.response?.data?.error || 'Failed to proceed with payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={tw`w-full h-full bg-[#F1F3F5] flex p-5`}>
      <ScrollView contentContainerStyle={tw`pb-6`}>
        <Text style={tw`text-3xl font-semibold text-[#121212] mb-6`}>Order Summary</Text>

        <View style={tw`bg-white p-4 rounded-lg mb-4`}>
          <Text style={tw`text-lg font-semibold mb-2 text-[#222]`}>Items Bought:</Text>
          {cart.map((product: any, index: number) => (
            <View key={index} style={tw`flex flex-row justify-between mb-2`}>
              <Text style={tw`text-base text-[#222]`}>{product.name}</Text>
              <Text style={tw`text-base text-[#222]`}>₹{product.price.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={tw`bg-white p-4 rounded-lg mb-4`}>
          <Text style={tw`text-lg font-semibold mb-2 text-[#222]`}>Summary:</Text>
          <View style={tw`flex flex-row justify-between`}>
            <Text style={tw`text-base text-[#222]`}>Subtotal:</Text>
            <Text style={tw`text-base text-[#222]`}>₹{totalAmount.toFixed(2)}</Text>
          </View>
          <View style={tw`flex flex-row justify-between mt-2`}>
            <Text style={tw`text-base text-[#222]`}>GST (12%):</Text>
            <Text style={tw`text-base text-[#222]`}>₹{gstAmount.toFixed(2)}</Text>
          </View>
          <View style={tw`flex flex-row justify-between mt-2`}>
            <Text style={tw`text-base font-bold text-[#222]`}>Total:</Text>
            <Text style={tw`text-base font-bold text-[#222]`}>₹{finalTotal.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={tw`text-lg font-semibold mb-3 mt-5 text-[#222]`}>Payment Options:</Text>
        <View style={tw`w-full h-14 bg-white rounded-xl flex flex-row items-center justify-between px-4 py-2`}>
          <Text style={tw`text-lg`}>Google Pay</Text>
          <Icon name="caret-down-circle-outline" size={30} color="#000" />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={tw`w-[80%] h-14 bg-[#0A3D62] p-4 flex items-center justify-center rounded-xl ml-10 mt-10`}
          onPress={handlePayAndProceed}
          disabled={loading}
        >
          <Text style={tw`text-xl text-white`}>{loading ? 'Processing...' : 'Pay and Proceed'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}