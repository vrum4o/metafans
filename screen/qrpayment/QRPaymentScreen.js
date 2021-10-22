import * as React from "react";
import {useEffect, useState} from "react";
import {BarCodeScanner} from "expo-barcode-scanner";
import {StyleSheet, Text, View} from "react-native";

import {GLOBAL_STYLES} from '../../style';
import * as Linking from "expo-linking";

export default function QRPaymentScreen({navigation}) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

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
        setScanned(true);

        let {path, queryParams} = Linking.parse(data);

        navigation.replace("Payment", {to: path, ...queryParams});
    };

    return (
        <View style={GLOBAL_STYLES.CENTER_CONTAINER}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    );
}
