import { View, Text, Pressable, StyleSheet } from 'react-native';
import { espacamento, raio } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const OPCOES = ['Dinheiro', 'Débito', 'Crédito'];

const SeletorPagamento = ({ valorSelecionado, onSelecionar }) => {
  const { cores } = useTema();
  const styles = criarEstilos(cores);

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

const criarEstilos = (cores) =>
  StyleSheet.create({
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
    texto: { color: cores.textoSecundario, fontSize: 15 },
    textoSelecionado: { color: cores.branco, fontWeight: '700' },
  });

export default SeletorPagamento;