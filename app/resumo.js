import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ARMAZENAMENTO = 'gastos';

const agruparPorCampo = (gastos, campo) => {
  return gastos.reduce((acumulador, item) => {
    const chave = item[campo] || 'Não informado';
    if (!acumulador[chave]) {
      acumulador[chave] = 0;
    }
    acumulador[chave] += item.valor;
    return acumulador;
  }, {});
};

const paraLista = (agrupado) =>
  Object.entries(agrupado).map(([chave, valor]) => ({ chave, valor }));

export default function Resumo() {
  const [gastos, setGastos] = useState([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          setGastos(dados ? JSON.parse(dados) : []);
        } catch (erro) {
          console.log('Erro ao carregar:', erro);
        }
      };
      carregar();
    }, [])
  );

  const total = gastos.reduce((soma, item) => soma + item.valor, 0);
  const listaCategorias = paraLista(agruparPorCampo(gastos, 'categoria'));
  const listaPagamentos = paraLista(agruparPorCampo(gastos, 'formaPagamento'));

  const irParaDetalhe = (tipo, valor) => {
    router.push({ pathname: '/detalhe', params: { tipo, valor } });
  };

  const renderSecao = (titulo, lista, tipo) => (
    <>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {lista.length === 0 ? (
        <Text style={styles.vazio}>Nenhum gasto registrado ainda.</Text>
      ) : (
        lista.map((item) => (
          <Pressable
            key={item.chave}
            style={styles.linha}
            onPress={() => irParaDetalhe(tipo, item.chave)}
          >
            <Text style={styles.nomeItem}>{item.chave}</Text>
            <Text style={styles.valorItem}>R$ {item.valor.toFixed(2)}</Text>
          </Pressable>
        ))
      )}
    </>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.totalGeral}>Total Geral: R$ {total.toFixed(2)}</Text>
      {renderSecao('Por Categoria', listaCategorias, 'categoria')}
      {renderSecao('Por Forma de Pagamento', listaPagamentos, 'formaPagamento')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  conteudo: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40 },
  totalGeral: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  vazio: { color: '#888' },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  nomeItem: { fontSize: 16 },
  valorItem: { fontSize: 16, fontWeight: 'bold' },
});