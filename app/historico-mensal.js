import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listarMesesComGastos, filtrarGastosPorMes, labelMes } from '../utils/periodo';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function HistoricoMensal() {
  const [meses, setMeses] = useState([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          const gastos = dados ? JSON.parse(dados) : [];
          const listaMeses = listarMesesComGastos(gastos);

          const mesesComTotal = listaMeses.map(({ ano, mes }) => {
            const gastosDoMes = filtrarGastosPorMes(gastos, ano, mes);
            const total = gastosDoMes.reduce((soma, item) => soma + item.valor, 0);
            return { ano, mes, total };
          });

          setMeses(mesesComTotal);
        } catch (erro) {
          console.log('Erro ao carregar histórico mensal:', erro);
        }
      };
      carregar();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={meses}
        keyExtractor={(item) => `${item.ano}-${item.mes}`}
        renderItem={({ item }) => (
          <Pressable
            style={styles.linha}
            onPress={() => router.push({ pathname: '/estatisticas', params: { ano: item.ano, mes: item.mes } })}
          >
            <Text style={styles.nomeMes}>{labelMes(item.ano, item.mes)}</Text>
            <Text style={styles.valorMes}>R$ {item.total.toFixed(2)}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>Nenhum dado disponível ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 20 },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nomeMes: { fontSize: 16 },
  valorMes: { fontSize: 16, fontWeight: 'bold' },
});