import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatarData } from '../utils/formatarData';

const SeletorData = ({ dataSelecionada, onSelecionar }) => {
  const [mostrarPicker, setMostrarPicker] = useState(false);

  const handleChange = (event, dataEscolhida) => {
    setMostrarPicker(false);
    if (event.type === 'dismissed' || !dataEscolhida) return;
    onSelecionar(dataEscolhida.getTime());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Data do gasto</Text>
      <Text style={styles.dataTexto}>{formatarData(dataSelecionada)}</Text>

      <View style={styles.botoes}>
        <Pressable style={styles.botao} onPress={() => setMostrarPicker(true)}>
          <Text style={styles.botaoTexto}>Escolher data</Text>
        </Pressable>
        <Pressable style={styles.botao} onPress={() => onSelecionar(Date.now())}>
          <Text style={styles.botaoTexto}>Agora</Text>
        </Pressable>
      </View>

      {mostrarPicker && (
        <DateTimePicker
          value={new Date(dataSelecionada)}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    marginTop: 16 
  },
  label: { 
    fontSize: 14, 
    color: '#555', 
    marginBottom: 4 
  },
  dataTexto: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 8 
  },
  botoes: { 
    flexDirection: 'row', 
    gap: 8 
  },
  botao: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#4a90d9',
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoTexto: { 
    color: '#4a90d9', 
    fontWeight: 'bold' 
  },
});

export default SeletorData;