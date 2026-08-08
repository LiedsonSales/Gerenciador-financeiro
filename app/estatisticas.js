import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarRenda } from '../utils/renda';
import { filtrarGastosPorMes, obterAnoMes } from '../utils/periodo';
import SeletorMes from '../components/SeletorMes';
import BarraOrcamento from '../components/BarraOrcamento';

const CHAVE_ARMAZENAMENTO = 'gastos';

const agruparPorCampo = (gastos, campo) => {
  return gastos.reduce((acumulador, item) => {
    const chave = item[campo] || 'Não informado';
    if (!acumulador[chave]) acumulador[chave] = 0;
    acumulador[chave] += item.valor;
    return acumulador;
  }, {});
};

const paraListaOrdenada = (agrupado) =>
  Object.entries(agrupado)
    .map(([chave, valor]) => ({ chave, valor }))
    .sort((a, b) => b.valor - a.valor);

export default function Estatisticas() {
  const params = useLocalSearchParams();
  const atual = obterAnoMes(Date.now());

  const [ano, setAno] = useState(params.ano ? parseInt(params.ano, 10) : atual.ano);
  const [mes, setMes] = useState(params.mes !== undefined ? parseInt(params.mes, 10) : atual.mes);
  const [todosGastos, setTodosGastos] = useState([]);
  const [renda, setRenda] = useState(0);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
          setTodosGastos(dados ? JSON.parse(dados) : []);
          const valorRenda = await buscarRenda();
          setRenda(valorRenda);
        } catch (erro) {
          console.log('Erro ao carregar estatísticas:', erro);
        }
      };
      carregar();
    }, [])
  );

  const mudarMes = (delta) => {
    let novoMes = mes + delta;
    let novoAno = ano;
    if (novoMes > 11) { novoMes = 0; novoAno += 1; }
    if (novoMes < 0) { novoMes = 11; novoAno -= 1; }
    setMes(novoMes);
    setAno(novoAno);
  };

  const podeAvancar = ano < atual.ano || (ano === atual.ano && mes < atual.mes);

  const gastosDoMes = filtrarGastosPorMes(todosGastos, ano, mes);
  const totalDoMes = gastosDoMes.reduce((soma, item) => soma + item.valor, 0);

  const listaCategorias = paraListaOrdenada(agruparPorCampo(gastosDoMes, 'categoria'));
  const listaPagamentos = paraListaOrdenada(agruparPorCampo(gastosDoMes, 'formaPagamento'));

  const irParaDetalhe = (tipo, valor) => {
    router.push({ pathname: '/detalhe', params: { tipo, valor } });
  };

  const renderRanking = (titulo, lista, tipo) => (
    <View style={styles.secao}>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {lista.length === 0 ? (
        <Text style={styles.vazio}>Nenhum gasto neste mês.</Text>
      ) : (
        lista.map((item, index) => (
          <Pressable key={item.chave} style={styles.linha} onPress={() => irParaDetalhe(tipo, item.chave)}>
            <Text style={styles.posicao}>{index + 1}º</Text>
            <Text style={styles.nomeItem}>{item.chave}</Text>
            <Text style={styles.valorItem}>R$ {item.valor.toFixed(2)}</Text>
          </Pressable>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <SeletorMes ano={ano} mes={mes} onMudarMes={mudarMes} podeAvancar={podeAvancar} />
      <BarraOrcamento totalGasto={totalDoMes} rendaReferencia={renda} />
      {renderRanking('Por Categoria', listaCategorias, 'categoria')}
      {renderRanking('Por Forma de Pagamento', listaPagamentos, 'formaPagamento')}
      <Pressable style={styles.botaoHistorico} onPress={() => router.push('/historico-mensal')}>
        <Text style={styles.botaoHistoricoTexto}>Ver histórico de meses</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  conteudo: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 40 },
  secao: { marginBottom: 20 },
  subtitulo: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  vazio: { color: '#888' },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  posicao: { fontSize: 14, color: '#888', width: 24 },
  nomeItem: { fontSize: 16, flex: 1 },
  valorItem: { fontSize: 16, fontWeight: 'bold' },
  botaoHistorico: {
    marginTop: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#4a90d9',
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoHistoricoTexto: { color: '#4a90d9', fontWeight: 'bold' },
});