export type SportId = 'soccer' | 'basketball' | 'volleyball';

export type Sport = {
  id: SportId;
  name: string;
  emoji: string;
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
  { id: 'soccer', name: 'Soccer', emoji: '⚽', tint: '#CBE8C4', increments: [1], periodLabel: 'Half', periods: 2 },
  { id: 'basketball', name: 'Basketball', emoji: '🏀', tint: '#FFD6B8', increments: [1, 2, 3], periodLabel: 'Quarter', periods: 4 },
  { id: 'volleyball', name: 'Volleyball', emoji: '🏐', tint: '#FFEDA8', increments: [1], periodLabel: 'Set', periods: 5 },
];

export function getSport(id: string | undefined): Sport | undefined {
  return SPORTS.find((s) => s.id === id);
}
