import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const FormularioGasto = ({ aoSalvar, gastoInicial, textoBotao = 'Adicionar Gasto' }) => {
  const [descricaoTexto, setDescricaoTexto] = useState('');
  const [valorTexto, setValorTexto] = useState('');
  const [categoriaTexto, setCategoriaTexto] = useState('');

  useEffect(() => {
    if (gastoInicial) {
      setDescricaoTexto(gastoInicial.descricao);
      setValorTexto(String(gastoInicial.valor));
      setCategoriaTexto(gastoInicial.categoria);
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
    });

    if (!gastoInicial) {
      setDescricaoTexto('');
      setValorTexto('');
      setCategoriaTexto('');
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricaoTexto}
        onChangeText={setDescricaoTexto}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor"
        value={valorTexto}
        onChangeText={setValorTexto}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Categoria"
        value={categoriaTexto}
        onChangeText={setCategoriaTexto}
      />
      <Button title={textoBotao} onPress={handleSalvar} />
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