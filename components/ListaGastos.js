import { FlatList, Text, StyleSheet } from 'react-native';
import ItemGasto from './ItemGasto';

const ListaGastos = ({ gastos, total }) => {
  return (
    <FlatList
      data={gastos}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <ItemGasto
          descricao={item.descricao}
          valor={item.valor}
          categoria={item.categoria}
        />
      )}
      ListHeaderComponent={<Text style={styles.titulo}>Meus Gastos</Text>}
      ListFooterComponent={<Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>}
      ListEmptyComponent={<Text>Nenhum gasto registrado ainda.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
  },
});

export default ListaGastos;