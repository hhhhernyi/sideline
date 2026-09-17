import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorPicker } from '@/components/color-picker';
import { MatchSetup } from '@/components/match-setup';
import { MinutesSheet } from '@/components/minutes-sheet';
import { NotesSheet, type NoteLine } from '@/components/notes-sheet';
import { TeamPanel } from '@/components/team-panel';
import { getSport } from '@/constants/sports';
import { CardShadow, Colors, Spacing, TeamColors } from '@/constants/theme';
import { useClock } from '@/hooks/use-clock';
import { useTheme } from '@/hooks/use-theme';
import { useWhistle } from '@/hooks/use-whistle';
import { formatClock, readClock } from '@/lib/clock';
import { saveMatch, type MatchRecord } from '@/lib/history';
import {
  casualFormat,
  clockLabel,
  initialMatch,
  matchReducer,
  matchWinner,
  periodName,
  periodOver,
  periodsWon,
  scoreHeadline,
  scoreParts,
  totals,
  type MatchAction,
  type MatchFormat,
  type MatchState,
  type Team,
} from '@/lib/game';

/** Back and Reset are the same shape, so the longer label sets the width for both. */
const NAV_BTN_WIDTH = 132;
const NAV_BTN_HEIGHT = 46;

/** What the fourth official's board almost always says. Anything else is typed in. */
const ADDED_TIME_OPTIONS = [1, 2, 3, 4, 5];

/** Long enough that a flurry of taps writes once, short enough to beat a swipe-up. */
const SAVE_DEBOUNCE_MS = 800;
/** How often a running clock files its length, for matches where nothing else is happening. */
const SAVE_TICK_MS = 30_000;

/** Stands in for an unknown sport so the hooks below stay unconditional. Never rendered. */
const NO_FORMAT: MatchFormat = {
  decidedBy: 'clock',
  count: 1,
  minutes: 0,
  lengths: [],
  countsDown: false,
};

type TeamMeta = { name: string; color: string };
type Sheet = 'setup' | 'added' | 'notes' | null;

