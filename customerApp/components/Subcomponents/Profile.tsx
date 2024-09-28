import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'twrnc';

const ProfilePage = () => {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [phone, setPhone] = useState('123-456-7890');

  const handleUpdateProfile = () => {
    console.log('Profile updated:', { name, email, phone });
  };

  return (
    <ScrollView style={tw`bg-[#F1F3F5] flex-1 p-4`}>
      <View style={tw`mb-6`}>
        <Text style={tw`text-3xl font-bold`}>Profile</Text>
        <Text style={tw`text-lg text-gray-600`}>Manage your account settings</Text>
      </View>
      <View style={tw`bg-white p-4 rounded-lg shadow`}>
        <Text style={tw`text-xl font-semibold mb-4`}>User Information</Text>
        <TextInput
          style={tw`border p-2 mb-4 rounded`}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={tw`border p-2 mb-4 rounded`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={tw`border p-2 mb-4 rounded`}
          placeholder="Phone"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>
      <TouchableOpacity
        style={tw`bg-[#0A3D62] p-4 rounded-lg items-center`}
        onPress={handleUpdateProfile}
      >
        <Text style={tw`text-white text-lg`}>Update Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfilePage;