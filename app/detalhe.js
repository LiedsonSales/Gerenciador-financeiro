import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useFocusEffect, useLocalSearchParams, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemGasto from '../components/ItemGasto';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function Detalhe() {
  const { tipo, valor } = useLocalSearchParams();
  const [gastosFiltrados, setGastosFiltrados] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          const todos = dados ? JSON.parse(dados) : [];
          const filtrados = todos.filter((g) => g[tipo] === valor);
          setGastosFiltrados(filtrados);
        } catch (erro) {
          console.log('Erro ao carregar detalhe:', erro);
        }
      };
      carregar();
    }, [tipo, valor])
  );

  const total = gastosFiltrados.reduce((soma, item) => soma + item.valor, 0);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: valor }} />
      <FlatList
        data={gastosFiltrados}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        renderItem={({ item }) => (
          <ItemGasto
            descricao={item.descricao}
            valor={item.valor}
            categoria={item.categoria}
            formaPagamento={item.formaPagamento}
            dataGasto={item.dataGasto}
          />
        )}
        ListHeaderComponent={<Text style={styles.titulo}>{valor}</Text>}
        ListFooterComponent={<Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>}
        ListEmptyComponent={<Text>Nenhum gasto encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  total: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
});