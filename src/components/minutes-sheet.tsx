import { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';

import { CardShadow, Spacing } from '@/constants/theme';
import { useKeyboardHeight } from '@/hooks/use-keyboard';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  visible: boolean;
  title: string;
  /** Quick choices, in minutes. */
  options: number[];
  /** Shown in front of each number - "+" for added time, nothing for a period length. */
  prefix?: string;
  /** The minutes currently in force, so the sheet marks what it is changing. */
  current: number;
  /** Offer a Clear that selects nothing. Added time can be taken back; a period cannot be zero. */
  allowClear?: boolean;
  onSelect: (minutes: number) => void;
  onClose: () => void;
};

/**
 * Sheet for picking a number of minutes - added time, or how long a period runs.
 *
 * The value is a total, not an increment: picking 3 twice means three minutes, not six. That
 * matches how added time is actually signalled, one board saying "+3".
 *
 * An in-tree overlay rather than a `Modal`, for the same reason as the colour picker: iOS
 * throws when a modal's `supportedOrientations` shares nothing with the app, and this app is
 * locked to landscape.
 */
export function MinutesSheet({
  visible,
  title,
  options,
  prefix = '',
  current,
  allowClear = false,
  onSelect,
  onClose,
}: Props) {
  const c = useTheme();
  const keyboard = useKeyboardHeight();
  const { height: screen } = useWindowDimensions();
  const [other, setOther] = useState('');
  const scroller = useRef<ScrollView>(null);

  // The field is the last thing in the card, so scrolling to the end is what brings it into
  // view once the numpad has taken the bottom of the screen.
  useEffect(() => {
    if (keyboard > 0) scroller.current?.scrollToEnd({ animated: true });
  }, [keyboard]);

  if (!visible) return null;

  // Lifted clear of the keyboard rather than centred behind it - see the notes sheet.
  const room = screen - keyboard - Spacing.lg * 2;

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
    <Pressable
      style={[styles.backdrop, keyboard > 0 ? styles.backdropLifted : null]}
      onPress={onClose}>
      <Pressable
        style={[styles.card, CardShadow, { backgroundColor: c.card, maxHeight: room }]}
        onPress={() => {}}>
        {/* Scrolls rather than spilling: with the numpad up there is not always room for the
            whole card, and a View would simply draw its children outside the rounded box.
            `handled` keeps a tap on an option working first time while the numpad is open. */}
        <ScrollView
          ref={scroller}
          style={styles.scroll}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <Text style={[styles.title, { color: c.text }]}>{title}</Text>

          <View style={styles.row}>
            {options.map((minutes) => (
              <Pressable
                key={minutes}
                onPress={() => onSelect(minutes)}
                hitSlop={6}
                style={[
                  styles.quick,
                  { backgroundColor: c.background },
                  minutes === current && { borderColor: c.text, borderWidth: 3 },
                ]}>
                <Text style={[styles.quickText, { color: c.text }]}>
                  {prefix}
                  {minutes}
                </Text>
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
            {allowClear && current > 0 ? (
              <Pressable
                onPress={() => onSelect(0)}
                hitSlop={6}
                style={[styles.clear, { backgroundColor: c.background }]}>
                <Text style={[styles.quickText, { color: c.textSecondary }]}>Clear</Text>
              </Pressable>
            ) : null}
          </View>
        </ScrollView>
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
  backdropLifted: { justifyContent: 'flex-start' },
  card: { borderRadius: 24, padding: Spacing.lg, maxWidth: 520 },
  scroll: { flexGrow: 0 },
  content: { gap: Spacing.md },
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
