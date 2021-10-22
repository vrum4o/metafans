import * as React from "react";
import {useEffect, useState} from "react";
import {BarCodeScanner} from "expo-barcode-scanner";
import {StyleSheet, Text, View} from "react-native";

import {GLOBAL_STYLES} from '../../style';

import * as MetaWallet from '../../util/wallet';
import {Button, Input, Overlay} from "react-native-elements";

export default function QRScannerModalScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);
    const [walletPassword, setWalletPassword] = useState('');
    const [code, setCode] = useState('');

    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return (
            <View style={GLOBAL_STYLES.CENTER_CONTAINER}>
                <Text>Requesting for camera permission</Text>
            </View>
        );
    }
    if (hasPermission === false) {
        return (
            <View style={GLOBAL_STYLES.CENTER_CONTAINER}>
                <Text>No access to camera</Text>
            </View>
        );
    }

    const handleBarCodeScanned = async ({type, data}) => {
        setCode(data);
        setScanned(true);
        console.log('qr data is', data);
        if (data.includes("BEGIN EC PRIVATE KEY")) {
            setOverlayVisible(true)
        } else {
            await MetaWallet.saveKey(data);
            navigation.goBack();
        }
    };

    const toggleOverlay = () => {
        setOverlayVisible(!overlayVisible);
    }

    const save = async () => {
        await MetaWallet.saveEncryptedKey(code, walletPassword);
        navigation.goBack();
    }

    return (
        <View style={GLOBAL_STYLES.CENTER_CONTAINER}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            <Overlay isVisible={overlayVisible} onBackdropPress={toggleOverlay}>
                <Text style={{...GLOBAL_STYLES.TITLE, marginBottom: 20}}>Payment info</Text>
                <Input
                    style={{padding: 0}}
                    label={'Wallet Password:'}
                    leftIcon={{type: 'ionicon', name: 'lock-open-outline'}}
                    value={walletPassword}
                    secureTextEntry={true}
                    onChangeText={walletPassword => setWalletPassword(walletPassword)}
                />
                <Button
                    title="Save"
                    type="outline"
                    onPress={save}
                />
            </Overlay>
        </View>
    );
}
