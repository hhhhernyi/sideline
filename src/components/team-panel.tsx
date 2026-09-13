import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { CardShadow, Spacing } from '@/constants/theme';

type Props = {
  name: string;
  onNameChange: (name: string) => void;
  score: number;
  color: string;
  onPickColor: () => void;
  increments: number[];
  onScore: (delta: number) => void;
};

export function TeamPanel({
  name,
  onNameChange,
  score,
  color,
  onPickColor,
  increments,
  onScore,
}: Props) {
  return (
    <View style={[styles.panel, CardShadow, { backgroundColor: color }]}>
      <View style={styles.header}>
        {/* Balances the palette button so the name centres on the panel, not on what is left. */}
        <View style={styles.headerSpacer} />
        <TextInput
          value={name}
          onChangeText={(text) => onNameChange(text.replace(/\n/g, ''))}
          style={styles.name}
          maxLength={24}
          multiline
          selectTextOnFocus
          autoCapitalize="characters"
          submitBehavior="blurAndSubmit"
          returnKeyType="done"
          placeholder="Team"
          placeholderTextColor="rgba(255,255,255,0.55)"
        />
        <Pressable style={styles.paletteBtn} onPress={onPickColor} hitSlop={12}>
          <MaterialCommunityIcons name="palette" size={22} color="rgba(255,255,255,0.9)" />
        </Pressable>
      </View>
      <Pressable style={styles.scoreArea} onPress={() => onScore(increments[0])}>
        <Text style={styles.score} adjustsFontSizeToFit numberOfLines={1}>
          {score}
        </Text>
      </Pressable>
      <View style={styles.buttons}>
        {increments.map((n) => (
          <Pressable key={n} style={styles.btn} onPress={() => onScore(n)}>
            <Text style={styles.btnText}>+{n}</Text>
          </Pressable>
        ))}
        <Pressable style={styles.btn} onPress={() => onScore(-1)}>
          <Text style={styles.btnText}>−1</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, borderRadius: 20, padding: Spacing.md, alignItems: 'center' },
  header: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'flex-start' },
  headerSpacer: { width: 30 },
  name: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: Spacing.xs,
    // `multiline` lets a long name wrap instead of being cut off at the panel edge.
    // No letterSpacing: on iOS it adds a trailing advance per character that pushes the last
    // one outside the field's measured width, so "TEST" renders as "TES".
    // No textTransform either - autoCapitalize uppercases the value itself, which keeps what
    // is stored and what is drawn the same string.
  },
  paletteBtn: { padding: Spacing.xs },
  scoreArea: { flex: 1, justifyContent: 'center', alignSelf: 'stretch', alignItems: 'center' },
  score: { color: '#FFFFFF', fontSize: 120, fontWeight: '800', fontVariant: ['tabular-nums'] },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.sm },
  btn: {
    minWidth: 56,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  btnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
});
