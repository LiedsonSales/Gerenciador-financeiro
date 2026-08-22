import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_PREMIUM_DEBUG = 'debug_premium_status';

const PremiumContext = createContext(null);

export const PremiumProvider = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    const carregarStatus = async () => {
      try {
        // TODO (Etapa D): substituir por verificação real via RevenueCat (Purchases.getCustomerInfo())
        const valor = await AsyncStorage.getItem(CHAVE_PREMIUM_DEBUG);
        setIsPremium(valor === 'true');
      } catch (erro) {
        console.log('Erro ao carregar status premium:', erro);
      } finally {
        setCarregado(true);
      }
    };
    carregarStatus();
  }, []);

  // DEBUG: simula compra/cancelamento. Será substituído pelo fluxo real de compra na Etapa D.
  const alternarPremiumDebug = async () => {
    const novoValor = !isPremium;
    setIsPremium(novoValor);
    await AsyncStorage.setItem(CHAVE_PREMIUM_DEBUG, String(novoValor));
  };

  if (!carregado) {
    return null;
  }

  return (
    <PremiumContext.Provider value={{ isPremium, alternarPremiumDebug }}>
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const contexto = useContext(PremiumContext);
  if (!contexto) {
    throw new Error('usePremium precisa ser usado dentro de um PremiumProvider');
  }
  return contexto;
};