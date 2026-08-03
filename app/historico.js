import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { carregarHistorico } from '../utils/historico';
import { formatarData } from '../utils/formatarData';

export default function Historico() {
  const [eventos, setEventos] = useState([]);
  const [ordem, setOrdem] = useState('recentes');

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        const dados = await carregarHistorico();
        setEventos(dados);
      };
      carregar();
    }, [])
  );

  const eventosOrdenados = [...eventos].sort((a, b) =>
    ordem === 'recentes'
      ? b.dataEvento - a.dataEvento
      : a.dataEvento - b.dataEvento
  );

  const alternarOrdem = () => {
    setOrdem(ordem === 'recentes' ? 'antigos' : 'recentes');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.botaoOrdem} onPress={alternarOrdem}>
        <Text style={styles.botaoOrdemTexto}>
          Ordenar: {ordem === 'recentes' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
        </Text>
      </Pressable>

      <FlatList
        data={eventosOrdenados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <Ionicons
              name={item.tipo === 'adicionado' ? 'add-circle' : 'remove-circle'}
              size={22}
              color={item.tipo === 'adicionado' ? '#2ecc71' : '#e74c3c'}
            />
            <View style={styles.info}>
              <Text style={styles.descricao}>
                {item.tipo === 'adicionado' ? 'Adicionado' : 'Removido'}: {item.descricao}
              </Text>
              <Text style={styles.detalhe}>
                R$ {item.valor.toFixed(2)} · {formatarData(item.dataEvento)}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum evento registrado ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20, paddingHorizontal: 20 },
  botaoOrdem: {
    paddingVertical: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#4a90d9',
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoOrdemTexto: { color: '#4a90d9', fontWeight: 'bold' },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: { flex: 1 },
  descricao: { fontSize: 15 },
  detalhe: { fontSize: 13, color: '#888', marginTop: 2 },
});