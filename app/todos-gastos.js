import { useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaGastosAgrupada from '../components/ListaGastosAgrupada';
import { registrarEvento } from '../utils/historico';
import { agruparGastosPorMes } from '../utils/periodo';
import { espacamento, tipografia } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function TodosGastos() {
  const [gastos, setGastos] = useState([]);
  const router = useRouter();
  const { cores } = useTema();
  const styles = criarEstilos(cores);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          setGastos(dados ? JSON.parse(dados) : []);
        } catch (erro) {
          console.log('Erro ao carregar todos os gastos:', erro);
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

  const secoesPorMes = agruparGastosPorMes(gastos);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Todos os Gastos</Text>
      <ListaGastosAgrupada
        secoes={secoesPorMes}
        onEditar={(id) => router.push({ pathname: '/adicionar', params: { id } })}
        onExcluir={excluirGasto}
        textoVazio="Nenhum gasto registrado ainda."
      />
    </View>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo, paddingTop: espacamento.xxxl, paddingHorizontal: espacamento.xl },
    titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
  });