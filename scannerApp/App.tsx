import { useEffect, useState, useRef } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import tw from 'twrnc';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

export default function App() {

  const [status, setStatus] = useState<boolean>(false)
  const statusRef = useRef(status)
  const [supported, setSupported] = useState<boolean>(true)
  const [cart, setCart] = useState<{product_id: String}[]>([{product_id: "T0L9nQ5bXlyw+Cqh/x4HgihkWlUDeNyCun8DazZDWO/q"}])

  useEffect(() => {
    statusRef.current = status;
  }, [status])

  useEffect(() => {
    const checkNFC = async () => {
      try {
        const deviceIsSupported = await NfcManager.isSupported()

        setSupported(deviceIsSupported)
        if (deviceIsSupported) {
          await NfcManager.start()
        }
      }
      catch (e) {
        console.log("Error while checking support : ", e)
      }
    }

    checkNFC();
  }, [])

  useEffect(() => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: any) => {
      console.log('tag found: ', tag)
      const firstRecord = tag.ndefMessage[0];
      const byteArray = firstRecord.payload;
      let messageString = String.fromCharCode(...byteArray);
      messageString = messageString.slice(3, messageString.length);
      const message = JSON.parse(messageString);
      
      let present = false;
      cart.forEach((item) => {
        if (item.product_id == message.product_id) {
          present = true;
          return;
        }
      })
      
      if (present) {
        console.log("product present in cart");
      }
      else {
        console.log("product not present in cart");
      }

    })

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [])


  const startScanner = async () => {
    if (!statusRef.current) {
      try {
        console.log("Scanner started")
        setStatus(true)
        await NfcManager.registerTagEvent();
      } catch (error) {
        console.log("Failed to start NFC scanner", error);
      }
    } else {
      console.log("NFC already started")
    }
  }

  const stopScanner = async () => {
    if (statusRef.current) {
      try {
        console.log("Scanner stopped")
        setStatus(false)
        await NfcManager.unregisterTagEvent();
      } catch (error) {
        console.log("Failed to stop NFC scanner", error);
      }
    } else {
      console.log("NFC already stopped")
    }
  }

  return (
    <SafeAreaView style={tw`w-full h-full bg-[#F1F3F5]`}>
      <View>
        {
          (supported) ? (
            <View style={tw`w-full h-full flex flex-col items-center justify-center gap-8`}>
              <TouchableOpacity style={tw`p-4 rounded-xl bg-[#000080]`}
                activeOpacity={0.8}
                onPress={startScanner}>
                <Text style={tw`text-white text-2xl`}>Start Scanner</Text>
              </TouchableOpacity>

              <TouchableOpacity style={tw`p-4 rounded-xl bg-[#000080]`}
                activeOpacity={0.8}
                onPress={stopScanner}>
                <Text style={tw`text-white text-2xl`}>Stop Scanner</Text>
              </TouchableOpacity>
            </View>
          )
            : (
              <View style={tw`w-full h-full flex flex-col items-center justify-center gap-8 p-3`}>
                <Text style={tw`text-xl font-bold`}>NFC is not supported on your device</Text>
              </View>
            )
        }
      </View>
    </SafeAreaView>
  )
}