import { useEffect, useState } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaGastos from '../components/ListaGastos';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function index() {
    const [gastos, setGastos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const carregar = async () => {
            try {
                const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
                setGastos(dados ? JSON.parse(dados) : []);
            } catch (erro) {
                console.log('Erro ao carregar:', erro);
            } finally {
                setCarregando(false);
            }
        };
        carregar();
    }, []);

    const total = gastos.reduce((soma, item) => soma + item.valor, 0);

    return (
        <View style={styles.container}>
            <ListaGastos gastos={gastos} total={total}/>
            <Button
                title='Adicionar gasto'
                onPress={() => router.push('/adicionar')}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 20,
    }
})