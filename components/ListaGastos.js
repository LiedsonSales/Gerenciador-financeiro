import { FlatList, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import ItemGasto from './ItemGasto';

const ListaGastos = ({ gastos, total, aoExcluir }) => {
  const router = useRouter();

  const confirmarExclusao = (id) => {
    Alert.alert(
      'Excluir gasto',
      'Tem certeza que deseja excluir este gasto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => aoExcluir(id) },
      ]
    );
  };

  return (
    <FlatList
      data={gastos}
      keyExtractor={(item, index) => item.id ?? index.toString()}
      renderItem={({ item }) => (
        <ItemGasto
          descricao={item.descricao}
          valor={item.valor}
          categoria={item.categoria}
          onEditar={() => router.push({ pathname: '/adicionar', params: { id: item.id } })}
          onExcluir={() => confirmarExclusao(item.id)}
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