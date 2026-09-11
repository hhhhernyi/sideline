import type { ComponentProps } from 'react';
import type MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export type SportId = 'soccer' | 'basketball' | 'volleyball' | 'tennis' | 'badminton';

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
  /** What a period is called in this sport ("Half", "Quarter", "Set"). */
  periodLabel: string;
  /** Number of periods in a standard match. */
  periods: number;
};

export const SPORTS: Sport[] = [
  { id: 'soccer', name: 'Soccer', icon: 'soccer', tint: '#D2EBDA', increments: [1], periodLabel: 'Half', periods: 2 },
  { id: 'basketball', name: 'Basketball', icon: 'basketball', tint: '#FBD9C4', increments: [1, 2, 3], periodLabel: 'Quarter', periods: 4 },
  { id: 'volleyball', name: 'Volleyball', icon: 'volleyball', tint: '#FAE7BE', increments: [1], periodLabel: 'Set', periods: 5 },
  { id: 'tennis', name: 'Tennis', icon: 'tennis-ball', tint: '#E2DDF3', increments: [1], periodLabel: 'Set', periods: 3 },
  { id: 'badminton', name: 'Badminton', icon: 'badminton', tint: '#D9E8F2', increments: [1], periodLabel: 'Game', periods: 3 },
];

export function getSport(id: string | undefined): Sport | undefined {
  return SPORTS.find((s) => s.id === id);
}
