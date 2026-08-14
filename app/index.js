import { useState, useCallback } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaGastosAgrupada from '../components/ListaGastosAgrupada';
import RendaMensal from '../components/RendaMensal';
import BotaoIcone from '../components/BotaoIcone';
import { registrarEvento } from '../utils/historico';
import { filtrarGastosRecentes, filtrarGastosPorMes, obterAnoMes } from '../utils/periodo';
import { cores, espacamento, tipografia } from '../constants/theme';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function Index() {
  const [gastos, setGastos] = useState([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          let lista = dados ? JSON.parse(dados) : [];

          const precisaMigrar = lista.some((g) => !g.id);
          if (precisaMigrar) {
            lista = lista.map((g) =>
              g.id ? g : { ...g, id: Date.now().toString() + Math.random().toString(36).slice(2) }
            );
            await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(lista));
          }

          setGastos(lista);
        } catch (erro) {
          console.log('Erro ao carregar:', erro);
        }
      };
      carregar();
    }, [])
  );

  const excluirGasto = async (id) => {
    const gastoRemovido = gastos.find((g) => g.id === id);
    const novaLista = gastos.filter((g) => g.id !== id);
    setGastos(novaLista);
    await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaLista));
    if (gastoRemovido) {
      await registrarEvento('removido', gastoRemovido);
    }
  };

  const { ano, mes } = obterAnoMes(Date.now());
  const gastosDoMesAtual = filtrarGastosPorMes(gastos, ano, mes);
  const totalDoMes = gastosDoMesAtual.reduce((soma, item) => soma + item.valor, 0);

  const secoesRecentes = filtrarGastosRecentes(gastos);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Meus Gastos</Text>
        <Pressable style={styles.fab} onPress={() => router.push('/adicionar')} hitSlop={8}>
          <Ionicons name="add" size={22} color={cores.branco} />
        </Pressable>
      </View>

      <RendaMensal totalGasto={totalDoMes} onPress={() => router.push('/estatisticas')} />

      <View style={styles.botoesRapidos}>
        <BotaoIcone icone="pie-chart" onPress={() => router.push('/resumo')} />
        <BotaoIcone icone="albums" onPress={() => router.push('/todos-gastos')} />
        <BotaoIcone icone="time" onPress={() => router.push('/historico')} />
      </View>

      <ListaGastosAgrupada
        secoes={secoesRecentes}
        apenasHora
        onEditar={(id) => router.push({ pathname: '/adicionar', params: { id } })}
        onExcluir={excluirGasto}
        textoVazio="Nenhum gasto hoje ou ontem."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingHorizontal: espacamento.xl },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: espacamento.xxxl,
    marginBottom: espacamento.lg,
  },
  titulo: { ...tipografia.h1, color: cores.textoPrimario, letterSpacing: -0.4 },
  fab: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: cores.primaria,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: cores.primaria, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  botoesRapidos: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: espacamento.xl,
    marginBottom: espacamento.lg,
  },
});