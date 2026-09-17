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
          paddingLeft: insets.left + Spacing.md,
          paddingRight: insets.right + Spacing.md,
        },
      ]}>
      <Text style={[styles.title, { color: c.text }]}>{title}</Text>
      {action ? (
        <View
          // In landscape the screen's rounded corner and the notch both live out at this edge,
          // so the control is held off it by the inset plus a gap of its own.
          style={[styles.action, { right: insets.right + Spacing.lg, bottom: Spacing.lg }]}
          pointerEvents="box-none">
          {action}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  action: { position: 'absolute', alignItems: 'flex-end', justifyContent: 'center' },
});
