import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormularioGasto from '../components/formularioGasto';

const CHAVE_ARMAZENAMENTO = 'gastos';

export default function Adicionar() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [gastoParaEditar, setGastoParaEditar] = useState(null);
  const [carregando, setCarregando] = useState(!!id);

  useEffect(() => {
    const carregarGasto = async () => {
      if (!id) return;
      try {
        const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
        const gastos = dados ? JSON.parse(dados) : [];
        const encontrado = gastos.find((g) => g.id === id);
        setGastoParaEditar(encontrado || null);
      } catch (erro) {
        console.log('Erro ao carregar gasto para edição:', erro);
      } finally {
        setCarregando(false);
      }
    };
    carregarGasto();
  }, [id]);

  const salvarGasto = async (dadosGasto) => {
    try {
      const dados = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO);
      const gastosAtuais = dados ? JSON.parse(dados) : [];

      let novaLista;
      if (id) {
        novaLista = gastosAtuais.map((g) =>
          g.id === id ? { ...g, ...dadosGasto } : g
        );
      } else {
        novaLista = [...gastosAtuais, { id: Date.now().toString(), ...dadosGasto }];
      }

      await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(novaLista));
      router.back();
    } catch (erro) {
      console.log('Erro ao salvar gasto:', erro);
    }
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FormularioGasto
        aoSalvar={salvarGasto}
        gastoInicial={gastoParaEditar}
        textoBotao={id ? 'Salvar Alterações' : 'Adicionar Gasto'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 20,
  },
});