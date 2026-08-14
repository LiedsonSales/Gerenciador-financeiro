import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { cores, espacamento, tipografia, raio } from '../constants/theme';

const CHAVE_ARMAZENAMENTO = 'gastos';

const agruparPorCampo = (gastos, campo) => {
  return gastos.reduce((acumulador, item) => {
    const chave = item[campo] || 'Não informado';
    if (!acumulador[chave]) acumulador[chave] = 0;
    acumulador[chave] += item.valor;
    return acumulador;
  }, {});
};

const paraLista = (agrupado) => Object.entries(agrupado).map(([chave, valor]) => ({ chave, valor }));

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
    <View style={styles.secao}>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {lista.length === 0 ? (
        <Text style={styles.vazio}>Nenhum gasto registrado ainda.</Text>
      ) : (
        lista.map((item) => (
          <Pressable key={item.chave} style={styles.linha} onPress={() => irParaDetalhe(tipo, item.chave)}>
            <Text style={styles.nomeItem}>{item.chave}</Text>
            <Text style={styles.valorItem}>R$ {item.valor.toFixed(2)}</Text>
          </Pressable>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Resumo</Text>
      <View style={styles.cardTotal}>
        <Text style={styles.totalLabel}>Total geral</Text>
        <Text style={styles.totalValor}>R$ {total.toFixed(2)}</Text>
      </View>
      {renderSecao('Por Categoria', listaCategorias, 'categoria')}
      {renderSecao('Por Forma de Pagamento', listaPagamentos, 'formaPagamento')}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { 
    paddingTop: espacamento.xxxl, 
    paddingHorizontal: espacamento.xl, 
    paddingBottom: espacamento.xxxl 
  },
  titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
  cardTotal: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.lg,
    padding: espacamento.lg,
    marginBottom: espacamento.xl,
  },
  totalLabel: { ...tipografia.caption, color: cores.textoSecundario },
  totalValor: { ...tipografia.h1, color: cores.primaria, marginTop: 2 },
  secao: { marginBottom: espacamento.xl },
  subtitulo: { ...tipografia.h2, color: cores.textoPrimario, marginBottom: espacamento.sm },
  vazio: { ...tipografia.body, color: cores.textoSecundario },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: espacamento.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  nomeItem: { ...tipografia.body, color: cores.textoPrimario },
  valorItem: { ...tipografia.bodyBold, color: cores.textoPrimario },
});