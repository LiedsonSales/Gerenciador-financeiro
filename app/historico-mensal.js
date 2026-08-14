import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listarMesesComGastos, filtrarGastosPorMes, labelMes } from '../utils/periodo';
import { cores, espacamento, tipografia, raio } from '../constants/theme';

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
          setMeses(
            listaMeses.map(({ ano, mes }) => {
              const total = filtrarGastosPorMes(gastos, ano, mes).reduce((s, i) => s + i.valor, 0);
              return { ano, mes, total };
            })
          );
        } catch (erro) {
          console.log('Erro ao carregar histórico mensal:', erro);
        }
      };
      carregar();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico Mensal</Text>
      <FlatList
        data={meses}
        keyExtractor={(item) => `${item.ano}-${item.mes}`}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            style={styles.linha}
            onPress={() => router.push({ pathname: '/estatisticas', params: { ano: item.ano, mes: item.mes } })}
          >
            <Text style={styles.nomeMes}>{labelMes(item.ano, item.mes)}</Text>
            <Text style={styles.valorMes}>R$ {item.total.toFixed(2)}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum dado disponível ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingTop: espacamento.xxxl, paddingHorizontal: espacamento.xl },
  titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
  linha: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: espacamento.md, borderBottomWidth: 1, borderBottomColor: cores.borda,
  },
  nomeMes: { ...tipografia.body, color: cores.textoPrimario },
  valorMes: { ...tipografia.bodyBold, color: cores.textoPrimario },
  vazio: { ...tipografia.body, color: cores.textoSecundario, textAlign: 'center', marginTop: espacamento.xl },
});