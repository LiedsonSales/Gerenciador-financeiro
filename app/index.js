import { useState, useCallback } from 'react';
import { StyleSheet, View, Button, ScrollView } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaGastos from '../components/ListaGastos';
import RendaMensal from '../components/RendaMensal';
import { registrarEvento } from '../utils/historico';

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

  const total = gastos.reduce((soma, item) => soma + item.valor, 0);

  return (
    <View style={styles.container}>
      <RendaMensal />
      <ListaGastos gastos={gastos} total={total} aoExcluir={excluirGasto} />
      <View style={styles.botoes}>
        <Button title="Adicionar Gasto" onPress={() => router.push('/adicionar')} />
        <Button title="Ver Resumo" onPress={() => router.push('/resumo')} />
        <Button title="Ver Estatísticas" onPress={() => router.push('/estatisticas')} />
        <Button title="Ver Histórico" onPress={() => router.push('/historico')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 20 },
  botoes: { gap: 6, marginTop: 10 },
});