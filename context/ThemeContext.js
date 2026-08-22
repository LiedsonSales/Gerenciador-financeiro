import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { temaClaro, temaEscuro } from '../constants/theme';

const CHAVE_PREFERENCIA_TEMA = 'preferenciaTemaEscuro';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [temaEscuroAtivo, setTemaEscuroAtivo] = useState(false);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const carregarPreferencia = async () => {
      try {
        const valor = await AsyncStorage.getItem(CHAVE_PREFERENCIA_TEMA);
        setTemaEscuroAtivo(valor === 'true');
      } catch (erro) {
        console.log('Erro ao carregar preferência de tema:', erro);
      } finally {
        setCarregado(true);
      }
    };
    carregarPreferencia();
  }, []);

  const alternarTema = async () => {
    const novoValor = !temaEscuroAtivo;
    setTemaEscuroAtivo(novoValor);
    await AsyncStorage.setItem(CHAVE_PREFERENCIA_TEMA, String(novoValor));
  };

  const cores = temaEscuroAtivo ? temaEscuro : temaClaro;

  if (!carregado) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ cores, temaEscuroAtivo, alternarTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTema = () => {
  const contexto = useContext(ThemeContext);
  if (!contexto) {
    throw new Error('useTema precisa ser usado dentro de um ThemeProvider');
  }
  return contexto;
};