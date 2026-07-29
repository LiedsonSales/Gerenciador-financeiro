import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ItemGasto = ({ descricao, valor, categoria, onEditar, onExcluir }) => {
  return (
    <View style={styles.linha}>
      <View style={styles.info}>
        <Text style={styles.descricao}>{descricao} ({categoria})</Text>
        <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
      </View>

      <View style={styles.acoes}>
        <Pressable onPress={onEditar} style={styles.botaoIcone} hitSlop={8}>
          <Ionicons name="pencil" size={20} color="#4a90d9" />
        </Pressable>
        <Pressable onPress={onExcluir} style={styles.botaoIcone} hitSlop={8}>
          <Ionicons name="trash" size={20} color="#e74c3c" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: {
    flex: 1,
  },
  descricao: {
    fontSize: 16,
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  acoes: {
    flexDirection: 'row',
    gap: 14,
  },
  botaoIcone: {
    padding: 4,
  },
});

export default ItemGasto;