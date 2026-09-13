# Sounds

## whistle.wav

A real referee whistle, blown in a gymnasium.

- Source: https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav
- Licence: **CC0 1.0** (public domain dedication) — no attribution required, and free to ship in a
  paid or ad-supported app. This note is provenance, not an attribution obligation.

Processed from the 3.33 s / 48 kHz / 24-bit original: trimmed to the blast and its room tail
(1.10 s), normalised to -0.4 dBFS so it carries over crowd noise, 40 ms fade-out to avoid a click,
and stored as 16-bit to halve the size.

It is WAV rather than MP3 because no encoder is installed locally and, at this length, MP3 would
save roughly 90 KB — not worth adding a build step for. `expo-audio` plays either, so dropping an
MP3 in here and updating the `require` in `src/hooks/use-whistle.ts` would work unchanged.
