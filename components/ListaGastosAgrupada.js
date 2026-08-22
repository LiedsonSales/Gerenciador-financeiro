import { SectionList, Text, View, StyleSheet, Alert } from 'react-native';
import ItemGasto from './ItemGasto';
import { espacamento, tipografia } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const ListaGastosAgrupada = ({ secoes, apenasHora, onEditar, onExcluir, textoVazio, ListFooterComponent }) => {
  const { cores } = useTema();
  const styles = criarEstilos(cores);

  const confirmarExclusao = (id) => {
    Alert.alert(
      'Excluir gasto',
      'Tem certeza que deseja excluir este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => onExcluir(id) },
      ]
    );
  };

  return (
    <SectionList
      sections={secoes}
      keyExtractor={(item, index) => item.id ?? index.toString()}
      renderItem={({ item }) => (
        <ItemGasto
          descricao={item.descricao}
          valor={item.valor}
          categoria={item.categoria}
          formaPagamento={item.formaPagamento}
          dataGasto={item.dataGasto}
          apenasHora={apenasHora}
          onEditar={onEditar ? () => onEditar(item.id) : undefined}
          onExcluir={onExcluir ? () => confirmarExclusao(item.id) : undefined}
        />
      )}
      renderSectionHeader={({ section }) => (
        <View style={styles.headerSecao}>
          <Text style={styles.tituloSecao}>{section.title}</Text>
          {section.total !== undefined && (
            <Text style={styles.totalSecao}>R$ {section.total.toFixed(2)}</Text>
          )}
        </View>
      )}
      ListEmptyComponent={<Text style={styles.vazio}>{textoVazio}</Text>}
      ListFooterComponent={ListFooterComponent}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const criarEstilos = (cores) =>
  StyleSheet.create({
    headerSecao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginTop: espacamento.md,
      marginBottom: espacamento.sm,
    },
    tituloSecao: { ...tipografia.caption, fontWeight: '700', color: cores.textoTerciario, textTransform: 'uppercase' },
    totalSecao: { ...tipografia.caption, fontWeight: '700', color: cores.textoSecundario },
    vazio: { ...tipografia.body, color: cores.textoSecundario, textAlign: 'center', marginTop: espacamento.xl },
  });

export default ListaGastosAgrupada;