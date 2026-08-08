import { View, Text, StyleSheet } from 'react-native';

const BarraOrcamento = ({ totalGasto, rendaReferencia }) => {
  if (rendaReferencia <= 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.aviso}>Defina sua renda mensal na tela inicial para ver esta análise.</Text>
      </View>
    );
  }

  const percentual = (totalGasto / rendaReferencia) * 100;
  const percentualVisual = Math.min(percentual, 100);

  let cor = '#2ecc71';
  if (percentual >= 70) cor = '#f39c12';
  if (percentual >= 100) cor = '#e74c3c';

  return (
    <View style={styles.container}>
      <View style={styles.linhaTextos}>
        <Text style={styles.gasto}>R$ {totalGasto.toFixed(2)} gastos</Text>
        <Text style={styles.percentual}>{percentual.toFixed(0)}%</Text>
      </View>
      <View style={styles.barraFundo}>
        <View style={[styles.barraPreenchida, { width: `${percentualVisual}%`, backgroundColor: cor }]} />
      </View>
      <Text style={styles.referencia}>Referência: R$ {rendaReferencia.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  aviso: { color: '#888', fontSize: 14 },
  linhaTextos: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  gasto: { fontSize: 15, fontWeight: 'bold' },
  percentual: { fontSize: 15, fontWeight: 'bold' },
  barraFundo: {
    height: 14,
    backgroundColor: '#eee',
    borderRadius: 7,
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    borderRadius: 7,
  },
  referencia: { fontSize: 12, color: '#888', marginTop: 4 },
});

export default BarraOrcamento;