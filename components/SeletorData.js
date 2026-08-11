import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatarData } from '../utils/formatarData';
import { cores, espacamento, tipografia, raio } from '../constants/theme';

const combinarDataHora = (dataBase, novaData, tipo) => {
  const resultado = new Date(dataBase);
  if (tipo === 'data') {
    resultado.setFullYear(novaData.getFullYear(), novaData.getMonth(), novaData.getDate());
  } else {
    resultado.setHours(novaData.getHours(), novaData.getMinutes());
  }
  return resultado.getTime();
};

const SeletorData = ({ dataSelecionada, onSelecionar }) => {
  const [pickerAberto, setPickerAberto] = useState(null); // 'data' | 'hora' | null

  const handleChange = (tipo) => (event, novaData) => {
    if (Platform.OS === 'android') {
      setPickerAberto(null);
    }
    if (event.type === 'dismissed' || !novaData) return;
    onSelecionar(combinarDataHora(dataSelecionada, novaData, tipo));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Data do gasto</Text>
      <Text style={styles.dataTexto}>{formatarData(dataSelecionada)}</Text>

      <View style={styles.botoes}>
        <Pressable style={styles.botao} onPress={() => setPickerAberto('data')}>
          <Text style={styles.botaoTexto}>Data</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => setPickerAberto('hora')}>
          <Text style={styles.botaoTexto}>Hora</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => onSelecionar(Date.now())}>
          <Text style={styles.botaoTexto}>Agora</Text>
        </Pressable>
      </View>

      {pickerAberto === 'data' && (
        <DateTimePicker
          value={new Date(dataSelecionada)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange('data')}
          maximumDate={new Date()}
        />
      )}

      {pickerAberto === 'hora' && (
        <DateTimePicker
          value={new Date(dataSelecionada)}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange('hora')}
        />
      )}

      {Platform.OS === 'ios' && pickerAberto && (
        <Pressable style={styles.botaoConcluir} onPress={() => setPickerAberto(null)}>
          <Text style={styles.botaoConcluirTexto}>Concluído</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: espacamento.lg },
  label: { ...tipografia.caption, color: cores.textoTerciario },
  dataTexto: { ...tipografia.bodyBold, color: cores.textoPrimario, marginTop: 2, marginBottom: espacamento.sm },
  botoes: { flexDirection: 'row', gap: espacamento.sm },
  botao: {
    flex: 1,
    paddingVertical: espacamento.sm + 2,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: raio.sm,
    alignItems: 'center',
  },
  botaoTexto: { color: cores.primaria, fontWeight: '700', fontSize: 14 },
  botaoConcluir: {
    marginTop: espacamento.sm,
    paddingVertical: espacamento.sm,
    backgroundColor: cores.primaria,
    borderRadius: raio.sm,
    alignItems: 'center',
  },
  botaoConcluirTexto: { color: cores.branco, fontWeight: '700', fontSize: 14 },
});

export default SeletorData;