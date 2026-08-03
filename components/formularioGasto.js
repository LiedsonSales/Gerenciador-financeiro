import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import SeletorPagamento from './SeletorPagamento';
import SeletorData from './SeletorData';

const FormularioGasto = ({ aoSalvar, gastoInicial, textoBotao = 'Adicionar Gasto' }) => {
  const [descricaoTexto, setDescricaoTexto] = useState('');
  const [valorTexto, setValorTexto] = useState('');
  const [categoriaTexto, setCategoriaTexto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  const [dataGasto, setDataGasto] = useState(Date.now());

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

    if (descricaoTexto.trim() === '' || categoriaTexto.trim() === '' || valorNumero <= 0) {
      return;
    }

    aoSalvar({
      descricao: descricaoTexto.trim(),
      valor: valorNumero,
      categoria: categoriaTexto.trim(),
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
      <TextInput style={styles.input} placeholder="Descrição" value={descricaoTexto} onChangeText={setDescricaoTexto} />
      <TextInput style={styles.input} placeholder="Valor" value={valorTexto} onChangeText={setValorTexto} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Categoria" value={categoriaTexto} onChangeText={setCategoriaTexto} />
      <SeletorPagamento valorSelecionado={formaPagamento} onSelecionar={setFormaPagamento} />
      <SeletorData dataSelecionada={dataGasto} onSelecionar={setDataGasto} />
      <View style={{ marginTop: 16 }}>
        <Button title={textoBotao} onPress={handleSalvar} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginTop: 10,
  },
});

export default FormularioGasto;