import { Platform, type ViewStyle } from 'react-native';

export const Colors = {
  text: '#2B2D33',
  textSecondary: '#7A7E88',
  background: '#FAF7F2', // warm off-white
  card: '#FFFFFF',
  header: '#EFE7D8', // solid sand band behind screen titles
  headerBorder: '#E1D6C0',
  cardPressed: '#F3EFE8',
  home: '#7FA8E8', // pastel blue
  away: '#F09A9A', // pastel red
  accent: '#8FD3A8', // pastel green
} as const;

/**
 * Swatches offered by the team colour picker. The first two are the home/away defaults, and
 * every one is mid-toned enough that the white score on top of it stays readable.
 */
export const TeamColors = [
  '#7FA8E8', // blue
  '#F09A9A', // red
  '#7FC59A', // green
  '#E8B45C', // amber
  '#A892DC', // purple
  '#5FC2BA', // teal
  '#E28AB0', // pink
  '#8E9AAF', // slate
] as const;

export type ThemeColors = { [K in keyof typeof Colors]: string };

export const Fonts = Platform.select({
  ios: { sans: 'system-ui', mono: 'ui-monospace' },
  default: { sans: 'normal', mono: 'monospace' },
});

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Soft card shadow. `boxShadow` covers iOS/web; `elevation` is the Android fallback. */
export const CardShadow: ViewStyle = {
  boxShadow: '0 6px 18px rgba(60, 50, 30, 0.10)',
  elevation: 4,
};
