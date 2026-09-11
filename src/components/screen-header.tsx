import { StyleSheet, Text, View } from 'react-native';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
};

/** Full-bleed title band that sets the screen heading apart from the body below it. */
export function ScreenHeader({ title }: Props) {
  const c = useTheme();

  return (
    <View style={[styles.band, { backgroundColor: c.header, borderBottomColor: c.headerBorder }]}>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
});
