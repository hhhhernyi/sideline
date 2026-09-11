import { useFocusEffect } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useCallback } from 'react';
import { Platform } from 'react-native';

/** Locks the screen to the given orientation while this screen is focused. */
export function useOrientationLock(lock: ScreenOrientation.OrientationLock) {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'web') return;
      ScreenOrientation.lockAsync(lock).catch(() => {});
    }, [lock]),
  );
}
