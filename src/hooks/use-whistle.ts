import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect } from 'react';

const WHISTLE = require('../../assets/sounds/whistle.wav');

/**
 * Press-and-hold whistle. The asset is a seamless loop of the steady part of a real whistle, so
 * the blast lasts exactly as long as the button is held.
 *
 * Every call into the player is guarded. These are native calls that throw if the player is not
 * loaded yet or has been released, and an uncaught throw here takes down the JS thread - which
 * looks like the whole scoreboard freezing, not like an audio bug.
 */
export function useWhistle() {
  const player = useAudioPlayer(WHISTLE);

  useEffect(() => {
    try {
      player.loop = true;
    } catch {}
    // A scoreboard gets used courtside with the handset on silent, so opt out of the iOS
    // ringer switch - otherwise the whistle is inaudible exactly when it is wanted.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, [player]);

  const start = useCallback(() => {
    try {
      player.seekTo(0);
      player.play();
    } catch {}
  }, [player]);

  const stop = useCallback(() => {
    try {
      player.pause();
      player.seekTo(0);
    } catch {}
  }, [player]);

  return { start, stop };
}
