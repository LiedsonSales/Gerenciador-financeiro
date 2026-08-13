import { Text, View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatarData, formatarHora } from '../utils/formatarData';
import { cores, espacamento, tipografia, raio } from '../constants/theme';

const ICONES_CATEGORIA = {
  Alimentação: 'fast-food',
  Transporte: 'car',
  Saúde: 'medkit',
  Lazer: 'game-controller',
};

const ItemGasto = ({ descricao, valor, categoria, formaPagamento, dataGasto, apenasHora, onEditar, onExcluir }) => {
  const nomeIcone = ICONES_CATEGORIA[categoria] || 'pricetag';
  const textoData = dataGasto ? (apenasHora ? formatarHora(dataGasto) : formatarData(dataGasto)) : '';

  return (
    <View style={styles.linha}>
      <View style={styles.iconeContainer}>
        <Ionicons name={nomeIcone} size={17} color={cores.primaria} />
      </View>

      <View style={styles.conteudo}>
        <View style={styles.linhaTopo}>
          <Text style={styles.descricao} numberOfLines={1}>{descricao}</Text>
          <Text style={styles.valor}>R$ {valor.toFixed(2)}</Text>
        </View>

        <View style={styles.tags}>
          {categoria ? (
            <View style={styles.tag}>
              <Ionicons name="pricetag-outline" size={11} color={cores.textoSecundario} />
              <Text style={styles.tagTexto} numberOfLines={1}>{categoria}</Text>
            </View>
          ) : null}

          {formaPagamento ? (
            <View style={styles.tag}>
              <Ionicons name="card-outline" size={11} color={cores.textoSecundario} />
              <Text style={styles.tagTexto} numberOfLines={1}>{formaPagamento}</Text>
            </View>
          ) : null}

          {textoData ? (
            <View style={styles.tag}>
              <Ionicons name="time-outline" size={11} color={cores.textoSecundario} />
              <Text style={styles.tagTexto} numberOfLines={1}>{textoData}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {(onEditar || onExcluir) && (
        <View style={styles.acoes}>
          {onEditar && (
            <Pressable onPress={onEditar} style={styles.botaoIcone} hitSlop={8}>
              <Ionicons name="pencil" size={15} color={cores.textoSecundario} />
            </Pressable>
          )}
          {onExcluir && (
            <Pressable onPress={onExcluir} style={styles.botaoIcone} hitSlop={8}>
              <Ionicons name="trash" size={15} color={cores.perigo} />
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
    alignItems: 'flex-start',
    backgroundColor: cores.superficie,
    borderRadius: raio.lg,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacamento.md,
    marginBottom: espacamento.sm,
    gap: espacamento.sm,
  },
  iconeContainer: {
    width: 36,
    height: 36,
    borderRadius: raio.md,
    backgroundColor: cores.primariaClara,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  conteudo: { flex: 1, minWidth: 0 },
  linhaTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espacamento.sm,
  },
  descricao: { ...tipografia.bodyBold, color: cores.textoPrimario, flexShrink: 1 },
  valor: { ...tipografia.bodyBold, color: cores.textoPrimario },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 6,
    columnGap: espacamento.md,
    marginTop: espacamento.xs,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagTexto: { fontSize: 12, color: cores.textoSecundario },
  acoes: { flexDirection: 'row', gap: espacamento.xs, marginTop: 3 },
  botaoIcone: { padding: 4 },
});

export default ItemGasto;