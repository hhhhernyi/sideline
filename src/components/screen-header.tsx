import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const TITLE_SIZE = 28;
/**
 * The title's line box, and so the height of anything sitting beside it. Pinned rather than
 * left to the font, so a control can match it exactly - a button even slightly taller than the
 * text reads as floating above the line rather than sitting on it.
 */
export const HEADER_ACTION_HEIGHT = 34;

type Props = {
  title: string;
  /** Optional control on the right of the band, centred on the title's line. Give it a height
   *  of `HEADER_ACTION_HEIGHT` so the two line up. */
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
          // In landscape the notch sits out at one of these edges and the rounded corner at
          // both, so the band's contents start inside the insets.
          paddingLeft: insets.left + Spacing.md,
          paddingRight: insets.right + Spacing.md,
        },
      ]}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: c.text }]}>{title}</Text>
        {action ? (
          // Laid over the row rather than beside it, so the title stays centred on the screen
          // whatever the control's width, and stretched to the row so the control centres on
          // the same line as the text.
          <View style={styles.action} pointerEvents="box-none">
            {action}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    paddingBottom: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  titleRow: { justifyContent: 'center' },
  title: {
    fontSize: TITLE_SIZE,
    lineHeight: HEADER_ACTION_HEIGHT,
    fontWeight: '800',
    textAlign: 'center',
  },
  action: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: Spacing.sm,
    justifyContent: 'center',
  },
});
