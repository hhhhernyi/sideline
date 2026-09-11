import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { OrientationLock } from 'expo-screen-orientation';
import { useReducer } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TeamPanel } from '@/components/team-panel';
import { getSport } from '@/constants/sports';
import { CardShadow, Spacing } from '@/constants/theme';
import { useOrientationLock } from '@/hooks/use-orientation';
import { useTheme } from '@/hooks/use-theme';
import { gameReducer, initialGame } from '@/lib/game';

export default function GameScreen() {
  const { sport: sportId } = useLocalSearchParams<{ sport: string }>();
  const sport = getSport(sportId);
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [game, dispatch] = useReducer(gameReducer, initialGame);
  useOrientationLock(OrientationLock.LANDSCAPE);

  if (!sport) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.text }}>Unknown sport.</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: c.background,
          paddingTop: insets.top + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.sm,
          paddingLeft: insets.left + Spacing.md,
          paddingRight: insets.right + Spacing.md,
        },
      ]}>
      <Stack.Screen options={{ title: sport.name, headerShown: false }} />

      <View style={styles.topBar}>
        <Pressable style={[styles.backBtn, CardShadow, { backgroundColor: c.card }]} onPress={() => router.back()} hitSlop={8}>
          <Text style={[styles.backText, { color: c.text }]}>‹ Sports</Text>
        </Pressable>
        <Text style={[styles.title, { color: c.textSecondary }]}>{sport.name}</Text>
      </View>

      <View style={styles.teams}>
        <TeamPanel
          label="Home"
          score={game.home}
          color={c.home}
          increments={sport.increments}
          onScore={(delta) => dispatch({ type: 'score', team: 'home', delta })}
        />
        <TeamPanel
          label="Away"
          score={game.away}
          color={c.away}
          increments={sport.increments}
          onScore={(delta) => dispatch({ type: 'score', team: 'away', delta })}
        />
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.footerBtn, CardShadow, { backgroundColor: c.card }]} onPress={() => dispatch({ type: 'undo' })}>
          <Text style={[styles.footerText, { color: c.text }]}>Undo</Text>
        </Pressable>
        <Pressable
          style={[styles.footerBtn, CardShadow, { backgroundColor: c.card }]}
          onPress={() => dispatch({ type: 'nextPeriod' })}
          disabled={game.period >= sport.periods}>
          <Text style={[styles.footerText, { color: c.text }]}>
            {sport.periodLabel} {game.period}/{sport.periods}
          </Text>
        </Pressable>
        <Pressable style={[styles.footerBtn, CardShadow, { backgroundColor: c.card }]} onPress={() => dispatch({ type: 'reset' })}>
          <Text style={[styles.footerText, { color: c.text }]}>Reset</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: Spacing.sm },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  backBtn: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, borderRadius: 999 },
  backText: { fontSize: 15, fontWeight: '700' },
  title: { fontSize: 15, fontWeight: '600' },
  teams: { flex: 1, flexDirection: 'row', gap: Spacing.md },
  footer: { flexDirection: 'row', gap: Spacing.sm },
  footerBtn: { flex: 1, paddingVertical: Spacing.sm, borderRadius: 12, alignItems: 'center' },
  footerText: { fontSize: 15, fontWeight: '600' },
});
