import { useEffect, useState, useRef } from 'react'
import { View, SafeAreaView, Text, TouchableOpacity } from "react-native";
import tw from 'twrnc';
import NfcManager, { NfcEvents, NfcTech, Ndef } from 'react-native-nfc-manager';
import TcpSocket from 'react-native-tcp-socket';
import { playAudio } from './SoundResponse';

export default function App() {
  const [status, setStatus] = useState<boolean>(false);
  const statusRef = useRef(status);
  const [supported, setSupported] = useState<boolean>(true);
  const [cart, setCart] = useState<{product_id: String}[]>([{product_id: "1"}, {product_id: "2"}]);
  const cartRef = useRef(cart);
  const [messages, setMessages] = useState<string[]>([]);
  const [client, setClient] = useState<TcpSocket.Socket | null>(null);

  useEffect(() => {
    const tcpClient = TcpSocket.createConnection({ port: 8080, host: '192.168.28.149' }, () => {
      console.log('Connected to server');
    });

    tcpClient.on('data', (data) => {
      console.log(data.toString())
      const curr_cart: any[] = JSON.parse(data.toString());
      console.log('Received from server: ', curr_cart);

      // Use functional state update to ensure correct updates
      setCart(curr_cart);
      console.log("Cart after updation : ", cartRef.current)
    },[]);

    // Set the client to state
    setClient(tcpClient);

    // Cleanup on unmount
    return () => {
      tcpClient.destroy();
    };
  }, []);

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
      console.log(message)
      
      verifyItem(message.product_id);

    })

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [])

  const verifyItem = (product_id: string) => {
    let present = false;
      cart.forEach((item) => {
        if (item.product_id == product_id) {
          present = true;
          return;
        }
      })
      
      if (present) {
        playAudio(true);
        console.log("product present in cart");
      }
      else {
        playAudio(false);
        console.log("product not present in cart");
      }
  }


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

  // async function writeNFC() {
  //   try {
  //     await NfcManager.requestTechnology(NfcTech.Ndef);

  //     // Create NDEF message using Ndef helper
  //     const ndefMessage = [
  //       Ndef.textRecord(JSON.stringify({ "product_id": "4" }))
  //     ];

  //     const bytes = Ndef.encodeMessage(ndefMessage);

  //     await NfcManager.ndefHandler.writeNdefMessage(bytes);
  //     console.log('NDEF message written successfully!');
  //   } catch (ex: any) {
  //     console.warn('Error writing NDEF message:', ex);
  //     console.log('Error writing NDEF message', ex.message);
  //   } finally {
  //     await NfcManager.cancelTechnologyRequest();
  //   }
  // }

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

              {/* <TouchableOpacity style={tw`p-4 rounded-xl bg-[#000080]`}
                activeOpacity={0.8}
                onPress={writeNFC}>
                <Text style={tw`text-white text-2xl`}>Write Scanner</Text>
              </TouchableOpacity> */}
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