export default function GameScreen() {
  const { sport: sportId } = useLocalSearchParams<{ sport: string }>();
  const sport = getSport(sportId);
  const base = sport?.format ?? NO_FORMAT;
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const whistle = useWhistle();

  // Names and colours are the user's setup for the match, not part of the score, so Reset
  // leaves them alone and they live outside the reducer.
  const [teams, setTeams] = useState<Record<Team, TeamMeta>>({
    home: { name: 'Home', color: Colors.home },
    away: { name: 'Away', color: Colors.away },
  });
  const [picking, setPicking] = useState<Team | null>(null);
  const [sheet, setSheet] = useState<Sheet>(null);
  /**
   * Whether this match is being played to the sport's real rules - sets, halves, quarters, a
   * clock that runs out - or casually, where the only structure is a clock counting up.
   */
  const [competitive, setCompetitive] = useState(false);
  // Where on the match clock the period in play began. The clock itself always times the whole
  // match, so the summary can say how long the thing took; a half is the slice since this mark.
  const [periodStart, setPeriodStart] = useState(0);
  /** Minutes of added time signalled for this period. */
  const [added, setAdded] = useState(0);
  /** How the match is split, and how long a part runs. The sport only suggests these. */
  const [periods, setPeriods] = useState(base.decidedBy === 'clock' ? base.count : 0);
  const [length, setLength] = useState(base.decidedBy === 'clock' ? base.minutes : 0);

  // The rules this match is actually played under: the sport's own, with this match's choices
  // folded in, or the same rules with the competition taken out. Everything downstream - the
  // reducer, the period names, the clock - reads this one shape.
  const format = useMemo<MatchFormat>(() => {
    if (!competitive) return casualFormat(base);
    return base.decidedBy === 'clock' ? { ...base, count: periods, minutes: length } : base;
  }, [base, competitive, periods, length]);

  const [match, dispatch] = useReducer(
    useCallback((s: MatchState, a: MatchAction) => matchReducer(s, a, format), [format]),
    undefined,
    () => initialMatch(),
  );

  const bySets = format.decidedBy === 'sets';
  const countsDown = format.decidedBy === 'clock' && format.countsDown;
  // Overtime periods sit past the match's own count, and run shorter than the parts before.
  const overtime = !bySets && competitive && match.current >= periods;
  const overtimeMinutes = format.decidedBy === 'clock' ? format.overtimeMinutes : undefined;
  // Casual play has no period to run out, so there is no length to run it to.
  const periodMinutes = !competitive || bySets ? 0 : overtime ? (overtimeMinutes ?? length) : length;

  // Where the clock stops. A half ends on 45:00 and stays there until added time is signalled;
  // a quarter ends on the buzzer. Casual play and sports played to a score have no limit -
  // their clock is just timing the session.
  const limit =
    periodMinutes > 0
      ? periodStart + (periodMinutes + (countsDown ? 0 : added)) * 60_000
      : undefined;
  const clock = useClock(limit);

  const editTeam = (team: Team, patch: Partial<TeamMeta>) =>
    setTeams((prev) => ({ ...prev, [team]: { ...prev[team], ...patch } }));

  const winner = matchWinner(match, format);
  const setOver = periodOver(match, format);
  // A set sport shows the set in play; a clocked one shows the match, because a soccer board
  // reads 2-1 overall and never 1-0 for this half.
  const shown = bySets ? match.periods[match.current] : totals(match);
  const locked = winner !== null || (bySets && setOver);
  const periodMs = bySets || !competitive ? clock.ms : clock.ms - periodStart;
  const reading = readClock(format, periodMs, periodMinutes, added);
  const total = totals(match);
  const sets = periodsWon(match, format);
  // Added time is there for the whole half, not just once 45:00 has come and gone. Time gets
  // lost at the injury, not at the whistle, and a referee tracking it wants somewhere to put it
  // while it is happening. Only a clock that counts up has anywhere to put it, and only once
  // the half is under way - before kick-off the footer belongs to the setup pill.
  const canAddTime =
    competitive &&
    !bySets &&
    !countsDown &&
    periodMinutes > 0 &&
    !match.endedAt &&
    (clock.running || periodMs > 0);
  // How the match is played is settled between periods, never mid-play, so the control is there
  // while the clock sits at zero and gone the moment it starts.
  const canSetUp = competitive && !bySets && !match.endedAt && periodMs === 0 && !clock.running;
  // Basketball has no draw: a level game at the final buzzer goes to another period.
  const canGoToOvertime =
    competitive && !bySets && !!overtimeMinutes && match.endedAt !== null && total.home === total.away;
  // The mode changes what a set or a half even is, so it is only switchable before anything has
  // happened - a half-played best-of-five has nowhere to go if the rules change underneath it.
  const untouched =
    match.periods.length === 1 &&
    match.periods[0].home === 0 &&
    match.periods[0].away === 0 &&
    clock.ms === 0 &&
    !clock.running;

  // The clock as the board is showing it, so a note logged now reads back the same figure -
  // for a counted-down quarter that is the time left, not the time played.
  const shownClockMs =
    countsDown && periodMinutes > 0 ? Math.max(0, periodMinutes * 60_000 - periodMs) : periodMs;

  /** "1st Half", "Set 2", or nothing at all when the match has no parts to name. */
  const partName = (index: number) => {
    if (!competitive) return '';
    if (bySets) return periodName(format, index);
    return periods > 1 || index >= periods ? periodName(format, index) : '';
  };

  const noteContext = [partName(match.current), `${shown.home}-${shown.away}`, reading.text]
    .filter(Boolean)
    .join(' · ');

  const noteLines: NoteLine[] = match.notes.map((note) => ({
    id: note.id,
    meta: [partName(note.period), `${note.score.home}-${note.score.away}`, formatClock(note.clock)]
      .filter(Boolean)
      .join(' · '),
    text: note.text,
  }));

  // Building the record reads a dozen values from this render, so it is kept behind a ref that
  // every render refreshes. The unmount effect below fires once, long after the render that
  // created it, and would otherwise file a match frozen at nil-nil.
  const recordRef = useRef<() => MatchRecord | null>(() => null);
  recordRef.current = () => {
    if (!sport) return null;
    const played = match.periods.some((p) => p.home > 0 || p.away > 0) || match.notes.length > 0;
    if (!played) return null;
    return {
      id: match.id,
      sportId: sport.id,
      sportName: sport.name,
      at: match.startedAt,
      competitive,
      home: { name: teams.home.name, color: teams.home.color },
      away: { name: teams.away.name, color: teams.away.color },
      headline: scoreHeadline(match, format),
      parts: scoreParts(match),
      periods: match.periods,
      partNames: match.periods.map((_, i) => partName(i)),
      durationMs: clock.ms,
      notes: match.notes,
    };
  };

  const file = () => {
    const record = recordRef.current();
    if (record) saveMatch(record);
  };

  // Autosave, because a match has to already be on disk before it is interrupted. Swiping the
  // app away kills it outright - no unmount, no cleanup, nothing gets a chance to run - so the
  // record cannot be written on the way out. Whatever was last written is what history shows,
  // which is the score and the notes as they stood, finished or not.
  //
  // Debounced so a run of quick taps writes once, and keyed on the clock too so that stopping
  // it files the length it stopped at.
  useEffect(() => {
    const id = setTimeout(file, SAVE_DEBOUNCE_MS);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match, clock.running]);

  // A running clock changes nothing else, so a half where nobody scores would otherwise file a
  // length from whenever the last goal was.
  useEffect(() => {
    if (!clock.running) return;
    const id = setInterval(file, SAVE_TICK_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clock.running]);

  // Leaving the app files immediately. Swiping up backgrounds the app a moment before killing
  // it, and that moment still runs - so this is the last chance to write, and it is the one
  // that makes an interrupted match land with the length it actually reached.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active') file();
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On the way out as well, so a match left deliberately is filed at once rather than 800ms
  // later, by which point this screen is gone.
  useEffect(() => () => file(), []);

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

  /** Stop the clock and mark where the next period starts from. */
  const closePeriod = () => {
    clock.pause();
    setPeriodStart(clock.ms);
    setAdded(0);
  };

  // What the period control does next, or null when there is nothing to advance to. In casual
  // play the only thing to do is call it a day.
  const advanceLabel = (() => {
    if (winner) return canGoToOvertime ? 'Overtime' : null;
    if (bySets) return setOver ? `New ${format.label}` : null;
    if (match.endedAt) return canGoToOvertime ? 'Overtime' : null;
    if (!competitive) return 'Finish';
    const last = match.current >= periods - 1;
    return last ? 'Finish' : `End ${clockLabel(periods)}`;
  })();

  const advance = () => {
    if (canGoToOvertime) {
      dispatch({ type: 'overtime' });
      closePeriod();
      return;
    }
    dispatch({ type: 'advance' });
    // A set sport keeps one clock for the whole session - the next game is not a new period to
    // time. A clocked one stops at the whistle and the next period starts from here.
    if (!bySets && competitive) closePeriod();
  };

  const reset = () => {
    // Reset clears the board for the next game, it does not unhappen the last one - and for
    // back-to-back rec games this button is how one match ends and the next begins.
    const record = recordRef.current();
    if (record) saveMatch(record);
    dispatch({ type: 'reset' });
    clock.reset();
    setPeriodStart(0);
    setAdded(0);
  };

  if (!sport) {
    return (
      <View style={[styles.screen, { backgroundColor: c.background }]}>
        <Text style={{ color: c.text }}>Unknown sport.</Text>
      </View>
    );
  }

  // Competitive play is counting something, so it says what: the set score, or which half it
  // is. Casual play is not, so it says the sport and nothing else.
  const caption = (() => {
    if (winner) return `${teams[winner].name} wins${bySets && competitive ? ` ${sets.home}-${sets.away}` : ''}`;
    if (!competitive) return sport.name;
    if (bySets) return `${periodName(format, match.current)} · ${sets.home}-${sets.away}`;
    if (reading.expired) return `${periodName(format, match.current)} · time up`;
    if (periods > 1 || overtime) return `${sport.name} · ${periodName(format, match.current)}`;
    return sport.name;
  })();

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

          {untouched ? (
            <Pressable
              style={[
                styles.modeBtn,
                CardShadow,
                { backgroundColor: competitive ? c.accent : c.card },
              ]}
              onPress={() => setCompetitive((on) => !on)}
              hitSlop={12}>
              <Text style={[styles.modeText, { color: competitive ? c.text : c.textSecondary }]}>
                {competitive ? 'COMPETITIVE' : 'CASUAL'}
              </Text>
            </Pressable>
          ) : null}

          {/* The whole clock is the start/pause control - a referee starting a half should not
              have to find a small button. */}
          <Pressable
            style={[styles.clock, CardShadow, { backgroundColor: c.card }]}
            onPress={clock.toggle}
            hitSlop={8}>
            <View style={styles.clockRow}>
              <Text
                style={[styles.clockTime, { color: clock.running ? c.text : c.textSecondary }]}>
                {reading.text}
              </Text>
              {reading.added ? (
                <Text style={[styles.clockAdded, { color: c.text }]}>{reading.added}</Text>
              ) : null}
              {clock.running ? null : (
                <MaterialCommunityIcons name="play" size={20} color={c.textSecondary} />
              )}
            </View>
            <Text
              style={[
                styles.caption,
                winner ? styles.captionWon : null,
                { color: winner || reading.expired ? c.text : c.textSecondary },
              ]}
              numberOfLines={1}>
              {caption}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.navBtn, CardShadow, { backgroundColor: c.card }]}
            onPress={reset}
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
          {advanceLabel ? (
            <Pressable
              style={[styles.pill, CardShadow, { backgroundColor: c.card }]}
              onPress={advance}
              hitSlop={12}>
              <Text style={[styles.pillText, { color: c.text }]}>{advanceLabel}</Text>
            </Pressable>
          ) : null}
          {canSetUp ? (
            <Pressable
              style={[styles.pill, styles.shortPill, CardShadow, { backgroundColor: c.card }]}
              onPress={() => setSheet('setup')}
              hitSlop={12}>
              <Text style={[styles.pillText, { color: c.text }]}>
                {periods > 1 ? `${periods} × ${periodMinutes}′` : `${periodMinutes} MIN`}
              </Text>
            </Pressable>
          ) : null}
          {canAddTime ? (
            <Pressable
              style={[styles.pill, styles.shortPill, CardShadow, { backgroundColor: c.card }]}
              onPress={() => setSheet('added')}
              hitSlop={12}>
              <Text style={[styles.pillText, { color: c.text }]}>
                {added > 0 ? `+${added} MIN` : 'ADDED TIME'}
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            style={[styles.noteBtn, CardShadow, { backgroundColor: c.card }]}
            onPress={() => setSheet('notes')}
            hitSlop={12}>
            <MaterialCommunityIcons name="note-text-outline" size={22} color={c.text} />
            {match.notes.length > 0 ? (
              <Text style={[styles.noteCount, { color: c.textSecondary }]}>
                {match.notes.length}
              </Text>
            ) : null}
          </Pressable>
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

      <MinutesSheet
        visible={sheet === 'added'}
        title="Added time"
        options={ADDED_TIME_OPTIONS}
        prefix="+"
        current={added}
        allowClear
        onSelect={(minutes) => {
          setAdded(minutes);
          setSheet(null);
        }}
        onClose={() => setSheet(null)}
      />

      <NotesSheet
        visible={sheet === 'notes'}
        context={noteContext}
        lines={noteLines}
        onAdd={(text) => dispatch({ type: 'note', text, clock: shownClockMs })}
        onClose={() => setSheet(null)}
      />

      <MatchSetup
        visible={sheet === 'setup'}
        periods={periods}
        minutes={length}
        lengths={base.decidedBy === 'clock' ? base.lengths : []}
        onChange={(next) => {
          setPeriods(next.periods);
          setLength(next.minutes);
        }}
        onClose={() => setSheet(null)}
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
  modeBtn: {
    width: 148,
    height: NAV_BTN_HEIGHT,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.8 },
  // Takes the space between the buttons, so the clock stays centred on the screen.
  clock: {
    flex: 1,
    minHeight: 58,
    borderRadius: 999,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clockRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  // Tabular figures, so the digits do not shuffle sideways every second.
  clockTime: { fontSize: 28, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: 0.5 },
  clockAdded: { fontSize: 17, fontWeight: '800' },
  caption: { fontSize: 13, fontWeight: '600' },
  captionWon: { fontSize: 14, fontWeight: '800' },
  teams: { flex: 1, flexDirection: 'row', gap: Spacing.md },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.md },
  pill: {
    minWidth: 150,
    height: 52,
    paddingHorizontal: Spacing.lg,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shortPill: { minWidth: 130 },
  noteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    minWidth: 60,
    height: 52,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
  },
  noteCount: { fontSize: 15, fontWeight: '800' },
  pillText: { fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
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
