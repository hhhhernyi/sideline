import { setAudioModeAsync, useAudioPlayer } from 'expo-audio';
import { useCallback, useEffect } from 'react';

const WHISTLE = require('../../assets/sounds/whistle.wav');

/** Returns a function that blows the whistle, restarting it if it is already sounding. */
export function useWhistle() {
  const player = useAudioPlayer(WHISTLE);

  useEffect(() => {
    // A scoreboard gets used courtside with the handset on silent, so opt out of the iOS
    // ringer switch - otherwise the whistle is inaudible exactly when it is wanted.
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  return useCallback(() => {
    // Seek first so repeated taps re-blow from the top instead of being ignored mid-play.
    player.seekTo(0);
    player.play();
  }, [player]);
}
