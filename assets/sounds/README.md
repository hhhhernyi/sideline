# Sounds

## whistle.wav

A seamless loop of a real referee whistle, for press-and-hold playback.

- Source: https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav
- Licence: **CC0 1.0** (public domain dedication) — no attribution required, and free to ship in a
  paid or ad-supported app. This note is provenance, not an attribution obligation.

Built from the 3.33 s / 48 kHz / 24-bit original, as one continuous **3 second** blast:

1. The natural attack is kept (75 ms from just before onset), so the sound starts with a real
   whistle's chiff rather than straight into steady tone.
2. Behind it, a 0.28 s slice of the steady middle repeats. It is made seamless by crossfading its
   head with the material that follows the loop end, and the attack-to-steady junction is
   crossfaded the same way.
3. Short fade in, 80 ms fade out for the case where the button is held past the end.

Then normalised to -0.4 dBFS so it carries over crowd noise, and stored 16-bit (281 KB).

**Why one long file rather than a short clip on `loop`:** expo-audio's looping restarts the file
rather than wrapping it seamlessly, which put an audible gap in a held blast. Three seconds covers
a long full-time whistle; holding past it simply ends.

It is WAV rather than MP3 because no encoder is installed locally. WAV also decodes without the
startup cost of an MP3 frame decode, which matters here: the press-to-sound delay is the thing
this asset is most often judged on.
