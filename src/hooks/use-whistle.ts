import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

const WHISTLE = require('../../assets/sounds/whistle.wav');

/**
 * Press-and-hold whistle.
 *
 * The asset is one continuous three-second blast rather than a short clip on `loop`, because
 * expo-audio's looping restarts the file instead of wrapping it seamlessly, which puts an
 * audible gap in a held blast.
 *
 * Presses are served from a small pool of players, round-robin. That does two things: a second
 * tap sounds on its own player instead of interrupting the first, so two taps give two whistles;
 * and the press path never has to `seekTo(0)` first, which is async and was the source of the
 * lag between the tap and the sound. Rewinding happens on release, off the critical path.
 *
 * Every call into a player is guarded - these are native calls that throw for ordinary lifecycle
 * reasons, and an uncaught throw takes down the JS thread rather than just the audio.
 */
const POOL_SIZE = 3;

export function useWhistle() {
  // A fixed number of hook calls, so this obeys the rules of hooks despite looking like a list.
  const pool = [useAudioPlayer(WHISTLE), useAudioPlayer(WHISTLE), useAudioPlayer(WHISTLE)];
  const next = useRef(0);
  const active = useRef<(typeof pool)[number] | null>(null);

  useEffect(() => {
    // A scoreboard gets used courtside with the handset on silent, so opt out of the iOS
    // ringer switch - otherwise the whistle is inaudible exactly when it is wanted.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const start = useCallback(() => {
    const player = pool[next.current % POOL_SIZE];
    next.current += 1;
    active.current = player;
    try {
      // No seek here: release already rewound this player, so play() is immediate.
      player.play();
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, pool);

  const stop = useCallback(() => {
    const player = active.current;
    active.current = null;
    if (!player) return;
    try {
      player.pause();
      // Rewind now so this player is ready to fire instantly when the pool comes back round.
      player.seekTo(0);
    } catch {}
  }, []);

  return { start, stop };
}
