import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { MatchFormat } from '@/lib/game';

export type SportId = 'soccer' | 'basketball' | 'volleyball' | 'badminton';

/** Any glyph name from the MaterialCommunityIcons set. */
export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export type Sport = {
  id: SportId;
  name: string;
  icon: IconName;
  /** Pastel tint used behind the icon on the picker card. */
  tint: string;
  /** Stands in for the icon where only text travels - a shared summary. */
  emoji: string;
  /** Point values offered as score buttons, e.g. [1, 2, 3] for basketball. */
  increments: number[];
  /** How the match is divided, and what ends a period. */
  format: MatchFormat;
};

export const SPORTS: Sport[] = [
  {
    id: 'soccer',
    name: 'Soccer',
    icon: 'soccer',
    tint: '#D2EBDA',
    emoji: '⚽',
    increments: [1],
    format: {
      decidedBy: 'clock',
      count: 2,
      minutes: 45,
      lengths: [20, 30, 40, 45],
      countsDown: false,
    },
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: 'basketball',
    tint: '#FBD9C4',
    emoji: '🏀',
    increments: [1, 2, 3],
    // FIBA quarters and a five-minute overtime. The length is only the starting point - it
    // is set per match on the scoreboard, because a rec game is whatever the court is booked
    // for.
    format: {
      decidedBy: 'clock',
      count: 4,
      minutes: 10,
      lengths: [6, 8, 10, 12],
      countsDown: true,
      overtimeMinutes: 5,
    },
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    icon: 'volleyball',
    tint: '#FAE7BE',
    emoji: '🏐',
    increments: [1],
    // A set runs to 25 win-by-2 with no ceiling - 30-28 and 33-31 are both legal - and a match
    // is best of five, with the fifth played to 15. The best-of only applies in competitive
    // play; a rec game stops after one set.
    format: {
      decidedBy: 'sets',
      win: { to: 25, by: 2 },
      best: 5,
      decider: { to: 15, by: 2 },
      label: 'Set',
    },
  },
  {
    id: 'badminton',
    name: 'Badminton',
    icon: 'badminton',
    tint: '#D9E8F2',
    emoji: '🏸',
    increments: [1],
    // Badminton is played in games, not sets: best of three to 21 win-by-2, stopping at 30,
    // where 30-29 takes it. Every game uses the same rule, so there is no decider.
    format: { decidedBy: 'sets', win: { to: 21, by: 2, cap: 30 }, best: 3, label: 'Game' },
  },
];

export function getSport(id: string | undefined): Sport | undefined {
  return SPORTS.find((s) => s.id === id);
}
