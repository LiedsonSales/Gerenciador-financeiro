import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{title: 'Meus Gastos'}}/>
            <Stack.Screen name="adicionar" options={{title: 'Adiconar gastos'}}/>
        </Stack>
    );
}