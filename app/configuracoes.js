import { View, Text, Pressable, StyleSheet, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { espacamento, tipografia, raio, sombra } from '../constants/theme';
import { useTema } from '../context/ThemeContext';
import { usePremium } from '../context/PremiumContext';

export default function Configuracoes() {
  const { cores, temaEscuroAtivo, alternarTema } = useTema();
  const { isPremium, alternarPremiumDebug } = usePremium();
  const styles = criarEstilos(cores);

  const handleAlternarTema = () => {
    if (!isPremium) {
      Alert.alert(
        'Recurso Premium',
        'O tema escuro está disponível apenas para assinantes Premium.',
        [{ text: 'Entendi', style: 'cancel' }]
      );
      return;
    }
    alternarTema();
  };

  const handleAssinar = () => {
    // TODO (Etapa D): abrir tela de planos / disparar fluxo de compra via RevenueCat
    Alert.alert('Em breve', 'A assinatura Premium estará disponível em breve.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Configurações</Text>

      <View style={[styles.cardPremium, sombra, isPremium && styles.cardPremiumAtivo]}>
        <View style={styles.linhaPremiumTopo}>
          <Ionicons
            name={isPremium ? 'star' : 'star-outline'}
            size={20}
            color={isPremium ? cores.branco : cores.primaria}
          />
          <Text style={[styles.statusPremiumTexto, isPremium && styles.statusPremiumTextoAtivo]}>
            {isPremium ? 'Você é Premium' : 'Versão Gratuita'}
          </Text>
        </View>
        <Text style={[styles.descricaoPremium, isPremium && styles.descricaoPremiumAtivo]}>
          {isPremium
            ? 'Obrigado por apoiar o app! Aproveite o tema escuro e a experiência sem anúncios.'
            : 'Desbloqueie o tema escuro e remova os anúncios com o Premium.'}
        </Text>
        {!isPremium && (
          <Pressable style={styles.botaoAssinar} onPress={handleAssinar}>
            <Text style={styles.botaoAssinarTexto}>Assinar Premium</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.secaoLabel}>Aparência</Text>
      <View style={styles.linhaOpcao}>
        <View style={styles.linhaOpcaoInfo}>
          <Ionicons name="moon" size={18} color={cores.textoSecundario} />
          <Text style={styles.linhaOpcaoTexto}>Tema escuro</Text>
          {!isPremium && <Ionicons name="lock-closed" size={13} color={cores.textoTerciario} style={{ marginLeft: 6 }} />}
        </View>
        <Switch
          value={temaEscuroAtivo}
          onValueChange={handleAlternarTema}
          trackColor={{ false: cores.borda, true: cores.primaria }}
          thumbColor={cores.branco}
        />
      </View>

      {__DEV__ && (
        <>
          <Text style={styles.secaoLabel}>Debug (visível só em desenvolvimento)</Text>
          <Pressable style={styles.linhaOpcao} onPress={alternarPremiumDebug}>
            <View style={styles.linhaOpcaoInfo}>
              <Ionicons name="bug" size={18} color={cores.textoSecundario} />
              <Text style={styles.linhaOpcaoTexto}>Simular status Premium</Text>
            </View>
            <Text style={styles.valorDebug}>{isPremium ? 'Ativo' : 'Inativo'}</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const criarEstilos = (cores) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: cores.fundo, paddingTop: espacamento.xxxl, paddingHorizontal: espacamento.xl },
    titulo: { ...tipografia.h1, color: cores.textoPrimario, marginBottom: espacamento.lg },

    cardPremium: {
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raio.xl,
      padding: espacamento.lg,
      marginBottom: espacamento.xl,
    },
    cardPremiumAtivo: {
      backgroundColor: cores.primaria,
      borderColor: cores.primaria,
    },
    linhaPremiumTopo: { flexDirection: 'row', alignItems: 'center', gap: espacamento.xs },
    statusPremiumTexto: { ...tipografia.h2, color: cores.textoPrimario },
    statusPremiumTextoAtivo: { color: cores.branco },
    descricaoPremium: { ...tipografia.body, color: cores.textoSecundario, marginTop: espacamento.xs },
    descricaoPremiumAtivo: { color: 'rgba(255,255,255,0.9)' },
    botaoAssinar: {
      backgroundColor: cores.primaria,
      borderRadius: raio.sm,
      paddingVertical: espacamento.md,
      alignItems: 'center',
      marginTop: espacamento.md,
    },
    botaoAssinarTexto: { color: cores.branco, fontWeight: '700', fontSize: 15 },

    secaoLabel: {
      ...tipografia.caption,
      fontWeight: '700',
      color: cores.textoTerciario,
      textTransform: 'uppercase',
      marginBottom: espacamento.sm,
    },
    linhaOpcao: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: cores.superficie,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: raio.md,
      paddingVertical: espacamento.md,
      paddingHorizontal: espacamento.lg,
      marginBottom: espacamento.xl,
    },
    linhaOpcaoInfo: { flexDirection: 'row', alignItems: 'center', gap: espacamento.sm },
    linhaOpcaoTexto: { ...tipografia.body, color: cores.textoPrimario },
    valorDebug: { ...tipografia.bodyBold, color: cores.primaria },
  });