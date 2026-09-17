export type Team = 'home' | 'away';

/** How a sport decides a single set or game. */
export type WinRule = {
  /** Points needed to win, provided the lead is at least `by`. */
  to: number;
  /** Margin required at `to` and beyond, so 20-20 keeps going. */
  by: number;
  /** Ceiling where the margin stops applying - badminton's 30, where 30-29 wins. */
  cap?: number;
};

/**
 * How a match is built out of periods. Two shapes, because sports end a period one of two
 * ways: on the scoreboard (volleyball, badminton) or on the clock (soccer, basketball).
 */
export type MatchFormat =
  | {
      decidedBy: 'sets';
      /** Best of 3 or 5 - the match ends when a side takes the majority. */
      best: number;
      /** What it takes to win a set. */
      win: WinRule;
      /** Volleyball's final set is to 15, not 25. Omitted where every set is the same. */
      decider?: WinRule;
      /** What one period is called, for the scoreboard title. */
      label: string;
    }
  | {
      decidedBy: 'clock';
      /** Halves or quarters. */
      count: number;
      /** Minutes in a period, before stoppage. */
      minutes: number;
      label: string;
    };

/** One set, game, half or quarter. Scores are per period, never cumulative. */
export type Period = { home: number; away: number };

/**
 * A note logged against the moment it happened. The score is copied in rather than looked up
 * later, because the point of the note is what the scoreboard read at the time.
 */
export type Note = {
  id: number;
  /** Wall clock when it was logged, for ordering and for the summary. */
  at: number;
  /** Index into `periods`. */
  period: number;
  score: Period;
  text: string;
};

export type MatchState = {
  periods: Period[];
  /** Index of the live period. Always a valid index into `periods`. */
  current: number;
  notes: Note[];
  nextNoteId: number;
  startedAt: number;
  /** Set once the match is over, so a finished match stops taking points. */
  endedAt: number | null;
};

export type MatchAction =
  | { type: 'score'; team: Team; delta: number }
  | { type: 'advance' }
  | { type: 'note'; text: string }
  | { type: 'finish' }
  | { type: 'reset' };

const emptyPeriod = (): Period => ({ home: 0, away: 0 });

export function initialMatch(now = Date.now()): MatchState {
  return {
    periods: [emptyPeriod()],
    current: 0,
    notes: [],
    nextNoteId: 1,
    startedAt: now,
    endedAt: null,
  };
}

/** The rule in force for a given period - volleyball's decider differs from its first four. */
export function ruleFor(format: MatchFormat, index: number): WinRule | undefined {
  if (format.decidedBy !== 'sets') return undefined;
  return format.decider && index === format.best - 1 ? format.decider : format.win;
}

/** The team that has won this period, or null while it is still live. */
export function periodWinner(period: Period, rule?: WinRule): Team | null {
  if (!rule || period.home === period.away) return null;
  const leader: Team = period.home > period.away ? 'home' : 'away';
  const top = Math.max(period.home, period.away);
  const lead = Math.abs(period.home - period.away);
  if (rule.cap !== undefined && top >= rule.cap) return leader;
  return top >= rule.to && lead >= rule.by ? leader : null;
}

/** Periods won by each side. Only meaningful for set-decided sports. */
export function periodsWon(state: MatchState, format: MatchFormat): Period {
  const won = emptyPeriod();
  state.periods.forEach((period, i) => {
    const winner = periodWinner(period, ruleFor(format, i));
    if (winner) won[winner] += 1;
  });
  return won;
}

/** Points across every period, which is what decides a clocked match. */
export function totals(state: MatchState): Period {
  return state.periods.reduce<Period>(
    (sum, p) => ({ home: sum.home + p.home, away: sum.away + p.away }),
    emptyPeriod(),
  );
}

/** The team that has won the match, or null while it is still live. */
export function matchWinner(state: MatchState, format: MatchFormat): Team | null {
  if (format.decidedBy === 'sets') {
    const won = periodsWon(state, format);
    const needed = Math.floor(format.best / 2) + 1;
    if (won.home >= needed) return 'home';
    if (won.away >= needed) return 'away';
    return null;
  }
  // A clocked match is only decided once it is called - a 1-0 first half is not a win, and a
  // draw is a real result, so this stays null rather than guessing at a leader.
  if (!state.endedAt) return null;
  const total = totals(state);
  if (total.home === total.away) return null;
  return total.home > total.away ? 'home' : 'away';
}

/** Whether the live period is over and the match is waiting on the next one. */
export function periodOver(state: MatchState, format: MatchFormat): boolean {
  return periodWinner(state.periods[state.current], ruleFor(format, state.current)) !== null;
}

export function matchReducer(
  state: MatchState,
  action: MatchAction,
  format: MatchFormat,
): MatchState {
  switch (action.type) {
    case 'score': {
      // A finished match takes nothing, but a live one still takes -1 even after the period is
      // decided, so a mis-tap that ended a set early can be taken back.
      if (state.endedAt && action.delta > 0) return state;
      if (action.delta > 0 && periodOver(state, format)) return state;
      const periods = state.periods.map((p, i) =>
        i === state.current
          ? { ...p, [action.team]: Math.max(0, p[action.team] + action.delta) }
          : p,
      );
      const next = { ...state, periods };
      // Taking the deciding point ends the match there and then, so the summary has an end time
      // without waiting for anyone to press anything.
      return matchWinner(next, format) ? { ...next, endedAt: Date.now() } : next;
    }
    case 'advance': {
      if (state.endedAt) return state;
      const limit = format.decidedBy === 'sets' ? format.best : format.count;
      if (state.periods.length >= limit) return { ...state, endedAt: Date.now() };
      return {
        ...state,
        periods: [...state.periods, emptyPeriod()],
        current: state.periods.length,
      };
    }
    case 'note': {
      const text = action.text.trim();
      if (!text) return state;
      const note: Note = {
        id: state.nextNoteId,
        at: Date.now(),
        period: state.current,
        score: { ...state.periods[state.current] },
        text,
      };
      return { ...state, notes: [...state.notes, note], nextNoteId: state.nextNoteId + 1 };
    }
    case 'finish':
      return state.endedAt ? state : { ...state, endedAt: Date.now() };
    case 'reset':
      return initialMatch();
  }
}

/** "Set 2", "2nd Half" - what the live period is called on the scoreboard. */
export function periodName(format: MatchFormat, index: number): string {
  if (format.decidedBy === 'sets') return `${format.label} ${index + 1}`;
  const ordinals = ['1st', '2nd', '3rd', '4th'];
  const ordinal = ordinals[index] ?? `${index + 1}th`;
  return `${ordinal} ${format.label}`;
}
