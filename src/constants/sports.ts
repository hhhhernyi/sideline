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
    increments: [1],
    format: { decidedBy: 'clock', count: 2, minutes: 45, label: 'Half' },
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: 'basketball',
    tint: '#FBD9C4',
    increments: [1, 2, 3],
    // FIBA quarters. The NBA's 12 belongs in a per-match setting, not a second sport.
    format: { decidedBy: 'clock', count: 4, minutes: 10, label: 'Quarter' },
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    icon: 'volleyball',
    tint: '#FAE7BE',
    increments: [1],
    // Sets run to 25 win-by-2 with no ceiling - 30-28 and 33-31 are both legal - but a match
    // that reaches a fifth set plays it to 15.
    format: {
      decidedBy: 'sets',
      best: 5,
      win: { to: 25, by: 2 },
      decider: { to: 15, by: 2 },
      label: 'Set',
    },
  },
  {
    id: 'badminton',
    name: 'Badminton',
    icon: 'badminton',
    tint: '#D9E8F2',
    increments: [1],
    // Badminton is played in games, not sets: best of 3 to 21 win-by-2, stopping at 30, where
    // 30-29 takes it. Every game uses the same rule, so there is no decider.
    format: { decidedBy: 'sets', best: 3, win: { to: 21, by: 2, cap: 30 }, label: 'Game' },
  },
];

export function getSport(id: string | undefined): Sport | undefined {
  return SPORTS.find((s) => s.id === id);
}
