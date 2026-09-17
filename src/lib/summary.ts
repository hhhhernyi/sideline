import { formatClock } from './clock';
import type { MatchRecord } from './history';

/** "17 Sep 2026, 8:42 pm" - a shared summary outlives the week, so it keeps its year. */
function shareDate(at: number): string {
  const d = new Date(at);
  const date = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `${date}, ${time}`;
}

function minutes(ms: number): string {
  const n = Math.round(ms / 60_000);
  return n < 1 ? 'under a minute' : `${n} min`;
}

/**
 * The match as a block of text to send someone.
 *
 * Plain text with line breaks rather than anything richer, because the places it is going -
 * WhatsApp, Telegram, Messages - all render exactly that and nothing else. No markdown: a
 * asterisk-wrapped word is bold in one of them and literal asterisks in the others.
 */
export function matchSummary(record: MatchRecord, emoji: string): string {
  const lines = [
    `${emoji} ${record.sportName}${record.competitive ? ' · Competitive' : ''}`,
    `${record.home.name} ${record.headline} ${record.away.name}`,
  ];
  if (record.parts) lines.push(record.parts);
  lines.push(`${shareDate(record.at)} · ${minutes(record.durationMs)}`);

  if (record.notes.length > 0) {
    lines.push('', '📝 Notes');
    for (const note of record.notes) {
      const meta = [
        record.partNames[note.period] ?? '',
        `${note.score.home}-${note.score.away}`,
        formatClock(note.clock),
      ]
        .filter(Boolean)
        .join(' · ');
      lines.push(`• [${meta}] ${note.text}`);
    }
  }

  return lines.join('\n');
}
