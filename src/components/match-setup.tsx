import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { clockLabel } from '@/lib/game';

/** How a match can be split. One is a straight game - no breaks, no periods to name. */
const SPLITS = [
  { periods: 1, label: 'Straight' },
  { periods: 2, label: 'Halves' },
  { periods: 4, label: 'Quarters' },
];

type Props = {
  visible: boolean;
  periods: number;
  minutes: number;
  /** Lengths the sport suggests, alongside a typed-in number. */
  lengths: number[];
  onChange: (next: { periods: number; minutes: number }) => void;
  onClose: () => void;
};

/**
 * Sheet for how this match is played: split into halves or quarters or not at all, and how
 * long each part runs.
 *
 * Both are the user's, not the sport's. A rec game is whatever the court is booked for, and
 * plenty of them are one straight run of the clock with the sides swapping whenever they feel
 * like it - so "Straight" is a first-class choice, not an absence of one.
 *
 * An in-tree overlay rather than a `Modal`, for the same reason as the colour picker: iOS
 * throws when a modal's `supportedOrientations` shares nothing with the app, and this app is
 * locked to landscape.
 */
export function MatchSetup({ visible, periods, minutes, lengths, onChange, onClose }: Props) {
  const c = useTheme();
  const [other, setOther] = useState('');

  if (!visible) return null;

  const submitOther = () => {
    const typed = Number.parseInt(other, 10);
    setOther('');
    // Ignore anything that is not a sane number of minutes rather than showing an error for
    // what can only be a mistyped entry.
    if (Number.isFinite(typed) && typed > 0 && typed <= 99) onChange({ periods, minutes: typed });
    else onClose();
  };

  return (
    // Tapping anywhere off the card dismisses, so the sheet needs no cancel button.
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Pressable style={[styles.card, CardShadow, { backgroundColor: c.card }]} onPress={() => {}}>
        <Text style={[styles.heading, { color: c.textSecondary }]}>Play it as</Text>
        <View style={styles.row}>
          {SPLITS.map((split) => (
            <Pressable
              key={split.periods}
              onPress={() => onChange({ periods: split.periods, minutes })}
              hitSlop={6}
              style={[
                styles.wide,
                { backgroundColor: c.background },
                split.periods === periods && { borderColor: c.text, borderWidth: 3 },
              ]}>
              <Text style={[styles.optionText, { color: c.text }]}>{split.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.textSecondary }]}>
          {periods === 1 ? 'Match length' : `${clockLabel(periods)} length`}
        </Text>
        <View style={styles.row}>
          {lengths.map((value) => (
            <Pressable
              key={value}
              onPress={() => onChange({ periods, minutes: value })}
              hitSlop={6}
              style={[
                styles.quick,
                { backgroundColor: c.background },
                value === minutes && { borderColor: c.text, borderWidth: 3 },
              ]}>
              <Text style={[styles.optionText, { color: c.text }]}>{value}</Text>
            </Pressable>
          ))}
          <TextInput
            value={other}
            onChangeText={(text) => setOther(text.replace(/[^0-9]/g, ''))}
            onSubmitEditing={submitOther}
            style={[styles.other, { backgroundColor: c.background, color: c.text }]}
            keyboardType="number-pad"
            maxLength={2}
            returnKeyType="done"
            submitBehavior="blurAndSubmit"
            placeholder="Other"
            placeholderTextColor={c.textSecondary}
          />
        </View>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 26, 20, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: { borderRadius: 24, padding: Spacing.lg, gap: Spacing.sm, maxWidth: 560 },
  heading: { fontSize: 13, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5 },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  wide: {
    minWidth: 112,
    height: 52,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quick: { width: 60, height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  optionText: { fontSize: 17, fontWeight: '800' },
  other: {
    width: 96,
    height: 52,
    borderRadius: 999,
    paddingHorizontal: Spacing.sm,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
});
