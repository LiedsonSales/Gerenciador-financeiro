import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FormularioGasto from '../components/formularioGasto';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function adicionar() {
    const router = useRouter();
    
    const adicionarGasto = async (novoGasto) => {
        try {
            const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
            const gastosAtuais = dados ? JSON.parse(dados) : [];
            const novaLista = [...gastosAtuais, novoGasto];
            await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaLista));
            router.back(); 
        } catch (erro) {
            console.log('Erro ao salvar gasto:', erro);
        }
    };

    return (
        <View style={styles.conatiner}>
            <FormularioGasto aoAdicionar={adicionarGasto}/>
        </View>
    )
}

const styles = StyleSheet.create({
    conatiner: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
});