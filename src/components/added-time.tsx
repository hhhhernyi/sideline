import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** What the fourth official's board almost always says. Anything else goes in the field. */
const QUICK = [1, 2, 3, 4, 5];

type Props = {
  visible: boolean;
  /** Minutes already signalled for this period, so the sheet shows what it is changing. */
  current: number;
  onSelect: (minutes: number) => void;
  onClose: () => void;
};

/**
 * Sheet for signalling added time.
 *
 * The amount is a total, not an increment - the board goes up once saying "+3", it does not
 * get tapped three times - so picking 3 twice still means three minutes.
 *
 * An in-tree overlay rather than a `Modal`, for the same reason as the colour picker: iOS
 * throws when a modal's `supportedOrientations` shares nothing with the app, and this app is
 * locked to landscape.
 */
export function AddedTime({ visible, current, onSelect, onClose }: Props) {
  const c = useTheme();
  const [other, setOther] = useState('');

  if (!visible) return null;

  const submitOther = () => {
    const minutes = Number.parseInt(other, 10);
    setOther('');
    // Ignore anything that is not a sane number of minutes rather than showing an error for
    // what can only be a mistyped entry.
    if (Number.isFinite(minutes) && minutes > 0 && minutes <= 99) onSelect(minutes);
    else onClose();
  };

  return (
    // Tapping anywhere off the card dismisses, so the sheet needs no cancel button.
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Pressable style={[styles.card, CardShadow, { backgroundColor: c.card }]} onPress={() => {}}>
        <Text style={[styles.title, { color: c.text }]}>Added time</Text>

        <View style={styles.row}>
          {QUICK.map((minutes) => (
            <Pressable
              key={minutes}
              onPress={() => onSelect(minutes)}
              hitSlop={6}
              style={[
                styles.quick,
                { backgroundColor: c.background },
                minutes === current && { borderColor: c.text, borderWidth: 3 },
              ]}>
              <Text style={[styles.quickText, { color: c.text }]}>+{minutes}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.row}>
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
          {current > 0 ? (
            <Pressable
              onPress={() => onSelect(0)}
              hitSlop={6}
              style={[styles.clear, { backgroundColor: c.background }]}>
              <Text style={[styles.quickText, { color: c.textSecondary }]}>Clear</Text>
            </Pressable>
          ) : null}
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
  card: { borderRadius: 24, padding: Spacing.lg, gap: Spacing.md, maxWidth: 520 },
  title: { fontSize: 17, fontWeight: '700', textAlign: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm },
  quick: { width: 64, height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  quickText: { fontSize: 18, fontWeight: '800' },
  other: {
    width: 110,
    height: 52,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  clear: {
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
