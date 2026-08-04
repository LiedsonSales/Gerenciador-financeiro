import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_ARMAZENAMENTO = 'gastos';

export const buscarCategoriasExistentes = async () => {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
    const gastos = dados ? JSON.parse(dados) : [];

    const categorias = gastos
      .map((g) => g.categoria)
      .filter((categoria) => categoria && categoria.trim() !== '');

    const categoriasUnicas = [...new Set(categorias)];

    return categoriasUnicas.sort((a, b) => a.localeCompare(b));
  } catch (erro) {
    console.log('Erro ao buscar categorias:', erro);
    return [];
  }
};