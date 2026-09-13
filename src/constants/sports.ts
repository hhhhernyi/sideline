import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import type { WinRule } from '@/lib/game';

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
  /** Omitted for sports played to the clock rather than to a score. */
  win?: WinRule;
};

export const SPORTS: Sport[] = [
  { id: 'soccer', name: 'Soccer', icon: 'soccer', tint: '#D2EBDA', increments: [1] },
  { id: 'basketball', name: 'Basketball', icon: 'basketball', tint: '#FBD9C4', increments: [1, 2, 3] },
  // Volleyball sets run to 25 win-by-2, with no ceiling - 30-28 and 33-31 are both legal.
  { id: 'volleyball', name: 'Volleyball', icon: 'volleyball', tint: '#FAE7BE', increments: [1], win: { to: 25, by: 2 } },
  // Badminton games run to 21 win-by-2, but stop at 30: at 29-29 the next point takes it.
  { id: 'badminton', name: 'Badminton', icon: 'badminton', tint: '#D9E8F2', increments: [1], win: { to: 21, by: 2, cap: 30 } },
];

export function getSport(id: string | undefined): Sport | undefined {
  return SPORTS.find((s) => s.id === id);
}
