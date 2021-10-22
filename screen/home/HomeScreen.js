import React, {useEffect, useState} from "react";
import {Button, FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import * as MetaWallet from "../../util/wallet";
import {GLOBAL_STYLES} from "../../style";

export default function HomeScreen({navigation}) {

    const [balance, setBalance] = useState(0);
    const [refreshing, setRefreshing] = useState(true);
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log("HomeScreen: in useEffect)");
        fetchHistory()
    }, []);

    function fetchHistory() {
        MetaWallet.get_my_history()
            .then(history => {
                let modified_history = history.filter(function (h) {
                    return h.type !== 'forging'
                });
                setData(modified_history);
            })
            .catch(e => {
                console.error("Cannot get my history: ", e);
            })
            .finally(() => {
                setRefreshing(false);
            })

    }

    // ItemSeparator = () => <View style={styles.separator}/>

    const renderItemComponent = (data) => {
        let item = data.item;
        return (<HistoryItemMemo item={item}/>)
    }

    const HistoryItem = (props) => {
        return <TouchableOpacity style={styles.container}>
            <Text>{props.item.status}</Text>
            <Text>{props.item.timestamp}</Text>
            <Text>{props.item.from}</Text>
            <Text>{props.item.to}</Text>
            <Text>{props.item.type}</Text>
            <Text>{props.item.value}</Text>
            <Text>{props.item.fee}</Text>
        </TouchableOpacity>
    }
    const HistoryItemMemo = React.memo(HistoryItem);

    const handleRefresh = () => {
        this.setState({refreshing: false}, () => {
            this.fetchHistory()
        });
    }

    const header = (
        <View style={GLOBAL_STYLES.HOME_CONTAINER}>
            <Text style={GLOBAL_STYLES.TITLE}>This is the home screen!</Text>
            <Button onPress={() => navigation.navigate('QRScanner')} title="Scan wallet"/>
            <Button onPress={() => navigation.navigate('QRCode')} title="See wallet"/>
            <Button onPress={() => navigation.navigate('Payment')} title="Pay"/>
            <Button onPress={() => navigation.navigate('QRPayment')} title="Pay with qr"/>
            <Text>Balance: {balance}</Text>
            <Text style={{...GLOBAL_STYLES.TITLE, marginTop: 30, marginBottom: 0}}>Wallet Transactions:</Text>
        </View>
    )

    return (
        <View style={StyleSheet.absoluteFillObject}>
            <FlatList
                data={data}
                renderItem={renderItemComponent}
                keyExtractor={item => item.transaction}
                ListHeaderComponent={header}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                windowSize={11}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
    },
    separator: {
        height: 2,
        backgroundColor: "rgba(0,0,0,0.5)",
        marginLeft: 10,
        marginRight: 10,
    }
});