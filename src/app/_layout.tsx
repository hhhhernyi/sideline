import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Colors } from '@/constants/theme';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: Colors.background, card: Colors.background, text: Colors.text },
};

// No native headers anywhere: the picker has its own title band and the scoreboard its own top
// bar, both of which need the full width. Orientation is locked app-wide in app.json.
export default function RootLayout() {
  return (
    // The root has to be here for gesture-driven rows to receive touches - swipe-to-delete in
    // history goes dead without it, silently.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="dark" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
