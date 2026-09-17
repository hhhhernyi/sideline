import { useCallback, useEffect, useState } from 'react';

export type Clock = {
  /** Milliseconds run, across every start and pause. */
  ms: number;
  running: boolean;
  start: () => void;
  pause: () => void;
  toggle: () => void;
  reset: () => void;
};

/** Fast enough that a tap on pause lands on the second it looks like it landed on. */
const TICK_MS = 250;

/**
 * A stopwatch for the match.
 *
 * Time comes from the wall clock rather than from counting ticks. `setInterval` is throttled
 * hard the moment the app is backgrounded or the phone locks, so a clock that counted its own
 * ticks would quietly lose minutes - and a phone being used as a scoreboard gets locked and
 * pocketed constantly. Banking elapsed time at each pause and measuring the live run against
 * `Date.now()` means a clock that was running reads correctly when the app comes back, however
 * long it was away.
 */
export function useClock(limitMs?: number): Clock {
  /** Time from runs already finished. */
  const [banked, setBanked] = useState(0);
  /** When the live run began, or null while paused. */
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;
    const id = setInterval(() => setNow(Date.now()), TICK_MS);
    return () => clearInterval(id);
  }, [startedAt]);

  const raw = banked + (startedAt === null ? 0 : Math.max(0, now - startedAt));

  useEffect(() => {
    if (startedAt === null || limitMs === undefined || raw < limitMs) return;
    // Bank the limit exactly rather than whatever the tick happened to read, so the half ends
    // on 45:00 and not on 45:00.24.
    setBanked(limitMs);
    setStartedAt(null);
  }, [raw, limitMs, startedAt]);

  const start = useCallback(() => {
    if (startedAt !== null) return;
    // Refuse to start a clock that is already at its limit, or it would run one tick and stop
    // again. Raising the limit - signalling added time - is what makes it startable.
    if (limitMs !== undefined && raw >= limitMs) return;
    const t = Date.now();
    setNow(t);
    setStartedAt(t);
  }, [startedAt, limitMs, raw]);

  const pause = useCallback(() => {
    if (startedAt === null) return;
    setBanked((b) => b + (Date.now() - startedAt));
    setStartedAt(null);
  }, [startedAt]);

  const reset = useCallback(() => {
    setBanked(0);
    setStartedAt(null);
  }, []);

  const toggle = useCallback(() => {
    if (startedAt === null) start();
    else pause();
  }, [startedAt, start, pause]);

  return {
    ms: limitMs === undefined ? raw : Math.min(raw, limitMs),
    running: startedAt !== null,
    start,
    pause,
    toggle,
    reset,
  };
}
