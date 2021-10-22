import * as SecureStore from "expo-secure-store";

export async function set(key, value) {
    await SecureStore.setItemAsync(key, value);
}

export async function get(key) {
    return await SecureStore.getItemAsync(key);
}

export async function remove(key) {
    await SecureStore.deleteItemAsync(key)
}
