import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cores, raio } from '../constants/theme';

const BotaoIcone = ({ icone, onPress }) => {
  return (
    <Pressable style={styles.botao} onPress={onPress} hitSlop={6}>
      <Ionicons name={icone} size={18} color={cores.primaria} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  botao: {
    width: 38,
    height: 38,
    backgroundColor: cores.primariaClara,
    borderRadius: raio.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BotaoIcone;