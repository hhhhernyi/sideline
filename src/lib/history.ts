import Storage from 'expo-sqlite/kv-store';

import type { Note, Period } from './game';

/**
 * A finished match, as history keeps it.
 *
 * The scoreline is rendered here rather than stored as rules and re-derived later. A record is
 * a record of what happened: if the sport's rules are edited in a later version, or the match
 * was played casually under rules that no longer exist in that shape, the line it showed at
 * the time is still the truth about that game.
 */
export type MatchRecord = {
  id: string;
  sportId: string;
  sportName: string;
  /** When the match started. */
  at: number;
  competitive: boolean;
  home: { name: string; color: string };
  away: { name: string; color: string };
  /** "3 - 1" - sets won, or the points where one game was the whole match. */
  headline: string;
  /** "25-22, 21-25, 15-13" - the parts, or empty where there was only one. */
  parts: string;
  /** Score per period, kept so a summary can break the match down later. */
  periods: Period[];
  /**
   * What each period was called - "Set 1", "2nd Half", or empty where the match had no parts
   * to name. Written down for the same reason as the scoreline: the rules that produced these
   * names belong to the match, not to whatever the app does next.
   */
  partNames: string[];
  /** How long the clock ran, in milliseconds. */
  durationMs: number;
  notes: Note[];
};

const KEY = 'sideline.matches.v1';
/**
 * Old matches fall off the end. A scoreboard's history is something you glance back at, not an
 * archive, and an unbounded list would grow forever inside one stored string.
 */
const LIMIT = 200;

/** Newest first. Returns nothing at all rather than throwing - history is never load-bearing. */
export async function loadMatches(): Promise<MatchRecord[]> {
  try {
    const raw = await Storage.getItemAsync(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Matches filed before the scoreline was split into a headline and its parts. Carried over
    // rather than dropped: a record of a game that was played should outlive a refactor.
    return (parsed as (MatchRecord & { scoreline?: string })[]).map((m) =>
      m.headline === undefined && m.scoreline
        ? { ...m, headline: m.scoreline, parts: '' }
        : m,
    );
  } catch {
    return [];
  }
}

/**
 * Write one match in, replacing any earlier save of the same match. Saving happens more than
 * once - when the match ends, and again when the screen is left - so this has to be an upsert
 * rather than an append, or a single game would appear twice.
 */
export async function saveMatch(record: MatchRecord): Promise<void> {
  try {
    const existing = await loadMatches();
    const rest = existing.filter((m) => m.id !== record.id);
    const next = [record, ...rest].sort((a, b) => b.at - a.at).slice(0, LIMIT);
    await Storage.setItemAsync(KEY, JSON.stringify(next));
  } catch {
    // A match that cannot be filed is not worth interrupting the game over.
  }
}

export async function deleteMatch(id: string): Promise<void> {
  try {
    const existing = await loadMatches();
    await Storage.setItemAsync(KEY, JSON.stringify(existing.filter((m) => m.id !== id)));
  } catch {}
}

export async function clearMatches(): Promise<void> {
  try {
    await Storage.removeItemAsync(KEY);
  } catch {}
}
