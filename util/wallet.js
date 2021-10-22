import {API, Wallet} from "metahash-js/dist/metahash"

import * as Storage from "./storage";
import {MH_CENTS} from "./const";

export async function saveKey(data) {
    await Storage.set("metahash.private_key", data);
}

export async function saveEncryptedKey(key, password) {
    console.log('in saveEncryptedKey', key, password);
    const wallet = Wallet.fromEncryptedPEM(key, password);
    console.log("============================================================");
    console.log("address:       ", wallet.address);
    console.log("privateKey:    ", wallet.privateKey);
    console.log("privateKeyRaw: ", wallet.privateKeyRaw);
    console.log("============================================================");
    await Storage.set("metahash.private_key", wallet.privateKey);
}

export async function get_address() {
    try {
        const wallet = await get_wallet();
        return wallet.address;
    } catch (e) {
        console.error("Cannot open wallet: ", e);
    }
    return null;
}

async function get_wallet() {
    let private_key = await Storage.get("metahash.private_key")
    try {
        return Wallet.fromPrivateKey(private_key);
    } catch (e) {
        console.error("Cannot open wallet: ", e);
    }
    return null;
}
export async function get_balance(address) {
    const api = new API();
    const balanceResult = await api.fetchBalance({address: address});
    return ((balanceResult.received - balanceResult.spent) / MH_CENTS).toFixed(3);
}

export async function get_history(address) {
    const api = new API();
    return api.fetchHistory({address: address});
}

export async function get_my_history() {
    const api = new API();
    const address = await get_address();
    return api.fetchHistory({address: address});
}

export async function send_mhc_to(to, amount, message) {
    let wallet = await get_wallet()
    const api = new API();

    const nonce = await api.getNonce({address: to});
    const value = amount * MH_CENTS;
    const fee = 1;
    const data = message || "";

    const tx = wallet.createTx({to, value, fee, nonce, data});

    return await api.sendTx(tx);
}