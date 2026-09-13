export type Team = 'home' | 'away';

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
