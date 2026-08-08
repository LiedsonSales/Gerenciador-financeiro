import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { buscarRenda, salvarRenda } from '../utils/renda';

const RendaMensal = () => {
  const [renda, setRenda] = useState(0);
  const [editando, setEditando] = useState(false);
  const [textoInput, setTextoInput] = useState('');

  useEffect(() => {
    const carregar = async () => {
      const valor = await buscarRenda();
      setRenda(valor);
    };
    carregar();
  }, []);

  const iniciarEdicao = () => {
    setTextoInput(renda > 0 ? String(renda) : '');
    setEditando(true);
  };

  const confirmarEdicao = async () => {
    const valorNumero = parseFloat(textoInput) || 0;
    setRenda(valorNumero);
    await salvarRenda(valorNumero);
    setEditando(false);
  };

  if (editando) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Renda mensal</Text>
        <View style={styles.linhaEdicao}>
          <TextInput
            style={styles.input}
            value={textoInput}
            onChangeText={setTextoInput}
            keyboardType="numeric"
            placeholder="0,00"
            autoFocus
          />
          <Pressable style={styles.botaoSalvar} onPress={confirmarEdicao}>
            <Text style={styles.botaoSalvarTexto}>Salvar</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <Pressable style={styles.container} onPress={iniciarEdicao}>
      <Text style={styles.label}>Renda mensal</Text>
      <Text style={styles.valor}>
        {renda > 0 ? `R$ ${renda.toFixed(2)}` : 'Toque para definir'}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f7fa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  label: { fontSize: 13, color: '#888' },
  valor: { fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  linhaEdicao: { flexDirection: 'row', gap: 8, marginTop: 6, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#fff',
  },
  botaoSalvar: {
    backgroundColor: '#4a90d9',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  botaoSalvarTexto: { color: '#fff', fontWeight: 'bold' },
});

export default RendaMensal;