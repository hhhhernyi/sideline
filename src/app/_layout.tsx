import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '@/constants/theme';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background, card: Colors.background, text: Colors.text },
};

// Orientation is locked app-wide in app.json, so no screen sets it.
export default function RootLayout() {
  return (
    <ThemeProvider value={theme}>
      <Stack screenOptions={{ headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ title: 'Sideline' }} />
        <Stack.Screen name="game/[sport]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}
