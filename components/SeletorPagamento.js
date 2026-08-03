import { View, Text, Pressable, StyleSheet } from 'react-native';

const OPCOES = ['Dinheiro', 'Débito', 'Crédito'];

const SeletorPagamento = ({ valorSelecionado, onSelecionar }) => {
  return (
    <View style={styles.container}>
      {OPCOES.map((opcao) => {
        const selecionado = valorSelecionado === opcao;
        return (
          <Pressable
            key={opcao}
            onPress={() => onSelecionar(opcao)}
            style={[styles.botao, selecionado && styles.botaoSelecionado]}
          >
            <Text style={[styles.texto, selecionado && styles.textoSelecionado]}>
              {opcao}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  botao: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoSelecionado: {
    backgroundColor: '#4a90d9',
    borderColor: '#4a90d9',
  },
  texto: {
    color: '#333',
  },
  textoSelecionado: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SeletorPagamento;