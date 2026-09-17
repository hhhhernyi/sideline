import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** A note as the sheet shows it: what the board read, and what was written about it. */
export type NoteLine = { id: number; meta: string; text: string };

type Props = {
  visible: boolean;
  /** The score, period and clock right now - what a note logged this second would carry. */
  context: string;
  lines: NoteLine[];
  onAdd: (text: string) => void;
  onClose: () => void;
};

/**
 * The match log: write down what just happened, against the moment it happened.
 *
 * The context line is filled in from the board rather than typed, because the thing worth
 * capturing at 21-19 with the clock at 14:20 is the sentence, not the score - and by the time
 * anyone writes the sentence the score has usually moved on.
 *
 * An in-tree overlay rather than a `Modal`, for the same reason as the colour picker: iOS
 * throws when a modal's `supportedOrientations` shares nothing with the app, and this app is
 * locked to landscape.
 */
export function NotesSheet({ visible, context, lines, onAdd, onClose }: Props) {
  const c = useTheme();
  const [text, setText] = useState('');

  if (!visible) return null;

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setText('');
  };

  return (
    // Tapping anywhere off the card dismisses, so the sheet needs no cancel button.
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Pressable style={[styles.card, CardShadow, { backgroundColor: c.card }]} onPress={() => {}}>
        <Text style={[styles.context, { color: c.textSecondary }]}>{context}</Text>

        <View style={styles.entry}>
          <TextInput
            value={text}
            onChangeText={(next) => setText(next.replace(/\n/g, ''))}
            onSubmitEditing={submit}
            style={[styles.input, { backgroundColor: c.background, color: c.text }]}
            placeholder="What happened?"
            placeholderTextColor={c.textSecondary}
            maxLength={140}
            returnKeyType="done"
            submitBehavior="submit"
            autoFocus
          />
          <Pressable
            onPress={submit}
            hitSlop={6}
            style={[styles.add, { backgroundColor: text.trim() ? c.accent : c.background }]}>
            <Text style={[styles.addText, { color: text.trim() ? c.text : c.textSecondary }]}>
              Add
            </Text>
          </Pressable>
        </View>

        {lines.length > 0 ? (
          // Newest first: the note someone wants to re-read is almost always the last one.
          <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
            {[...lines].reverse().map((line) => (
              <View key={line.id} style={styles.line}>
                <Text style={[styles.lineMeta, { color: c.textSecondary }]}>{line.meta}</Text>
                <Text style={[styles.lineText, { color: c.text }]}>{line.text}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={[styles.empty, { color: c.textSecondary }]}>
            Nothing logged yet. Notes keep the score and the time they were written at.
          </Text>
        )}
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
  card: {
    borderRadius: 24,
    padding: Spacing.lg,
    gap: Spacing.sm,
    width: '86%',
    maxWidth: 620,
    // The list scrolls rather than pushing the card off a landscape screen.
    maxHeight: '90%',
  },
  context: { fontSize: 13, fontWeight: '800', textAlign: 'center', letterSpacing: 0.5 },
  entry: { flexDirection: 'row', gap: Spacing.sm },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    fontWeight: '600',
  },
  add: {
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontSize: 16, fontWeight: '800' },
  list: { flexGrow: 0 },
  listContent: { gap: Spacing.sm, paddingTop: Spacing.xs },
  line: { gap: 2 },
  lineMeta: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  lineText: { fontSize: 15, fontWeight: '600' },
  empty: { fontSize: 13, fontWeight: '600', textAlign: 'center', paddingVertical: Spacing.md },
});
