import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { raio } from '../constants/theme';
import { useTema } from '../context/ThemeContext';

const BotaoIcone = ({ icone, onPress }) => {
  const { cores } = useTema();
  const styles = criarEstilos(cores);

  return (
    <Pressable style={styles.botao} onPress={onPress} hitSlop={6}>
      <Ionicons name={icone} size={18} color={cores.primaria} />
    </Pressable>
  );
};

const criarEstilos = (cores) =>
  StyleSheet.create({
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