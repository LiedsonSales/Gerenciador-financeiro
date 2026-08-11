import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { carregarHistorico } from '../utils/historico';
import { formatarData } from '../utils/formatarData';
import { cores, espacamento, tipografia, raio } from '../constants/theme';

export default function Historico() {
  const [eventos, setEventos] = useState([]);
  const [ordem, setOrdem] = useState('recentes');

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => setEventos(await carregarHistorico());
      carregar();
    }, [])
  );

  const eventosOrdenados = [...eventos].sort((a, b) =>
    ordem === 'recentes' ? b.dataEvento - a.dataEvento : a.dataEvento - b.dataEvento
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico</Text>
      <Pressable style={styles.botaoOrdem} onPress={() => setOrdem(ordem === 'recentes' ? 'antigos' : 'recentes')}>
        <Ionicons name="swap-vertical" size={15} color={cores.primaria} />
        <Text style={styles.botaoOrdemTexto}>
          {ordem === 'recentes' ? 'Mais recentes primeiro' : 'Mais antigos primeiro'}
        </Text>
      </Pressable>

      <FlatList
        data={eventosOrdenados}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <View style={[styles.iconeContainer, { backgroundColor: item.tipo === 'adicionado' ? '#E9F9F0' : '#FDECEC' }]}>
              <Ionicons
                name={item.tipo === 'adicionado' ? 'add' : 'remove'}
                size={16}
                color={item.tipo === 'adicionado' ? cores.sucesso : cores.perigo}
              />
            </View>
            <View style={styles.info}>
              <Text style={styles.descricao}>
                {item.tipo === 'adicionado' ? 'Adicionado' : 'Removido'}: {item.descricao}
              </Text>
              <Text style={styles.detalhe}>R$ {item.valor.toFixed(2)} · {formatarData(item.dataEvento)}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum evento registrado ainda.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo, paddingTop: espacamento.xxl, paddingHorizontal: espacamento.xl },
  titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },
  botaoOrdem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: espacamento.xs,
    paddingVertical: espacamento.sm + 2, marginBottom: espacamento.lg,
    borderWidth: 1, borderColor: cores.borda, borderRadius: raio.sm, backgroundColor: cores.superficie,
  },
  botaoOrdemTexto: { color: cores.primaria, fontWeight: '600', fontSize: 13 },
  linha: {
    flexDirection: 'row', alignItems: 'center', gap: espacamento.sm,
    paddingVertical: espacamento.sm + 2, borderBottomWidth: 1, borderBottomColor: cores.borda,
  },
  iconeContainer: { width: 30, height: 30, borderRadius: raio.sm, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  descricao: { ...tipografia.body, color: cores.textoPrimario },
  detalhe: { ...tipografia.caption, color: cores.textoSecundario, marginTop: 1 },
  vazio: { ...tipografia.body, color: cores.textoSecundario, textAlign: 'center', marginTop: espacamento.xl },
});