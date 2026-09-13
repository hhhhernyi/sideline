import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';

const WHISTLE = require('../../assets/sounds/whistle.wav');

/**
 * A quick tap should still read as a blast rather than a click, so a press always sounds for at
 * least this long even if the finger has already lifted. Short enough that short-short-long
 * still comes out as three distinct blasts.
 */
const MIN_BLAST_MS = 180;
/** Ramp down on release; stopping a loop dead mid-waveform clicks. */
const FADE_MS = 70;
const FADE_STEPS = 7;

/**
 * Press-and-hold whistle. The asset is a seamless loop of the steady part of a real whistle, so
 * holding sustains the blast for as long as the button is down.
 */
export function useWhistle() {
  const player = useAudioPlayer(WHISTLE);
  const startedAt = useRef(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    player.loop = true;
    // A scoreboard gets used courtside with the handset on silent, so opt out of the iOS
    // ringer switch - otherwise the whistle is inaudible exactly when it is wanted.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
    return clearTimers;
  }, [player]);

  const start = useCallback(() => {
    clearTimers();
    startedAt.current = Date.now();
    player.volume = 1;
    player.seekTo(0);
    player.play();
  }, [player]);

  const stop = useCallback(() => {
    clearTimers();
    // Hold the floor open if the tap was shorter than a blast, then fade rather than cut.
    const wait = Math.max(0, MIN_BLAST_MS - (Date.now() - startedAt.current));
    const step = FADE_MS / FADE_STEPS;
    for (let i = 1; i <= FADE_STEPS; i++) {
      timers.current.push(
        setTimeout(() => {
          player.volume = Math.max(0, 1 - i / FADE_STEPS);
        }, wait + step * i),
      );
    }
    timers.current.push(
      setTimeout(() => {
        player.pause();
        player.seekTo(0);
        player.volume = 1;
      }, wait + FADE_MS + 20),
    );
  }, [player]);

  return { start, stop };
}
