import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  title: string;
  /** Optional control pinned to the right of the band. Laid out over the title, not beside it,
   *  so the title stays centred on the screen whatever the control's width. */
  action?: ReactNode;
};

/** Full-bleed title band that sets the screen heading apart from the body below it. */
export function ScreenHeader({ title, action }: Props) {
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
      {action ? (
        <View style={[styles.action, { bottom: Spacing.lg }]} pointerEvents="box-none">
          {action}
        </View>
      ) : null}
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
  action: { position: 'absolute', right: Spacing.md, alignItems: 'flex-end', justifyContent: 'center' },
});
