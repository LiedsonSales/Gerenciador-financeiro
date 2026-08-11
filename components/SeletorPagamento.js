import { View, Text, Pressable, StyleSheet } from 'react-native';
import { cores, espacamento, tipografia, raio } from '../constants/theme';

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
            <Text style={[styles.texto, selecionado && styles.textoSelecionado]}>{opcao}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginTop: espacamento.sm, gap: espacamento.sm },
  botao: {
    flex: 1,
    paddingVertical: espacamento.sm + 2,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.sm,
    alignItems: 'center',
    backgroundColor: cores.superficie,
  },
  botaoSelecionado: { backgroundColor: cores.primaria, borderColor: cores.primaria },
  texto: { ...tipografia.body, color: cores.textoSecundario },
  textoSelecionado: { color: cores.branco, fontWeight: '700' },
});

export default SeletorPagamento;