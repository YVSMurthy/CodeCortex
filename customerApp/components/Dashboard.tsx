import { View, SafeAreaView, Text, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tw from 'twrnc';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Cart from './Subcomponents/Cart';
import Profile from './Subcomponents/Profile';
import OrderHistory from './Subcomponents/OrderHistory';

const Stack = createNativeStackNavigator();

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function Dashboard({ navigation }: any) {
  const [currWindow, setCurrWindow] = useState<string>('cart');

  const cartAnimValue = useState(new Animated.Value(currWindow === 'cart' ? 1 : 0))[0];
  const profileAnimValue = useState(new Animated.Value(currWindow === 'profile' ? 1 : 0))[0];
  const orderHistoryAnimValue = useState(new Animated.Value(currWindow === 'orderHistory' ? 1 : 0))[0];

  // Function to animate background color transitions
  const animateTab = (animValue: Animated.Value, toValue: number) => {
    Animated.timing(animValue, {
      toValue,
      duration: 200, 
      useNativeDriver: false,
    }).start();
  };

  // Update animations when currWindow changes
  useEffect(() => {
    animateTab(cartAnimValue, currWindow === 'cart' ? 1 : 0);
    animateTab(profileAnimValue, currWindow === 'profile' ? 1 : 0);
    animateTab(orderHistoryAnimValue, currWindow === 'orderHistory' ? 1 : 0);
  }, [currWindow]);

  // Interpolate background colors
  const cartBackgroundColor = cartAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#FFCC80'],
  });
  const profileBackgroundColor = profileAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#FFCC80'],
  });
  const orderHistoryBackgroundColor = orderHistoryAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#FFCC80'],
  });

  // Navigation handlers
  const cartPressed = () => {
    setCurrWindow('cart');
    navigation.navigate('Cart');
  };
  const profilePressed = () => {
    setCurrWindow('profile');
    navigation.navigate('Profile');
  };
  const orderHistoryPressed = () => {
    setCurrWindow('orderHistory');
    navigation.navigate('OrderHistory');
  };

  return (
    <SafeAreaView style={tw`flex-1`}>
      <View style={tw`w-full h-full bg-[#F1F3F5]`}>
        <Stack.Navigator initialRouteName="Cart" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OrderHistory" component={OrderHistory} />
          <Stack.Screen name="Cart" component={Cart} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>

        <View style={tw`h-[9%] w-full flex flex-row justify-evenly items-center bg-[#f7f7f7] border-t border-[#e0e0e0]`}>
          <AnimatedTouchableOpacity
            style={[tw`py-2 px-6 rounded-3xl`, { backgroundColor: orderHistoryBackgroundColor }]}
            onPress={orderHistoryPressed}
          >
            <Icon name="history" size={30} color="#000" />
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity
            style={[tw`py-2 px-6 rounded-3xl`, { backgroundColor: cartBackgroundColor }]}
            onPress={cartPressed}
          >
            <Icon1 name="cart-outline" size={30} color="#000" />
          </AnimatedTouchableOpacity>
          <AnimatedTouchableOpacity
            style={[tw`py-2 px-6 rounded-3xl`, { backgroundColor: profileBackgroundColor }]}
            onPress={profilePressed}
          >
            <Icon name="account-circle" size={30} color="#000" />
          </AnimatedTouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
