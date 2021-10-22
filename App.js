import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screens
import Old_HomeScreen from "./screen/home/HomeScreen";
import PaymentScreen from './screen/payment/PaymentScreen';
import QRPaymentScreen from './screen/qrpayment/QRPaymentScreen';

// modals
import QRScannerScreen from './screen/qrscanner/QRScannerScreen';
import QRCode from './screen/qrcode/QRCodeScreen';

import * as Linking from 'expo-linking';
import {useEffect} from "react";

const RootStack = createNativeStackNavigator();

export default function App() {

    const linkCallback = function(url) {
        console.log("callback url: ", url);
        let { path, queryParams } = Linking.parse(url);
        // TODO what to do with this params?
    }

    useEffect(() => {
        Linking.addEventListener('url', (url) => linkCallback(url.url));
        Linking.getInitialURL().then(linkCallback);
    }, []);

    return (
        <NavigationContainer>
            <RootStack.Navigator>
                <RootStack.Group>
                    <RootStack.Screen name="Home" component={Old_HomeScreen}/>
                    <RootStack.Screen name="Payment" component={PaymentScreen}/>
                    <RootStack.Screen name="QRPayment" component={QRPaymentScreen}/>
                </RootStack.Group>
                <RootStack.Group screenOptions={{presentation: 'modal'}}>
                    <RootStack.Screen name="QRScanner" component={QRScannerScreen}/>
                    <RootStack.Screen name="QRCode" component={QRCode}/>
                </RootStack.Group>
            </RootStack.Navigator>
        </NavigationContainer>
    );
}