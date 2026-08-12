import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Platform, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
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
  const [modalHoraVisivel, setModalHoraVisivel] = useState(false);
  const [horaBase, setHoraBase] = useState(new Date(dataSelecionada));
  const horaEscolhidaRef = useRef(new Date(dataSelecionada));

  const abrirAndroid = (tipo) => {
    DateTimePickerAndroid.open({
      value: new Date(dataSelecionada),
      mode: tipo === 'data' ? 'date' : 'time',
      maximumDate: tipo === 'data' ? new Date() : undefined,
      onChange: (event, novaData) => {
        if (event.type === 'dismissed' || !novaData) return;
        onSelecionar(combinarDataHora(dataSelecionada, novaData, tipo));
      },
    });
  };

  const handleChangeDataIOS = (event, novaData) => {
    if (!novaData) return;
    onSelecionar(combinarDataHora(dataSelecionada, novaData, 'data'));
  };

  const abrirModalHora = () => {
    const inicial = new Date(dataSelecionada);
    horaEscolhidaRef.current = inicial;
    setHoraBase(inicial);
    setModalHoraVisivel(true);
  };

  const confirmarHora = () => {
    onSelecionar(combinarDataHora(dataSelecionada, horaEscolhidaRef.current, 'hora'));
    setModalHoraVisivel(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Data do gasto</Text>
      <Text style={styles.dataTexto}>{formatarData(dataSelecionada)}</Text>

      {Platform.OS === 'ios' ? (
        <View style={styles.linhaPickersIOS}>
          <View style={styles.pickerCompactoWrapper}>
            <DateTimePicker
              value={new Date(dataSelecionada)}
              mode="date"
              display="compact"
              onChange={handleChangeDataIOS}
              maximumDate={new Date()}
            />
          </View>
          <Pressable style={styles.botaoHora} onPress={abrirModalHora}>
            <Text style={styles.botaoHoraTexto}>
              {new Date(dataSelecionada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </Pressable>
          <Pressable style={styles.botaoAgora} onPress={() => onSelecionar(Date.now())}>
            <Text style={styles.botaoAgoraTexto}>Agora</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.botoes}>
          <Pressable style={styles.botao} onPress={() => abrirAndroid('data')}>
            <Text style={styles.botaoTexto}>Data</Text>
          </Pressable>
          <Pressable style={styles.botao} onPress={() => abrirAndroid('hora')}>
            <Text style={styles.botaoTexto}>Hora</Text>
          </Pressable>
          <Pressable style={styles.botao} onPress={() => onSelecionar(Date.now())}>
            <Text style={styles.botaoTexto}>Agora</Text>
          </Pressable>
        </View>
      )}

      <Modal visible={modalHoraVisivel} transparent animationType="slide">
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <Text style={styles.modalTitulo}>Escolher hora</Text>
            <DateTimePicker
              value={horaBase}
              mode="time"
              display="spinner"
              onChange={(event, novaHora) => {
                if (novaHora) horaEscolhidaRef.current = novaHora;
              }}
            />
            <View style={styles.modalBotoes}>
              <Pressable style={styles.modalBotaoCancelar} onPress={() => setModalHoraVisivel(false)}>
                <Text style={styles.modalBotaoCancelarTexto}>Cancelar</Text>
              </Pressable>
              <Pressable style={styles.modalBotaoConfirmar} onPress={confirmarHora}>
                <Text style={styles.modalBotaoConfirmarTexto}>Confirmar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: espacamento.lg },
  label: { ...tipografia.caption, color: cores.textoTerciario },
  dataTexto: { ...tipografia.bodyBold, color: cores.textoPrimario, marginTop: 2, marginBottom: espacamento.sm },

  linhaPickersIOS: { flexDirection: 'row', alignItems: 'center', gap: espacamento.sm },

  pickerCompactoWrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoHora: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: espacamento.md,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.sm,
    backgroundColor: cores.superficie,
  },
  botaoHoraTexto: { color: cores.textoPrimario, fontWeight: '600', fontSize: 14 },
  botaoAgora: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: espacamento.md,
    borderWidth: 1,
    borderColor: cores.primaria,
    borderRadius: raio.sm,
  },
  botaoAgoraTexto: { color: cores.primaria, fontWeight: '700', fontSize: 13 },
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

  modalFundo: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalConteudo: {
    backgroundColor: cores.superficie,
    borderTopLeftRadius: raio.xl,
    borderTopRightRadius: raio.xl,
    padding: espacamento.xl,
  },
  modalTitulo: { ...tipografia.h2, color: cores.textoPrimario, marginBottom: espacamento.sm, textAlign: 'center' },
  modalBotoes: { flexDirection: 'row', gap: espacamento.sm, marginTop: espacamento.md },
  modalBotaoCancelar: {
    flex: 1,
    paddingVertical: espacamento.md,
    borderRadius: raio.sm,
    borderWidth: 1,
    borderColor: cores.borda,
    alignItems: 'center',
  },
  modalBotaoCancelarTexto: { color: cores.textoSecundario, fontWeight: '600' },
  modalBotaoConfirmar: {
    flex: 1,
    paddingVertical: espacamento.md,
    borderRadius: raio.sm,
    backgroundColor: cores.primaria,
    alignItems: 'center',
  },
  modalBotaoConfirmarTexto: { color: cores.branco, fontWeight: '700' },
});

export default SeletorData;