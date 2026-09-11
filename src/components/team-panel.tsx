import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CardShadow, Spacing } from '@/constants/theme';

type Props = {
  label: string;
  score: number;
  color: string;
  increments: number[];
  onScore: (delta: number) => void;
};

export function TeamPanel({ label, score, color, increments, onScore }: Props) {
  return (
    <View style={[styles.panel, CardShadow, { backgroundColor: color }]}>
      <Text style={styles.label}>{label}</Text>
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
  label: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
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
