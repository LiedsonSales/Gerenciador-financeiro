import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListaGasto  from './components/ListaGastos';
import FormularioGasto from './components/formularioGasto';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function App() {
  const [gastos, setGastos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
        setGastos(dados ? JSON.parse(dados) : []);
      } catch(erro) {
        console.log('Erro ao carregar:', erro);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
    
  }, []);

  useEffect(() => {
    if (!carregando) {
      AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(gastos));
    }
  }, [gastos]);

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
