import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { espacamento, raio } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const SeletorCategoria = ({ categorias, valorSelecionado, onSelecionar }) => {
  const { cores } = useTema();
  const styles = criarEstilos(cores);

  if (categorias.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categorias já usadas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categorias.map((categoria) => {
          const selecionada =
            valorSelecionado.trim().toLowerCase().normalize('NFC') ===
            categoria.trim().toLowerCase().normalize('NFC');
          return (
            <Pressable
              key={categoria}
              onPress={() => onSelecionar(categoria)}
              style={[styles.chip, selecionada && styles.chipSelecionado]}
            >
              <Text style={[styles.texto, selecionada && styles.textoSelecionado]}>{categoria}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const criarEstilos = (cores) =>
  StyleSheet.create({
    container: { marginTop: espacamento.sm },
    label: { fontSize: 13, color: cores.textoTerciario, marginBottom: espacamento.xs },
    chip: {
      paddingVertical: 6,
      paddingHorizontal: espacamento.md,
      borderRadius: raio.pill,
      borderWidth: 1,
      borderColor: cores.borda,
      marginRight: espacamento.xs,
      backgroundColor: cores.superficie,
    },
    chipSelecionado: { backgroundColor: cores.primaria, borderColor: cores.primaria },
    texto: { color: cores.textoSecundario, fontSize: 13 },
    textoSelecionado: { color: cores.branco, fontWeight: '700' },
  });

export default SeletorCategoria;