import { View, SafeAreaView, Text } from "react-native";
import tw from 'twrnc';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from "./components/Dashboard";
import Checkout from "./components/Checkout";
import Profile from "./components//Subcomponents/Profile";
import OrderHistory from "./components/Subcomponents/OrderHistory"; 
import QRGenerator from "./components/QRGenerator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="dashboard">
        <Stack.Screen 
          name="dashboard" 
          component={Dashboard} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="checkout" 
          component={Checkout} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="profile" 
          component={Profile} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="orderHistory" 
          component={OrderHistory} 
          options={{ headerShown: false }}
        />
         <Stack.Screen 
          name="qrGenerator"
          component={QRGenerator} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
