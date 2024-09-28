import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

const orders = [
  { id: '001', date: '2024-09-20', total: '₹500.00' },
  { id: '002', date: '2024-09-22', total: '₹300.00' },
  { id: '003', date: '2024-09-24', total: '₹700.00' },
];

const OrderHistory = () => {
  return (
    <ScrollView style={tw`bg-[#F1F3F5] flex-1 p-4`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-3xl font-bold`}>Order History</Text>
        <Text style={tw`text-lg text-gray-600`}>Your past orders</Text>
      </View>
      {orders.map((order) => (
        <View key={order.id} style={tw`bg-white p-4 rounded-lg shadow mb-4`}>
          <Text style={tw`text-lg font-semibold`}>Order ID: {order.id}</Text>
          <Text style={tw`text-gray-600`}>Date: {order.date}</Text>
          <Text style={tw`text-gray-600`}>Total: {order.total}</Text>
          <TouchableOpacity
            style={tw`bg-[#0A3D62] p-2 rounded-lg mt-2`}
            onPress={() => console.log(`View details for ${order.id}`)}
          >
            <Text style={tw`text-white`}>View Details</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default OrderHistory;
