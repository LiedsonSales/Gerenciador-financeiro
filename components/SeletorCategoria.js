import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';

const SeletorCategoria = ({ categorias, valorSelecionado, onSelecionar }) => {
  if (categorias.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categorias já usadas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categorias.map((categoria) => {
          const selecionada = valorSelecionado.trim().toLowerCase().normalize('NFC') === categoria.trim().toLowerCase().normalize('NFC');
          return (
            <Pressable
              key={categoria}
              onPress={() => onSelecionar(categoria)}
              style={[styles.chip, selecionada && styles.chipSelecionado]}
            >
              <Text style={[styles.texto, selecionada && styles.textoSelecionado]}>
                {categoria}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 8 },
  label: { fontSize: 13, color: '#888', marginBottom: 6 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
  },
  chipSelecionado: {
    backgroundColor: '#4a90d9',
    borderColor: '#4a90d9',
  },
  texto: {
    color: '#333',
    fontSize: 14,
  },
  textoSelecionado: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SeletorCategoria;