import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ListaGasto  from './components/ListaGastos';
import FormularioGasto from './components/formularioGasto';

export default function App() {
  const [gastos, setGastos] = useState([
    { descricao: 'iFood', valor: 23.50, categoria: 'Alimentação'}
  ]);

  const total = gastos.reduce((soma, item) => soma + item.valor, 0);

  const adicionarGasto = (novoGasto) => {
    setGastos([...gastos, novoGasto]);
  }

  return(
    <View style={styles.constainer}>
      <ListaGasto gastos={gastos} total={total}/>
      <FormularioGasto aoAdicionar={adicionarGasto}/>
    </View>
  )
}

const styles = StyleSheet.create({
  constainer: {
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20
  },  
})
