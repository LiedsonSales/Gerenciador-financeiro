import AsyncStorage from "@react-native-async-storage/async-storage";
import { parse } from "expo-linking";

const CHAVE_RENDA = 'rendaMesal';

export const buscarRenda= async () => {
    try {
        const valor = await AsyncStorage.getItem(CHAVE_RENDA);
        return valor ? parseFloat(valor) : 0;
    } catch (erro) {
        console.log('Erro ao buscar renda:', erro);
        return 0;
    }
};

export const salvarRenda = async (valor) => {
    try {
        await AsyncStorage.setItem(CHAVE_RENDA, String(valor));
    } catch (erro) {
        console.log('Erro ao salvar renda:', erro);
    }
};