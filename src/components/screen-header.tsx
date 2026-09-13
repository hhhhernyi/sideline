import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
};

/** Full-bleed title band that sets the screen heading apart from the body below it. */
export function ScreenHeader({ title }: Props) {
  const c = useTheme();
  // This band is the top of the screen now that there is no native header above it, so it owns
  // clearing the status bar itself.
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.band,
        {
          backgroundColor: c.header,
          borderBottomColor: c.headerBorder,
          paddingTop: insets.top + Spacing.lg,
        },
      ]}>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
});
