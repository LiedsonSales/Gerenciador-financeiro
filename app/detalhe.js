import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ItemGasto from '../components/ItemGasto';
import { registrarEvento } from '../utils/historico';
import { filtrarGastosPorMes } from '../utils/periodo';
import { espacamento, tipografia } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function Detalhe() {
  const { tipo, valor, ano, mes } = useLocalSearchParams();
  const [gastosFiltrados, setGastosFiltrados] = useState([]);
  const router = useRouter();
  const { cores } = useTema();
  const styles = criarEstilos(cores);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          let todos = dados ? JSON.parse(dados) : [];

          if (ano !== undefined && mes !== undefined) {
            todos = filtrarGastosPorMes(todos, parseInt(ano, 10), parseInt(mes, 10));
          }

          setGastosFiltrados(todos.filter((g) => g[tipo] === valor));
        } catch (erro) {
          console.log('Erro ao carregar detalhe:', erro);
        }
      };
      carregar();
    }, [tipo, valor, ano, mes])
  );

  const confirmarExclusao = (id) => {
    Alert.alert(
      'Excluir gasto',
      'Tem certeza que deseja excluir este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
              const todosCompletos = dados ? JSON.parse(dados) : [];
              const gastoRemovido = todosCompletos.find((g) => g.id === id);
              const novaListaCompleta = todosCompletos.filter((g) => g.id !== id);

              await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaListaCompleta));
              setGastosFiltrados((atual) => atual.filter((g) => g.id !== id));

              if (gastoRemovido) {
                await registrarEvento('removido', gastoRemovido);
              }
            } catch (erro) {
              console.log('Erro ao excluir gasto:', erro);
            }
          },
        },
      ]
    );
  };

  const total = gastosFiltrados.reduce((soma, item) => soma + item.valor, 0);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: valor }} />
      <Text style={styles.titulo}>{valor}</Text>
      <FlatList
        data={gastosFiltrados}
        keyExtractor={(item, index) => item.id ?? index.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ItemGasto
            descricao={item.descricao}
            valor={item.valor}
            categoria={item.categoria}
            formaPagamento={item.formaPagamento}
            dataGasto={item.dataGasto}
            onEditar={() => router.push({ pathname: '/adicionar', params: { id: item.id } })}
            onExcluir={() => confirmarExclusao(item.id)}
          />
        )}
        ListFooterComponent={<Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum gasto encontrado.</Text>}
      />
    </View>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo, paddingTop: espacamento.xxxl, paddingHorizontal: espacamento.xl },
    titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
    total: { ...tipografia.h2, color: cores.textoPrimario, marginTop: espacamento.sm, textAlign: 'right' },
    vazio: { ...tipografia.body, color: cores.textoSecundario, textAlign: 'center', marginTop: espacamento.xl },
  });