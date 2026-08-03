import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_HISTORICO = 'historico';

export const registrarEvento = async (tipo, gasto) => {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_HISTORICO);
    const historicoAtual = dados ? JSON.parse(dados) : [];

    const evento = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      tipo,
      descricao: gasto.descricao,
      valor: gasto.valor,
      categoria: gasto.categoria,
      dataEvento: Date.now(),
    };

    const novoHistorico = [...historicoAtual, evento];
    await AsyncStorage.setItem(CHAVE_HISTORICO, JSON.stringify(novoHistorico));
  } catch (erro) {
    console.log('Erro ao registrar histórico:', erro);
  }
};

export const carregarHistorico = async () => {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_HISTORICO);
    return dados ? JSON.parse(dados) : [];
  } catch (erro) {
    console.log('Erro ao carregar histórico:', erro);
    return [];
  }
};