// import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
// import { useEffect, useState, useRef } from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import tw from 'twrnc';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import Icon1 from 'react-native-vector-icons/MaterialIcons'

// const Stack = createNativeStackNavigator();

// export default function App({navigation}: any) {



//   return (
//     <SafeAreaView>
//       <View style={tw`w-full h-full bg-[#F1F3F5]`}>
//         <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Home" component={Home} />
//           <Stack.Screen name="Loan" component={Loan} />
//           <Stack.Screen name="AddRecord" component={AddRecord} />
//           <Stack.Screen name="Account" component={Account} />
//           <Stack.Screen name="Transactions" component={TransactionHistory} />
//         </Stack.Navigator>

//         <View style={tw`h-[9%] w-full absolute bottom-0 flex flex-row justify-evenly items-center bg-[#f7f7f7] border border-[#e0e0e0] z-10`}>
//           <Icon name="home" size={30} color="#000"
//             onPress={homePressed} />
//           <Icon1 name="money" size={30} color="#000"
//             onPress={LoanPressed} />
//           <Icon name="plus-circle-outline" size={30} color="#000"
//             onPress={addPressed} />
//           <Icon name="account-circle" size={30} color="#000"
//             onPress={accountPressed} />
//         </View>
//       </View>
//     </SafeAreaView>
//   )
// }