import type { MatchFormat } from './game';

/** A clock reading, ready to render. */
export type Reading = {
  /** Always mm:ss. Minutes run past 60 rather than rolling into an hours field, because a
   *  scoreboard clock reads 90:00, not 1:30:00. */
  text: string;
  /** Soccer's added time as "+3", or null when there is none to show. */
  added: string | null;
  /** The period's time is up - full time, or the buzzer. */
  expired: boolean;
};

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const mm = Math.floor(total / 60);
  const ss = total % 60;
  return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

/**
 * What the clock should say.
 *
 * `ms` is time in the period for a sport played to the clock, and time in the whole match for
 * one played to a score - a rec badminton session wants to know it has been going 48 minutes,
 * not that game three is nine minutes old.
 *
 * Direction is the sport's, not a preference: a football clock counts up, a basketball clock
 * counts down. Either way it stops where the period ends and stays there. For football that
 * is 45:00 until added time is signalled, which moves the end and lets it run on.
 */
export function readClock(format: MatchFormat, ms: number, added = 0): Reading {
  if (format.decidedBy === 'sets') {
    return { text: formatClock(ms), added: null, expired: false };
  }
  const full = format.minutes * 60_000;
  if (format.countsDown) {
    const left = full - ms;
    return { text: formatClock(left), added: null, expired: left <= 0 };
  }
  return {
    text: formatClock(ms),
    added: added > 0 ? `+${added}` : null,
    // Added time moves the end of the half, so the whistle is not due until it has been played
    // out too. Until any is signalled, 45:00 is where the half stops.
    expired: ms >= full + added * 60_000,
  };
}
