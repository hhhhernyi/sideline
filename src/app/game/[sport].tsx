import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReducer } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TeamPanel } from '@/components/team-panel';
import { getSport } from '@/constants/sports';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { gameReducer, initialGame } from '@/lib/game';

/** Back and Reset are the same shape, so the longer label sets the width for both. */
const NAV_BTN_WIDTH = 132;

export default function GameScreen() {
  const { sport: sportId } = useLocalSearchParams<{ sport: string }>();
  const sport = getSport(sportId);
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [game, dispatch] = useReducer(gameReducer, initialGame);

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
          // In landscape the notch moves to the side, so insets.top is ~0 and the top bar
          // ends up jammed against the top edge. Keep a floor under it.
          paddingTop: Math.max(insets.top, Spacing.md) + Spacing.sm,
          paddingBottom: insets.bottom + Spacing.sm,
          paddingLeft: insets.left + Spacing.md,
          paddingRight: insets.right + Spacing.md,
        },
      ]}>
      <View style={styles.topBar}>
        <Pressable
          style={[styles.navBtn, CardShadow, { backgroundColor: c.card }]}
          onPress={() => router.back()}
          hitSlop={12}>
          <Text style={[styles.navText, { color: c.text }]}>‹ Sports</Text>
        </Pressable>
        <Text style={[styles.title, { color: c.textSecondary }]}>{sport.name}</Text>
        <Pressable
          style={[styles.navBtn, CardShadow, { backgroundColor: c.card }]}
          onPress={() => dispatch({ type: 'reset' })}
          hitSlop={12}>
          <Text style={[styles.navText, { color: c.text }]}>Reset</Text>
        </Pressable>
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, gap: Spacing.sm },
  topBar: { flexDirection: 'row', alignItems: 'center' },
  navBtn: {
    width: NAV_BTN_WIDTH,
    paddingVertical: Spacing.sm + Spacing.xs,
    borderRadius: 999,
    alignItems: 'center',
  },
  navText: { fontSize: 17, fontWeight: '700' },
  // Takes the space between the two buttons, so the sport name stays centred on the screen.
  title: { flex: 1, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  teams: { flex: 1, flexDirection: 'row', gap: Spacing.md },
});
