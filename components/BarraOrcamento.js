import { View, Text, StyleSheet } from 'react-native';
import { cores, espacamento, tipografia, raio } from '../constants/theme';

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

  let cor = cores.sucesso;
  if (percentual >= 70) cor = cores.alerta;
  if (percentual >= 100) cor = cores.perigo;

  return (
    <View style={styles.container}>
      <View style={styles.linhaTextos}>
        <Text style={styles.gasto}>R$ {totalGasto.toFixed(2)} gastos</Text>
        <Text style={[styles.percentual, { color: cor }]}>{percentual.toFixed(0)}%</Text>
      </View>
      <View style={styles.barraFundo}>
        <View style={[styles.barraPreenchida, { width: `${percentualVisual}%`, backgroundColor: cor }]} />
      </View>
      <Text style={styles.referencia}>Referência: R$ {rendaReferencia.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: espacamento.xl },
  aviso: { ...tipografia.body, color: cores.textoSecundario },
  linhaTextos: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: espacamento.xs },
  gasto: { ...tipografia.bodyBold, color: cores.textoPrimario },
  percentual: { ...tipografia.bodyBold },
  barraFundo: {
    height: 8,
    backgroundColor: cores.primariaClara,
    borderRadius: raio.pill,
    overflow: 'hidden',
  },
  barraPreenchida: { height: '100%', borderRadius: raio.pill },
  referencia: { ...tipografia.caption, color: cores.textoTerciario, marginTop: espacamento.xs },
});

export default BarraOrcamento;