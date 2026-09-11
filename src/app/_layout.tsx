import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background, card: Colors.background, text: Colors.text },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ title: 'Sideline', orientation: 'default' }} />
        <Stack.Screen name="game/[sport]" options={{ headerShown: false, orientation: 'landscape' }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
