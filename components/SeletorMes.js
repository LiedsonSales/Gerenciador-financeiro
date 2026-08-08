import { View, Text, Pressable, StyleSheet } from 'react-native';
import { labelMes } from '../utils/periodo';

const SeletorMes = ({ ano, mes, onMudarMes, podeAvancar }) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onMudarMes(-1)} style={styles.seta} hitSlop={12}>
        <Text style={styles.setaTexto}>‹</Text>
      </Pressable>

      <Text style={styles.label}>{labelMes(ano, mes)}</Text>

      <Pressable
        onPress={() => onMudarMes(1)}
        disabled={!podeAvancar}
        style={styles.seta}
        hitSlop={12}
      >
        <Text style={[styles.setaTexto, !podeAvancar && styles.setaDesabilitada]}>›</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  seta: { padding: 8 },
  setaTexto: { fontSize: 26, color: '#4a90d9', fontWeight: 'bold' },
  setaDesabilitada: { color: '#ccc' },
  label: { fontSize: 18, fontWeight: 'bold' },
});

export default SeletorMes;