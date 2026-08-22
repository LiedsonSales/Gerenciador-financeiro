import { View, Text, Pressable, StyleSheet } from 'react-native';
import { labelMes } from '../utils/periodo';
import { espacamento, raio } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const SeletorMes = ({ ano, mes, onMudarMes, podeAvancar }) => {
  const { cores } = useTema();
  const styles = criarEstilos(cores);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => onMudarMes(-1)} style={styles.seta} hitSlop={12}>
        <Text style={styles.setaTexto}>‹</Text>
      </Pressable>
      <Text style={styles.label}>{labelMes(ano, mes)}</Text>
      <Pressable onPress={() => onMudarMes(1)} disabled={!podeAvancar} style={styles.seta} hitSlop={12}>
        <Text style={[styles.setaTexto, !podeAvancar && styles.setaDesabilitada]}>›</Text>
      </Pressable>
    </View>
  );
};

const criarEstilos = (cores) =>
  StyleSheet.create({
    container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: espacamento.lg },
    seta: {
      width: 32, height: 32, borderRadius: raio.sm, backgroundColor: cores.primariaClara,
      alignItems: 'center', justifyContent: 'center',
    },
    setaTexto: { fontSize: 20, color: cores.primaria, fontWeight: '700' },
    setaDesabilitada: { color: cores.textoTerciario },
    label: { fontSize: 16, fontWeight: '700', color: cores.textoPrimario },
  });

export default SeletorMes;