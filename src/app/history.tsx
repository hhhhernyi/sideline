import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/components/screen-header';
import { getSport } from '@/constants/sports';
import { CardShadow, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatClock } from '@/lib/clock';
import { deleteMatch, loadMatches, type MatchRecord } from '@/lib/history';

/** "17 Sep, 8:42 pm" - enough to find a game by, without a year nobody needs. */
function formatDate(at: number): string {
  const d = new Date(at);
  const date = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${time}`;
}

/** Duration reads in minutes: nobody cares that a match ran 48 minutes and 12 seconds. */
function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60_000);
  if (minutes < 1) return 'under a minute';
  return `${minutes} min`;
}

export default function HistoryScreen() {
  const c = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [matches, setMatches] = useState<MatchRecord[] | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  // Reload on focus rather than on mount: the usual way here is straight back from a match that
  // has just been filed, and a list loaded once would not show it.
  useFocusEffect(
    useCallback(() => {
      let live = true;
      loadMatches().then((loaded) => {
        if (live) setMatches(loaded);
      });
      return () => {
        live = false;
      };
    }, []),
  );

  const remove = async (id: string) => {
    setMatches((prev) => prev?.filter((m) => m.id !== id) ?? null);
    setOpen(null);
    await deleteMatch(id);
  };

  return (
    <View style={[styles.root, { backgroundColor: c.background }]}>
      <ScreenHeader
        title="History"
        action={
          <Pressable
            style={[styles.backBtn, CardShadow, { backgroundColor: c.card }]}
            onPress={() => router.back()}
            hitSlop={12}>
            <Text style={[styles.backText, { color: c.text }]}>Done</Text>
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.list,
          {
            paddingLeft: insets.left + Spacing.md,
            paddingRight: insets.right + Spacing.md,
            paddingBottom: insets.bottom + Spacing.lg,
          },
        ]}>
        {matches === null ? null : matches.length === 0 ? (
          <Text style={[styles.empty, { color: c.textSecondary }]}>
            No matches yet. Games you play are kept here automatically.
          </Text>
        ) : (
          matches.map((match) => {
            const expanded = open === match.id;
            const sport = getSport(match.sportId);
            return (
              <Pressable
                key={match.id}
                style={[styles.card, CardShadow, { backgroundColor: c.card }]}
                onPress={() => setOpen(expanded ? null : match.id)}>
                <View style={styles.row}>
                  {sport ? (
                    <View style={[styles.icon, { backgroundColor: sport.tint }]}>
                      <MaterialCommunityIcons name={sport.icon} size={22} color={c.text} />
                    </View>
                  ) : null}

                  <View style={styles.headline}>
                    <Text style={[styles.teams, { color: c.text }]} numberOfLines={1}>
                      {match.home.name} v {match.away.name}
                    </Text>
                    <Text style={[styles.meta, { color: c.textSecondary }]} numberOfLines={1}>
                      {formatDate(match.at)} · {match.sportName} · {formatDuration(match.durationMs)}
                      {match.competitive ? ' · competitive' : ''}
                      {match.notes.length > 0
                        ? ` · ${match.notes.length} note${match.notes.length > 1 ? 's' : ''}`
                        : ''}
                    </Text>
                  </View>

                  <Text style={[styles.score, { color: c.text }]}>{match.scoreline}</Text>
                </View>

                {expanded ? (
                  <View style={styles.details}>
                    {match.notes.map((note) => (
                      <View key={note.id} style={styles.note}>
                        <Text style={[styles.noteMeta, { color: c.textSecondary }]}>
                          {[
                            match.partNames[note.period] ?? '',
                            `${note.score.home}-${note.score.away}`,
                            formatClock(note.clock),
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </Text>
                        <Text style={[styles.noteText, { color: c.text }]}>{note.text}</Text>
                      </View>
                    ))}
                    {match.notes.length === 0 ? (
                      <Text style={[styles.noteMeta, { color: c.textSecondary }]}>
                        No notes were logged in this match.
                      </Text>
                    ) : null}
                    <Pressable
                      onPress={() => remove(match.id)}
                      hitSlop={8}
                      style={[styles.delete, { backgroundColor: c.background }]}>
                      <Text style={[styles.deleteText, { color: c.textSecondary }]}>Delete</Text>
                    </Pressable>
                  </View>
                ) : null}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: {
    minWidth: 92,
    height: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 16, fontWeight: '700' },
  list: { paddingTop: Spacing.md, gap: Spacing.sm },
  empty: { fontSize: 15, fontWeight: '600', textAlign: 'center', paddingVertical: Spacing.xl },
  card: { borderRadius: 18, padding: Spacing.md, gap: Spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  icon: { width: 40, height: 40, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  headline: { flex: 1, gap: 2 },
  teams: { fontSize: 17, fontWeight: '800' },
  meta: { fontSize: 12, fontWeight: '600' },
  // Tabular figures keep the scorelines aligned down the right edge of the list.
  score: { fontSize: 17, fontWeight: '800', fontVariant: ['tabular-nums'] },
  details: { gap: Spacing.sm, paddingTop: Spacing.xs },
  note: { gap: 2 },
  noteMeta: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  noteText: { fontSize: 14, fontWeight: '600' },
  delete: {
    alignSelf: 'flex-start',
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: { fontSize: 13, fontWeight: '800' },
});
