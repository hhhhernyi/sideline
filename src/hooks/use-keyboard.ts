import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/**
 * Height of the on-screen keyboard, or 0 when it is down.
 *
 * The sheets in this app are absolutely-positioned overlays rather than native modals, so
 * nothing moves them out of the keyboard's way - they have to be told. That barely matters in
 * portrait, but this app is landscape-only, where the keyboard takes well over half the screen
 * and a centred card lands squarely behind it.
 *
 * iOS gets the `Will` events so the card moves with the keyboard rather than after it; Android
 * only reliably fires the `Did` pair.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvent, (e) => setHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener(hideEvent, () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return height;
}
