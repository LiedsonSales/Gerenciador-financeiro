import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatarData } from '../utils/formatarData';

const ItemGasto = ({ descricao, valor, categoria, formaPagamento, dataGasto, onEditar, onExcluir }) => {
  return (
    <View style={styles.linha}>
      <View style={styles.info}>
        <Text style={styles.descricao}>{descricao} ({categoria})</Text>
        {formaPagamento ? <Text style={styles.detalhe}>{formaPagamento}</Text> : null}
        {dataGasto ? <Text style={styles.detalhe}>{formatarData(dataGasto)}</Text> : null}
        <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
      </View>

      {(onEditar || onExcluir) && (
        <View style={styles.acoes}>
          {onEditar && (
            <Pressable onPress={onEditar} style={styles.botaoIcone} hitSlop={8}>
              <Ionicons name="pencil" size={20} color="#4a90d9" />
            </Pressable>
          )}
          {onExcluir && (
            <Pressable onPress={onExcluir} style={styles.botaoIcone} hitSlop={8}>
              <Ionicons name="trash" size={20} color="#e74c3c" />
            </Pressable>
          )}
        </View>
      )}
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
  info: { flex: 1 },
  descricao: { fontSize: 16 },
  detalhe: { fontSize: 13, color: '#888', marginTop: 2 },
  valor: { fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  acoes: { flexDirection: 'row', gap: 14 },
  botaoIcone: { padding: 4 },
});

export default ItemGasto;