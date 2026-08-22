import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatarData, formatarHora } from '../utils/formatarData';
import { espacamento, tipografia, raio } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const ICONES_CATEGORIA = {
  Alimentação: 'fast-food',
  Transporte: 'car',
  Saúde: 'medkit',
  Lazer: 'game-controller',
};

const ItemGasto = ({ descricao, valor, categoria, formaPagamento, dataGasto, apenasHora, onEditar, onExcluir }) => {
  const { cores } = useTema();
  const styles = criarEstilos(cores);

  const nomeIcone = ICONES_CATEGORIA[categoria] || 'pricetag';
  const textoData = dataGasto ? (apenasHora ? formatarHora(dataGasto) : formatarData(dataGasto)) : '';

  return (
    <View style={styles.linha}>
      <View style={styles.iconeContainer}>
        <Ionicons name={nomeIcone} size={17} color={cores.primaria} />
      </View>

      <View style={styles.info}>
        <Text style={styles.descricao} numberOfLines={1}>{descricao}</Text>
        <Text style={styles.detalhe} numberOfLines={1}>
          {categoria}{formaPagamento ? ` · ${formaPagamento}` : ''}{textoData ? ` · ${textoData}` : ''}
        </Text>
      </View>

      <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>

      {(onEditar || onExcluir) && (
        <View style={styles.acoes}>
          {onEditar && (
            <Pressable onPress={onEditar} style={styles.botaoIcone} hitSlop={8}>
              <Ionicons name="pencil" size={16} color={cores.textoSecundario} />
            </Pressable>
          )}
          {onExcluir && (
            <Pressable onPress={onExcluir} style={styles.botaoIcone} hitSlop={8}>
              <Ionicons name="trash" size={16} color={cores.perigo} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const criarEstilos = (cores) =>
  StyleSheet.create({
    linha: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: cores.superficie,
      borderRadius: raio.lg, borderWidth: 1, borderColor: cores.borda,
      padding: espacamento.md, marginBottom: espacamento.sm, gap: espacamento.sm,
    },
    iconeContainer: {
      width: 38, height: 38, borderRadius: raio.md, backgroundColor: cores.primariaClara,
      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    },
    info: { flex: 1, minWidth: 0 },
    descricao: { ...tipografia.bodyBold, color: cores.textoPrimario },
    detalhe: { ...tipografia.caption, color: cores.textoSecundario, marginTop: 2 },
    valor: { ...tipografia.bodyBold, color: cores.textoPrimario, marginLeft: espacamento.sm },
    acoes: { flexDirection: 'row', gap: espacamento.xs, marginLeft: espacamento.sm },
    botaoIcone: { padding: 4 },
  });

export default ItemGasto;