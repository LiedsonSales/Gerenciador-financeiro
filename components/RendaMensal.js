import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buscarRenda, salvarRenda } from '../utils/renda';
import { cores, espacamento, tipografia, raio, sombra } from '../constants/theme';

const RendaMensal = ({ totalGasto = 0, onPress }) => {
  const [renda, setRenda] = useState(0);
  const [editando, setEditando] = useState(false);
  const [textoInput, setTextoInput] = useState('');

  useEffect(() => {
    const carregar = async () => {
      const valor = await buscarRenda();
      setRenda(valor);
    };
    carregar();
  }, []);

  const iniciarEdicao = () => {
    setTextoInput(renda > 0 ? String(renda) : '');
    setEditando(true);
  };

  const confirmarEdicao = async () => {
    const valorNumero = parseFloat(textoInput) || 0;
    setRenda(valorNumero);
    await salvarRenda(valorNumero);
    setEditando(false);
  };

  if (editando) {
    return (
      <View style={[styles.card, sombra]}>
        <Text style={styles.label}>Renda mensal</Text>
        <View style={styles.linhaEdicao}>
          <TextInput
            style={styles.input}
            value={textoInput}
            onChangeText={setTextoInput}
            keyboardType="numeric"
            placeholder="0,00"
            placeholderTextColor="rgba(255,255,255,0.5)"
            autoFocus
          />
          <Pressable style={styles.botaoSalvar} onPress={confirmarEdicao} hitSlop={8}>
            <Ionicons name="checkmark" size={20} color={cores.primaria} />
          </Pressable>
        </View>
      </View>
    );
  }

  const percentual = renda > 0 ? (totalGasto / renda) * 100 : 0;
  const percentualVisual = Math.min(percentual, 100);

  let corBarra = cores.branco;
  if (percentual >= 70) corBarra = cores.alerta;
  if (percentual >= 100) corBarra = cores.perigo;

  return (
    <Pressable style={[styles.card, sombra]} onPress={onPress}>
      <View style={styles.linhaTopo}>
        <Text style={styles.label}>Renda mensal</Text>
        <Pressable onPress={iniciarEdicao} hitSlop={10} style={styles.botaoLapis}>
          <Ionicons name="pencil" size={13} color="rgba(255,255,255,0.85)" />
        </Pressable>
      </View>

      <Text style={styles.valor}>
        {renda > 0 ? `R$ ${renda.toFixed(2)}` : 'Toque no lápis para definir'}
      </Text>

      {renda > 0 && (
        <>
          <View style={styles.barraTrack}>
            <View style={[styles.barraFill, { width: `${percentualVisual}%`, backgroundColor: corBarra }]} />
          </View>
          <View style={styles.rodape}>
            <Text style={styles.rodapeTexto}>R$ {totalGasto.toFixed(2)} gastos</Text>
            <Text style={styles.rodapeTexto}>{percentual.toFixed(0)}%</Text>
          </View>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.primaria,
    borderRadius: raio.xl,
    padding: espacamento.lg,
    marginBottom: espacamento.lg,
  },
  linhaTopo: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  label: { 
    ...tipografia.caption, 
    color: 'rgba(255,255,255,0.85)' 
  },
  botaoLapis: { 
    padding: 4 
  },
  valor: { 
    ...tipografia.h1, 
    color: cores.branco, 
    marginTop: 4 
  },
  barraTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: raio.pill,
    marginTop: espacamento.md,
    overflow: 'hidden',
  },
  barraFill: { 
    height: '100%',  
    borderRadius: raio.pill 
  },
  rodape: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: espacamento.xs 
  },
  rodapeTexto: { 
    fontSize: 11, 
    color: 'rgba(255,255,255,0.85)' 
  },
  linhaEdicao: { 
    flexDirection: 'row', 
    gap: espacamento.sm, 
    marginTop: espacamento.sm, 
    alignItems: 'center' 
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: raio.sm,
    padding: espacamento.sm,
    color: cores.branco,
    fontSize: 16,
    fontWeight: '700',
  },
  botaoSalvar: {
    width: 36,
    height: 36,
    borderRadius: raio.sm,
    backgroundColor: cores.branco,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default RendaMensal;