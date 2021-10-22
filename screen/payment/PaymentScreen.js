import {Text, View} from "react-native";
import * as React from "react";
import {useState} from "react";
import {Button, Input} from "react-native-elements";
import {GLOBAL_STYLES} from "../../style";
import * as MetaWallet from "../../util/wallet";

export default function PaymentScreen({route, navigation}) {

    let initialAddressTo = route.params && route.params.to ? route.params.to : "";
    let initialValue = route.params && route.params.value ? route.params.value : "100";
    let initialMessage = route.params && route.params.message ? route.params.message : "";

    const [addressTo, setAddressTo] = useState(initialAddressTo)
    const [value, setValue] = useState(initialValue)
    const [message, setMessage] = useState(initialMessage)
    const [loading, setLoading] = useState(false)


    const send = async function() {
        console.log('sending', addressTo, value, message);
        setLoading(true);
        try {
            let result = await MetaWallet.send_mhc_to(addressTo, value, message)
            console.log('tx result', result);
            if (result) {
                // TODO check inside result to have a better if here
                alert('Tx send successfully!');
            }
        } catch (e) {
            console.log("Cannot send tx:", e)
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={{padding:10}}>
            <Text style={{...GLOBAL_STYLES.TITLE, marginBottom: 20}}>Payment info</Text>
            <Input
                style={{padding: 0}}
                label={'Send MHC To:'}
                placeholder='0x01234567890042deadbeef'
                leftIcon={{type: 'ionicon', name: 'wallet-outline'}}
                value={addressTo}
                onChangeText={addressTo => setAddressTo(addressTo)}
            />
            <Input
                label={'Amount of MHC to send:'}
                placeholder='100'
                leftIcon={{type: 'material', name: 'attach-money'}}
                value={value}
                onChangeText={value => setValue(value.replace(/[^0-9,.]/g, ''))}
            />
            <Input
                label={'Message:'}
                placeholder="..."
                leftIcon={{type: 'font-awesome', name: 'commenting-o'}}
                value={message}
                onChangeText={message => setMessage(message)}
            />
            <Button
                title="SEND"
                type="outline"
                onPress={send}
                loading={loading}
            />


        </View>
    );
}