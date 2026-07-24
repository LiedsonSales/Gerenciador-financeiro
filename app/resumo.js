import { useState, useCallback } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_ARMAZENAMENTO = 'gastos';

const agruparPorCategoria = (gastos) => {
    return gastos.reduce((acumulador, item) => {
        const categoria = item.categoria;

        if (!acumulador[categoria]) {
            acumulador[categoria] = 0;
        } 

        acumulador[categoria] += item.valor;
        return acumulador;
    }, {});
}

export default function Resumo() {
    const [gastos, setGastos] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const carregar = async () => {
                try {
                    const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
                    setGastos(dados ? JSON.parse(dados) : []);
                } catch (erro) {
                    console.log('Erro ao carregar: ', erro);
                }
            };
            carregar();
        }, [])
    );
    
    const total = gastos.reduce((soma, item) => soma + item.valor, 0);
    const totaisPorCategoria = agruparPorCategoria(gastos);
    const listaCategorias = Object.entries(totaisPorCategoria).map(([categoria, valor]) => ({
        categoria,
        valor
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.totalGeral}>Total Geral: R$ {total.toFixed(2)}</Text>
            <Text style={styles.subtitulo}>Por Categoria</Text>
            <FlatList
                data={listaCategorias}
                keyExtractor={(item) => item.categoria}
                renderItem={({item}) => (
                    <View style={styles.linha}>
                        <Text style={styles.categoria}>{item.categoria}</Text>
                        <Text style={styles.valorCategoria}>R$ {item.valor.toFixed(2)}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>Nenhum gasto registrado ainda</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingHorizontal: 20
    },
    totalGeral: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    subtitulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    linha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    categoria: {
        fontSize: 16
    },
    valorCategoria: {
        fontSize: 16,
        fontWeight: 'bold'
    }
    

})