import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useFocusEffect, useLocalSearchParams, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemGasto from '../components/ItemGasto';
import { cores, espacamento, tipografia } from '../constants/theme';

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
          setGastosFiltrados(todos.filter((g) => g[tipo] === valor));
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
      <Text style={styles.titulo}>{valor}</Text>
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
        ListFooterComponent={<Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum gasto encontrado.</Text>}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingTop: espacamento.xxl, paddingHorizontal: espacamento.xl },
  titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
  total: { ...tipografia.h2, color: cores.textoPrimario, marginTop: espacamento.sm, textAlign: 'right' },
  vazio: { ...tipografia.body, color: cores.textoSecundario, textAlign: 'center', marginTop: espacamento.xl },
});