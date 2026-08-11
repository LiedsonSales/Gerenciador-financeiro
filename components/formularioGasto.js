import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import SeletorPagamento from './SeletorPagamento';
import SeletorData from './SeletorData';
import SeletorCategoria from './SeletorCategoria';
import { buscarCategoriasExistentes } from '../utils/categorias';
import { cores, espacamento, tipografia, raio, sombra } from '../constants/theme';

const FormularioGasto = ({ aoSalvar, gastoInicial, textoBotao = 'Adicionar Gasto' }) => {
  const [descricaoTexto, setDescricaoTexto] = useState('');
  const [valorTexto, setValorTexto] = useState('');
  const [categoriaTexto, setCategoriaTexto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  const [dataGasto, setDataGasto] = useState(Date.now());
  const [categoriasExistentes, setCategoriasExistentes] = useState([]);

  useEffect(() => {
    const carregarCategorias = async () => {
      const categorias = await buscarCategoriasExistentes();
      setCategoriasExistentes(categorias);
    };
    carregarCategorias();
  }, []);

  useEffect(() => {
    if (gastoInicial) {
      setDescricaoTexto(gastoInicial.descricao);
      setValorTexto(String(gastoInicial.valor));
      setCategoriaTexto(gastoInicial.categoria);
      setFormaPagamento(gastoInicial.formaPagamento || 'Dinheiro');
      setDataGasto(gastoInicial.dataGasto || Date.now());
    }
  }, [gastoInicial]);

  const handleSalvar = () => {
    const valorNumero = parseFloat(valorTexto) || 0;
    const categoriaLimpa = categoriaTexto.trim();

    if (descricaoTexto.trim() === '' || categoriaLimpa === '' || valorNumero <= 0) return;

    aoSalvar({
      descricao: descricaoTexto.trim(),
      valor: valorNumero,
      categoria: categoriaLimpa,
      formaPagamento,
      dataGasto,
    });

    if (!gastoInicial) {
      setDescricaoTexto('');
      setValorTexto('');
      setCategoriaTexto('');
      setFormaPagamento('Dinheiro');
      setDataGasto(Date.now());
    }
  };

  return (
    <View>
      <Text style={styles.label}>Descrição</Text>
      <TextInput style={styles.input} placeholder="Ex: Lanche" placeholderTextColor={cores.textoTerciario} value={descricaoTexto} onChangeText={setDescricaoTexto} />

      <Text style={styles.label}>Valor</Text>
      <TextInput style={styles.input} placeholder="0,00" placeholderTextColor={cores.textoTerciario} value={valorTexto} onChangeText={setValorTexto} keyboardType="numeric" />

      <Text style={styles.label}>Categoria</Text>
      <TextInput style={styles.input} placeholder="Ex: Alimentação" placeholderTextColor={cores.textoTerciario} value={categoriaTexto} onChangeText={setCategoriaTexto} />

      <SeletorCategoria categorias={categoriasExistentes} valorSelecionado={categoriaTexto} onSelecionar={setCategoriaTexto} />
      <SeletorPagamento valorSelecionado={formaPagamento} onSelecionar={setFormaPagamento} />
      <SeletorData dataSelecionada={dataGasto} onSelecionar={setDataGasto} />

      <Pressable style={[styles.botaoSalvar, sombra]} onPress={handleSalvar}>
        <Text style={styles.botaoSalvarTexto}>{textoBotao}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  label: { ...tipografia.caption, color: cores.textoTerciario, marginTop: espacamento.md, marginBottom: espacamento.xs },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.sm,
    padding: espacamento.md,
    backgroundColor: cores.superficie,
    fontSize: 15,
    color: cores.textoPrimario,
  },
  botaoSalvar: {
    backgroundColor: cores.primaria,
    borderRadius: raio.sm,
    paddingVertical: espacamento.md,
    alignItems: 'center',
    marginTop: espacamento.xl,
  },
  botaoSalvarTexto: { color: cores.branco, fontWeight: '700', fontSize: 15 },
});

export default FormularioGasto;