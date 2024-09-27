import { View, SafeAreaView, Text } from "react-native";
import tw from 'twrnc';

export default function App() {
  return (
    <SafeAreaView style={tw`w-full h-full bg-[#F1F3F5] flex items-center justify-center`}>
      <View>
        <Text style={tw`text-2xl font-bold`}>This is an React-Native app</Text>
      </View>
    </SafeAreaView>
  )
}