import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useReducer, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorPicker } from '@/components/color-picker';
import { TeamPanel } from '@/components/team-panel';
import { getSport } from '@/constants/sports';
import { CardShadow, Colors, Spacing, TeamColors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useWhistle } from '@/hooks/use-whistle';
import {
  initialMatch,
  matchReducer,
  matchWinner,
  periodName,
  periodOver,
  periodsWon,
  totals,
  type MatchAction,
  type MatchFormat,
  type MatchState,
  type Team,
} from '@/lib/game';

/** Back and Reset are the same shape, so the longer label sets the width for both. */
const NAV_BTN_WIDTH = 132;
const NAV_BTN_HEIGHT = 46;

/** Stands in for an unknown sport so the hooks below stay unconditional. Never rendered. */
const NO_FORMAT: MatchFormat = { decidedBy: 'clock', count: 1, minutes: 0, label: 'Period' };

type TeamMeta = { name: string; color: string };

export default function GameScreen() {
  const { sport: sportId } = useLocalSearchParams<{ sport: string }>();
  const sport = getSport(sportId);
  const format = sport?.format ?? NO_FORMAT;
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const whistle = useWhistle();
  const [match, dispatch] = useReducer(
    useCallback((s: MatchState, a: MatchAction) => matchReducer(s, a, format), [format]),
    undefined,
    () => initialMatch(),
  );

  // Names and colours are the user's setup for the match, not part of the score, so Reset
  // leaves them alone and they live outside the reducer.
  const [teams, setTeams] = useState<Record<Team, TeamMeta>>({
    home: { name: 'Home', color: Colors.home },
    away: { name: 'Away', color: Colors.away },
  });
  const [picking, setPicking] = useState<Team | null>(null);

  const editTeam = (team: Team, patch: Partial<TeamMeta>) =>
    setTeams((prev) => ({ ...prev, [team]: { ...prev[team], ...patch } }));

  const winner = matchWinner(match, format);
  const bySets = format.decidedBy === 'sets';
  const setOver = periodOver(match, format);
  // A set sport shows the set in play; a clocked one shows the match, because a soccer board
  // reads 2-1 overall and never 1-0 for this half.
  const shown = bySets ? match.periods[match.current] : totals(match);
  const sets = periodsWon(match, format);
  const locked = winner !== null || (bySets && setOver);

  const score = (team: Team, delta: number) => {
    // Once the period or match is decided, stop adding points - but let -1 through, so a
    // mis-tap that ended it early can still be taken back.
    if (locked && delta > 0) return;
    // Taking a point back should not feel the same as scoring one, so the two use different
    // impacts. Fire and forget - haptics are unavailable on some devices and all of the web,
    // and a missing buzz is never worth failing a score on.
    Haptics.impactAsync(
      delta > 0 ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Rigid,
    ).catch(() => {});
    dispatch({ type: 'score', team, delta });
  };

  // What the period control does next, or null when there is nothing to advance to: a set
  // still in play, or a match already over.
  const advance = (() => {
    if (winner || match.endedAt) return null;
    if (bySets) return setOver ? `Next ${format.label}` : null;
    const last = match.current >= format.count - 1;
    return last ? 'Finish' : `End ${format.label}`;
  })();

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
          <Text
            style={[
              styles.title,
              winner ? styles.titleWon : null,
              { color: winner ? c.text : c.textSecondary },
            ]}
            numberOfLines={1}>
            {winner
              ? `${teams[winner].name} wins${bySets ? ` ${sets.home}-${sets.away}` : ''}`
              : bySets
                ? `${periodName(format, match.current)} · ${sets.home}-${sets.away}`
                : `${sport.name} · ${periodName(format, match.current)}`}
          </Text>
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
              score={shown[team]}
              color={teams[team].color}
              onPickColor={() => setPicking(team)}
              increments={sport.increments}
              onScore={(delta) => score(team, delta)}
              locked={locked}
              won={winner === team}
            />
          ))}
        </View>

        <View style={styles.footer}>
          {advance ? (
            <Pressable
              style={[styles.periodBtn, CardShadow, { backgroundColor: c.card }]}
              onPress={() => dispatch({ type: 'advance' })}
              hitSlop={12}>
              <Text style={[styles.periodText, { color: c.text }]}>{advance}</Text>
            </Pressable>
          ) : null}
          {/* Hold to sustain the blast. Safe to use Pressable's function form here - this one
              is not inside a Link asChild, where Slot would spread the function away. */}
          <Pressable
            style={({ pressed }) => [
              styles.whistleBtn,
              CardShadow,
              { backgroundColor: c.accent, transform: [{ scale: pressed ? 0.97 : 1 }] },
            ]}
            onPressIn={whistle.start}
            onPressOut={whistle.stop}
            hitSlop={16}>
            <MaterialCommunityIcons name="whistle" size={26} color={c.text} />
            <Text style={[styles.whistleText, { color: c.text }]}>HOLD</Text>
          </Pressable>
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
  navText: { fontSize: 17, fontWeight: '700' },
  // Takes the space between the buttons, so the sport name stays centred on the screen.
  title: { flex: 1, fontSize: 16, fontWeight: '600', textAlign: 'center' },
  titleWon: { fontSize: 18, fontWeight: '800' },
  teams: { flex: 1, flexDirection: 'row', gap: Spacing.md },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  periodBtn: {
    minWidth: 150,
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  whistleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    minWidth: 200,
    height: 52,
    paddingHorizontal: Spacing.xl,
    borderRadius: 999,
  },
  whistleText: { fontSize: 15, fontWeight: '800', letterSpacing: 1 },
});
