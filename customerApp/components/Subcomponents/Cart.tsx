import { View, SafeAreaView, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image } from "react-native";
import { useState, useEffect, useRef } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import tw from 'twrnc';
import axios from 'axios';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

const ProductTile = ({ product, onUpdateQuantity }: any) => {
  const { name, price, quantity, product_id } = product;
  const totalPrice = price * quantity;

  const handleDeleteProduct = () => {
    onUpdateQuantity(product_id, 0); // Remove the product
  };

  return (
    <View style={tw`flex flex-row items-center justify-between bg-[#FFD580] p-4 rounded-lg mb-4`}>
      <View style={tw`w-18 h-18 bg-[#F4F4F4] rounded-md items-center justify-center`}>
        <Icon name="image" size={40} color="#BDBDBD" />
      </View>

      <View style={tw`flex-1 ml-4 gap-2`}>
        <Text style={tw`text-lg font-semibold text-[#2D2D2D]`}>{name}</Text>
        <Text style={tw`text-sm text-[#2D2D2D]`}>Quantity: {quantity}</Text>
      </View>

      <View style={tw`flex flex-col items-center gap-2`}>
        <Text style={tw`text-3xl font-semibold text-[#2D2D2D]`}>₹{totalPrice}</Text>
        <TouchableOpacity onPress={handleDeleteProduct}>
          <Icon name="delete" size={24} color="#E74C3C" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function Cart({ navigation }: any) {
  const [notification, setNotification] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<any[]>([]);
  const [originalCart, setOriginalCart] = useState<any[]>([]); // State to store original cart items
  const [loading, setLoading] = useState<boolean>(false);
  const statusRef = useRef(false); // Track NFC scanner state

  // Start NFC scanner on page load
  useEffect(() => {
    const checkNFC = async () => {
      try {
        const deviceIsSupported = await NfcManager.isSupported();
        if (deviceIsSupported) {
          await NfcManager.start();
        }
      } catch (e) {
        console.log("Error while checking support: ", e);
      }
    };

    checkNFC();
  }, []);

  useEffect(() => {
    const startScanner = async () => {
      if (!statusRef.current) {
        try {
          console.log("Scanner started");
          statusRef.current = true;
          await NfcManager.registerTagEvent();
        } catch (error) {
          console.log("Failed to start NFC scanner", error);
        }
      } else {
        console.log("NFC already started");
      }
    };

    startScanner();

    // Stop NFC scanner when component unmounts
    return () => {
      NfcManager.unregisterTagEvent();
      statusRef.current = false;
    };
  }, []);

  // Handle scanned NFC tag and add product to cart
  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, async (tag: any) => {
      console.log('Tag found: ', tag);
      const firstRecord = tag.ndefMessage[0];
      const byteArray = firstRecord.payload;
      let messageString = String.fromCharCode(...byteArray);
      messageString = messageString.slice(3, messageString.length);
      const { product_id } = JSON.parse(messageString);

      let existingProduct = cart.find((item) => item.product_id === product_id);

      if (!existingProduct) {
        setLoading(true);
        try {
          const ip = 'http://192.168.210.206:3001/';
          const response = await axios.post(ip + 'getProductDetails', { product_id });
          const product = response.data;

          // Add the new product with a quantity of 1
          setCart((prevCart) => {
            const updatedCart = [...prevCart, { ...product, quantity: 1 }];
            setOriginalCart(updatedCart); // Set the original cart to the updated cart
            return updatedCart;
          });
        } catch (error) {
          console.log("Error fetching product details", error);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, [cart]);

  const updateProductQuantity = (id: String, newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove the product if quantity is 0
      setCart(cart.filter((product) => product.product_id !== id));
      setOriginalCart(originalCart.filter((product) => product.product_id !== id)); // Also update the original cart
    } else {
      setCart(cart.map((product) =>
        product.product_id === id ? { ...product, quantity: newQuantity } : product
      ));
    }
  };

  const notificationPressed = () => {
    setNotification(false);
    navigation.navigate("notifications");
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text === "") {
      // Reset the cart if the search query is empty
      setCart(originalCart);
    } else {
      setCart(originalCart.filter(product =>
        product.name.toLowerCase().includes(text.toLowerCase())
      ));
    }
  };

  const checkout = () => {
    // Stop NFC scanner when checking out
    NfcManager.unregisterTagEvent();
    statusRef.current = false;

    const totalAmount = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    navigation.navigate("checkout", { cart, totalAmount });
  };

  // Clear the cart when navigating from QR generator
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCart([]); // Empty the cart
      setOriginalCart([]); // Empty the original cart
      statusRef.current = false; // Ensure NFC scanner status is reset

      // Restart NFC scanner
      const restartScanner = async () => {
        if (!statusRef.current) {
          try {
            await NfcManager.registerTagEvent();
            statusRef.current = true;
          } catch (error) {
            console.log("Failed to restart NFC scanner", error);
          }
        }
      };

      restartScanner();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={tw`w-full h-full bg-[#F1F3F5] flex p-5 relative`}>
      <View style={tw`flex flex-row items-center justify-between mb-6`}>
        <Text style={tw`text-2xl font-semibold text-[#121212]`}>Hello, Suyash</Text>
        {notification ? (
          <Icon name="notifications-active" size={30} color="#000" onPress={notificationPressed} />
        ) : (
          <Icon name="notifications" size={30} color="#000" onPress={notificationPressed} />
        )}
      </View>

      <View style={tw`flex flex-row items-center w-full h-14 bg-white rounded-lg mb-6`}>
        <TextInput
          placeholder="Search"
          style={tw`px-4 py-2 text-lg w-[85%]`}
          value={searchQuery}
          onChangeText={handleSearch} // Update search query dynamically
        />
        <Icon1 name="search" size={30} color="#000" style={tw`ml-2`} />
      </View>

      <ScrollView style={tw`flex-1`} contentContainerStyle={tw`pb-6`}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : cart.length === 0 ? (
          <View style={tw`flex items-center justify-center mt-20`}>
            <Image source={require('../../assets/empty_cart.png')} style={tw`ml-5`} />
          </View>
        ) : (
          <View style={tw`flex items-center`}>
            <Text style={tw`text-2xl font-bold text-black ml-3`}>Cart Items</Text>
            <View style={tw`px-2 py-4 w-full`}>
              {cart.map((product) => (
                <ProductTile key={product.product_id} product={product} onUpdateQuantity={updateProductQuantity} />
              ))}
            </View>
            <TouchableOpacity style={tw`mt-3 w-[80%] h-16 bg-[#0A3D62] p-4 flex items-center justify-center rounded-xl`} onPress={checkout}>
              <Text style={tw`text-2xl text-white`}>Checkout</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
