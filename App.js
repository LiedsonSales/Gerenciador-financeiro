import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';

export default function App() {
  const [gastos, setGastos] = useState([
    { descricao: 'iFood', valor: 23.50, categoria: 'Alimentação' },
  ]);

  const [descricaoTexto, setDescricaoTexto] = useState('');
  const [valorTexto, setValorTexto] = useState('');
  const [categoriaTexto, setCategoriatexto] = useState('');

  const total = gastos.reduce((soma, item) => soma + item.valor, 0);

  const adicionarGasto = () => {
    const valorNumero = parseFloat(valorTexto) || 0;

    if (descricaoTexto.trim() === '' || categoriaTexto.trim() === '' || valorNumero <= 0) {
      return;
    };

    setGastos([...gastos, {descricao: descricaoTexto, valor: valorNumero, categoria: categoriaTexto}]);
    setDescricaoTexto('');
    setValorTexto('');
    setCategoriatexto('');
  };

  return(
    <View style={styles.constainer}>

      <FlatList
        data={gastos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Text>{item.descricao} ({item.categoria}) - R$ {item.valor.toFixed(2)}</Text>
        )}
        ListHeaderComponent={<Text style={styles.titulo}>Meus Gastos</Text>}
        ListFooterComponent={<Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>}
      />

      <TextInput 
        style={styles.input}
        placeholder='Descrição'
        value={descricaoTexto}
        onChangeText={setDescricaoTexto}
      />
      <TextInput 
        style={styles.input}
        placeholder='Valor'
        value={valorTexto}
        onChangeText={setValorTexto}
      />
      <TextInput 
        style={styles.input}
        placeholder='Categoria'
        value={categoriaTexto}
        onChangeText={setCategoriatexto}
      />

      <Button title="Adicionar gasto" onPress={adicionarGasto}/>
      
    </View>
  )
}

const styles = StyleSheet.create({
  constainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    padding: 20
  },  
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '80%',
    marginTop: 10
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15
  }
})
