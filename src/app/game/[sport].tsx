import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReducer, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorPicker } from '@/components/color-picker';
import { TeamPanel } from '@/components/team-panel';
import { getSport } from '@/constants/sports';
import { CardShadow, Colors, Spacing, TeamColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWhistle } from '@/hooks/use-whistle';
import { gameReducer, initialGame, type Team } from '@/lib/game';

/** Back and Reset are the same shape, so the longer label sets the width for both. */
const NAV_BTN_WIDTH = 132;
const NAV_BTN_HEIGHT = 46;

type TeamMeta = { name: string; color: string };

export default function GameScreen() {
  const { sport: sportId } = useLocalSearchParams<{ sport: string }>();
  const sport = getSport(sportId);
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const blowWhistle = useWhistle();
  const [game, dispatch] = useReducer(gameReducer, initialGame);

  // Names and colours are the user's setup for the match, not part of the score, so Reset
  // leaves them alone and they live outside the reducer.
  const [teams, setTeams] = useState<Record<Team, TeamMeta>>({
    home: { name: 'Home', color: Colors.home },
    away: { name: 'Away', color: Colors.away },
  });
  const [picking, setPicking] = useState<Team | null>(null);

  const editTeam = (team: Team, patch: Partial<TeamMeta>) =>
    setTeams((prev) => ({ ...prev, [team]: { ...prev[team], ...patch } }));

  if (!sport) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.text }}>Unknown sport.</Text>
      </View>
    );
  }

  return (
    // The picker overlay is a sibling of the padded content so it can cover the full screen,
    // including the safe-area padding - absolute children are laid out inside the padding box.
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <View
        style={[
          styles.screen,
          {
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
            style={[styles.iconBtn, CardShadow, { backgroundColor: c.accent }]}
            onPress={blowWhistle}
            hitSlop={12}>
            <MaterialCommunityIcons name="whistle" size={24} color={c.text} />
          </Pressable>
          <Pressable
            style={[styles.navBtn, CardShadow, { backgroundColor: c.card }]}
            onPress={() => dispatch({ type: 'reset' })}
            hitSlop={12}>
            <Text style={[styles.navText, { color: c.text }]}>Reset</Text>
          </Pressable>
        </View>

        <View style={styles.teams}>
          {(['home', 'away'] as const).map((team) => (
            <TeamPanel
              key={team}
              name={teams[team].name}
              onNameChange={(name) => editTeam(team, { name })}
              score={game[team]}
              color={teams[team].color}
              onPickColor={() => setPicking(team)}
              increments={sport.increments}
              onScore={(delta) => dispatch({ type: 'score', team, delta })}
            />
          ))}
        </View>

      </View>

      <ColorPicker
        visible={picking !== null}
        title={picking ? `${teams[picking].name} colour` : ''}
        selected={picking ? teams[picking].color : TeamColors[0]}
        onSelect={(color) => {
          if (picking) editTeam(picking, { color });
          setPicking(null);
        }}
        onClose={() => setPicking(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1, gap: Spacing.sm },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  navBtn: {
    width: NAV_BTN_WIDTH,
    height: NAV_BTN_HEIGHT,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtn: {
    width: NAV_BTN_HEIGHT,
    height: NAV_BTN_HEIGHT,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: { fontSize: 17, fontWeight: '700' },
  // Takes the space between the buttons, so the sport name stays centred on the screen.
  title: { flex: 1, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  teams: { flex: 1, flexDirection: 'row', gap: Spacing.md },
});
