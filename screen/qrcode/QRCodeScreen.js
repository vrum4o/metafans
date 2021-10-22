import {Dimensions, StyleSheet, Text, View} from "react-native";
import * as React from "react";
import {useEffect, useState} from "react";
import QRCode from "react-native-qrcode-svg";
import * as MetaWallet from "../../util/wallet";

import * as Linking from 'expo-linking';
import Constants from "expo-constants";
import {GLOBAL_STYLES} from "../../style";

export default function QRCodeScreen({navigation}) {

    let [qrCode, setQrCode] = useState("");

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    useEffect(() => {
        return navigation.addListener('focus', async () => {
            console.log("QRCode screen is focused");
            const address = await MetaWallet.get_address();
            const scheme = Constants.manifest.scheme;
            let url = Linking.createURL(address, {scheme: scheme, queryParams: {value: 100, message: "Option A"}});
            console.log("====================================================");
            console.log("qr code url  :", url)
            setQrCode(url);
            console.log("====================================================");
        });
    });

    let logo = require('../../assets/metahash_logo_256.png');

    let content = [];

    if (qrCode) {
        content.push(<QRCode
            key={'qr-code'}
            style={{alignContent: "stretch"}}
            value={qrCode}
            size={Math.min(width, height) * 0.8}
            logo={logo}
            logoSize={50}
            logoMargin={10}
            logoBackgroundColor='transparent'/>);
    } else {
        content = <View key={'qr-code-notice'} style={StyleSheet.absoluteFillObject}><Text>Missing code for the QR</Text></View>;
    }

    console.log("rendering");
    return (
        <View style={GLOBAL_STYLES.CENTER_CONTAINER}>
            {content}
        </View>
    );
}