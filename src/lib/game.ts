export type Team = 'home' | 'away';

/** How a sport decides a winner. Sports without one (soccer, basketball) just keep counting. */
export type WinRule = {
  /** Points needed to win, provided the lead is at least `by`. */
  to: number;
  /** Margin required at `to` and beyond, so 20-20 keeps going. */
  by: number;
  /** Ceiling where the margin stops applying - badminton's 30, where 30-29 wins. */
  cap?: number;
};

export type GameState = { home: number; away: number };

export type GameAction = { type: 'score'; team: Team; delta: number } | { type: 'reset' };

export const initialGame: GameState = { home: 0, away: 0 };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'score':
      return { ...state, [action.team]: Math.max(0, state[action.team] + action.delta) };
    case 'reset':
      return initialGame;
  }
}

/** The team that has won, or null while the game is still live. */
export function getWinner(state: GameState, rule?: WinRule): Team | null {
  if (!rule || state.home === state.away) return null;
  const leader: Team = state.home > state.away ? 'home' : 'away';
  const top = Math.max(state.home, state.away);
  const lead = Math.abs(state.home - state.away);
  if (rule.cap !== undefined && top >= rule.cap) return leader;
  return top >= rule.to && lead >= rule.by ? leader : null;
}
