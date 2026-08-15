import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { listarMesesComGastos, filtrarGastosPorMes, labelMes, obterAnoMes } from '../utils/periodo';
import { cores, espacamento, tipografia, raio, sombra } from '../constants/theme';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function HistoricoMensal() {
  const [meses, setMeses] = useState([]);
  const router = useRouter();
  const atual = obterAnoMes(Date.now());

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          const gastos = dados ? JSON.parse(dados) : [];
          const listaMeses = listarMesesComGastos(gastos);

          setMeses(
            listaMeses.map(({ ano, mes }) => {
              const gastosDoMes = filtrarGastosPorMes(gastos, ano, mes);
              const total = gastosDoMes.reduce((soma, item) => soma + item.valor, 0);
              return { ano, mes, total, quantidade: gastosDoMes.length };
            })
          );
        } catch (erro) {
          console.log('Erro ao carregar histórico mensal:', erro);
        }
      };
      carregar();
    }, [])
  );

  const maiorTotal = Math.max(...meses.map((m) => m.total), 1);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico Mensal</Text>
      <FlatList
        data={meses}
        keyExtractor={(item) => `${item.ano}-${item.mes}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => {
          const ehMesAtual = item.ano === atual.ano && item.mes === atual.mes;
          const proporcao = item.total / maiorTotal;

          return (
            <Pressable
              style={[styles.card, sombra, ehMesAtual && styles.cardAtual]}
              onPress={() => router.push({ pathname: '/estatisticas', params: { ano: item.ano, mes: item.mes } })}
            >
              <View style={[styles.iconeContainer, ehMesAtual && styles.iconeContainerAtual]}>
                <Ionicons
                  name="calendar"
                  size={18}
                  color={ehMesAtual ? cores.branco : cores.primaria}
                />
              </View>

              <View style={styles.info}>
                <View style={styles.linhaTopo}>
                  <Text style={[styles.nomeMes, ehMesAtual && styles.nomeMesAtual]}>
                    {labelMes(item.ano, item.mes)}
                  </Text>
                </View>
                <Text style={[styles.quantidade, ehMesAtual && styles.quantidadeAtual]}>
                  {item.quantidade} {item.quantidade === 1 ? 'gasto' : 'gastos'}
                </Text>
                <View style={styles.barraTrack}>
                  <View
                    style={[
                      styles.barraFill,
                      { width: `${Math.max(proporcao * 100, 4)}%` },
                      ehMesAtual && styles.barraFillAtual,
                    ]}
                  />
                </View>
              </View>

              <View style={styles.valorContainer}>
                <Text style={[styles.valorMes, ehMesAtual && styles.valorMesAtual]}>
                  R$ {item.total.toFixed(2)}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={ehMesAtual ? 'rgba(255,255,255,0.8)' : cores.textoTerciario}
                />
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum dado disponível ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingTop: espacamento.xxxl, paddingHorizontal: espacamento.xl },
  titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
  lista: { paddingBottom: espacamento.xl },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacamento.md,
    marginBottom: espacamento.sm,
    gap: espacamento.md,
  },
  cardAtual: {
    backgroundColor: cores.primaria,
    borderColor: cores.primaria,
  },

  iconeContainer: {
    width: 38,
    height: 38,
    borderRadius: raio.md,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconeContainerAtual: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  info: { flex: 1, minWidth: 0 },
  linhaTopo: { flexDirection: 'row', alignItems: 'center' },
  nomeMes: { ...tipografia.bodyBold, color: cores.textoPrimario },
  nomeMesAtual: { color: cores.branco },
  quantidade: { ...tipografia.caption, color: cores.textoSecundario, marginTop: 1, marginBottom: espacamento.xs },
  quantidadeAtual: { color: 'rgba(255,255,255,0.85)' },

  barraTrack: {
    height: 4,
    backgroundColor: cores.primariaClara,
    borderRadius: raio.pill,
    overflow: 'hidden',
  },
  barraFill: {
    height: '100%',
    backgroundColor: cores.primaria,
    borderRadius: raio.pill,
  },
  barraFillAtual: {
    backgroundColor: cores.branco,
  },

  valorContainer: { alignItems: 'flex-end', gap: 2 },
  valorMes: { ...tipografia.bodyBold, color: cores.textoPrimario },
  valorMesAtual: { color: cores.branco },

  vazio: { ...tipografia.body, color: cores.textoSecundario, textAlign: 'center', marginTop: espacamento.xl },
});