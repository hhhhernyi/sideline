export type Team = 'home' | 'away';

export type GameState = {
  home: number;
  away: number;
  period: number;
  /** Every scoring event, newest last. Used for undo. */
  history: { team: Team; delta: number }[];
};

export type GameAction =
  | { type: 'score'; team: Team; delta: number }
  | { type: 'undo' }
  | { type: 'nextPeriod' }
  | { type: 'reset' };

export const initialGame: GameState = { home: 0, away: 0, period: 1, history: [] };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'score':
      return {
        ...state,
        [action.team]: Math.max(0, state[action.team] + action.delta),
        history: [...state.history, { team: action.team, delta: action.delta }],
      };
    case 'undo': {
      const last = state.history[state.history.length - 1];
      if (!last) return state;
      return {
        ...state,
        [last.team]: Math.max(0, state[last.team] - last.delta),
        history: state.history.slice(0, -1),
      };
    }
    case 'nextPeriod':
      return { ...state, period: state.period + 1 };
    case 'reset':
      return initialGame;
  }
}
