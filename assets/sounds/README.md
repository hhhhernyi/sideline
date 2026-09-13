# Sounds

## whistle.wav

A seamless loop of a real referee whistle, for press-and-hold playback.

- Source: https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav
- Licence: **CC0 1.0** (public domain dedication) — no attribution required, and free to ship in a
  paid or ad-supported app. This note is provenance, not an attribution obligation.

Built from the 3.33 s / 48 kHz / 24-bit original. Holding the button has to sustain a blast of any
length, so the asset is not the whole recording — a whole-recording loop would re-blow the attack
every cycle. Instead it is 0.28 s taken from the steady middle of the blast, clear of both the
attack transient and the decay tail, made to loop cleanly by:

1. **Crossfading the head** with the material that follows the loop end, so wrapping from the last
   sample to the first is continuous rather than jumping.
2. **Rotating to a rising zero crossing.** Rotating a seamless loop keeps it seamless, and it means
   playback starts and stops near silence instead of mid-waveform, so there is no click on press.

Then normalised to -0.4 dBFS so it carries over crowd noise, and stored 16-bit.

Verify a rebuild with the seam check: the wrap delta should be comparable to the mean adjacent
sample delta. At ~4 kHz sampled at 48 kHz there are only ~12 samples per cycle, so adjacent samples
legitimately differ by a large fraction of peak — an absolute wrap delta near zero is the wrong
target, and chasing it will make the loop worse.

The release fade and the minimum blast length live in `src/hooks/use-whistle.ts`, not in the asset.

It is WAV rather than MP3 because no encoder is installed locally, and MP3 is a poor fit for a
gapless loop anyway: the format pads the start and end of the stream, which puts a gap at the loop
join that the decoder cannot always trim. WAV has no such problem.
