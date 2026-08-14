import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useFocusEffect, useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarRenda } from '../utils/renda';
import { filtrarGastosPorMes, obterAnoMes } from '../utils/periodo';
import SeletorMes from '../components/SeletorMes';
import BarraOrcamento from '../components/BarraOrcamento';
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

const paraListaOrdenada = (agrupado) =>
  Object.entries(agrupado).map(([chave, valor]) => ({ chave, valor })).sort((a, b) => b.valor - a.valor);

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
          setRenda(await buscarRenda());
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
  router.push({ pathname: '/detalhe', params: { tipo, valor, ano, mes } });
  };

  const maiorValor = Math.max(...listaCategorias.map((i) => i.valor), 1);

  const renderRanking = (titulo, lista, tipo) => (
    <View style={styles.secao}>
      <Text style={styles.subtitulo}>{titulo}</Text>
      {lista.length === 0 ? (
        <Text style={styles.vazio}>Nenhum gasto neste mês.</Text>
      ) : (
        lista.map((item, index) => (
          <Pressable key={item.chave} style={styles.linha} onPress={() => irParaDetalhe(tipo, item.chave)}>
            <View style={styles.posicao}>
              <Text style={styles.posicaoTexto}>{index + 1}º</Text>
            </View>
            <Text style={styles.nomeItem} numberOfLines={1}>{item.chave}</Text>
            <View style={styles.barraTrack}>
              <View style={[styles.barraFill, { width: `${(item.valor / maiorValor) * 100}%` }]} />
            </View>
            <Text style={styles.valorItem}>R$ {item.valor.toFixed(0)}</Text>
          </Pressable>
        ))
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Text style={styles.titulo}>Estatísticas</Text>
      <SeletorMes ano={ano} mes={mes} onMudarMes={mudarMes} podeAvancar={podeAvancar} />
      <View style={styles.cardOrcamento}>
        <BarraOrcamento totalGasto={totalDoMes} rendaReferencia={renda} />
      </View>
      {renderRanking('Por Categoria', listaCategorias, 'categoria')}
      {renderRanking('Por Forma de Pagamento', listaPagamentos, 'formaPagamento')}
      <Pressable style={styles.botaoHistorico} onPress={() => router.push('/historico-mensal')}>
        <Text style={styles.botaoHistoricoTexto}>Ver histórico de meses</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: cores.fundo 
  },
  conteudo: { 
    paddingTop: espacamento.xxxl, 
    paddingHorizontal: espacamento.xl, 
    paddingBottom: espacamento.xxxl 
  },
  titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
  cardOrcamento: {
    backgroundColor: cores.superficie,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.lg,
    padding: espacamento.lg,
    marginBottom: espacamento.xl,
  },
  secao: { marginBottom: espacamento.xl },
  subtitulo: { ...tipografia.h2, color: cores.textoPrimario, marginBottom: espacamento.sm },
  vazio: { ...tipografia.body, color: cores.textoSecundario },
  linha: { flexDirection: 'row', alignItems: 'center', gap: espacamento.sm, paddingVertical: espacamento.sm },
  posicao: {
    width: 22, height: 22, borderRadius: raio.sm,
    backgroundColor: cores.primariaClara, alignItems: 'center', justifyContent: 'center',
  },
  posicaoTexto: { fontSize: 11, fontWeight: '700', color: cores.primariaEscura },
  nomeItem: { ...tipografia.body, color: cores.textoPrimario, width: 100 },
  barraTrack: { flex: 1, height: 5, backgroundColor: cores.primariaClara, borderRadius: raio.pill, overflow: 'hidden' },
  barraFill: { height: '100%', backgroundColor: cores.primaria, borderRadius: raio.pill },
  valorItem: { ...tipografia.bodyBold, color: cores.textoPrimario, width: 66, textAlign: 'right' },
  botaoHistorico: {
    borderWidth: 1, borderColor: cores.primaria, borderRadius: raio.sm,
    paddingVertical: espacamento.md, alignItems: 'center', marginTop: espacamento.sm,
  },
  botaoHistoricoTexto: { color: cores.primaria, fontWeight: '700' },
});