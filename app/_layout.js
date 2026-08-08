import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Meus Gastos' }} />
      <Stack.Screen name="adicionar" options={{ title: 'Adicionar Gasto' }} />
      <Stack.Screen name="resumo" options={{ title: 'Resumo' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhe' }} />
      <Stack.Screen name="historico" options={{ title: 'Histórico' }} />
      <Stack.Screen name="estatisticas" options={{ title: 'Estatísticas' }} />
      <Stack.Screen name="historico-mensal" options={{ title: 'Histórico Mensal' }} />
    </Stack>
  );
}