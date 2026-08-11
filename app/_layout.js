import { Stack } from 'expo-router';
import { cores } from '../constants/theme';

const opcoesComuns = {
  headerStyle: { backgroundColor: cores.fundo },
  headerShadowVisible: false,
  headerTintColor: cores.primaria,
  headerTitleStyle: { color: cores.textoPrimario, fontWeight: '700' },
};

export default function Layout() {
  return (
    <Stack screenOptions={opcoesComuns}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="adicionar" options={{ title: 'Adicionar Gasto' }} />
      <Stack.Screen name="resumo" options={{ headerShown: false }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhe' }} />
      <Stack.Screen name="historico" options={{ headerShown: false }} />
      <Stack.Screen name="estatisticas" options={{ headerShown: false }} />
      <Stack.Screen name="historico-mensal" options={{ headerShown: false }} />
      <Stack.Screen name="todos-gastos" options={{ headerShown: false }} />
    </Stack>
  );
}