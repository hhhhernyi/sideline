# App Store screenshots

Seven captures from the build 7 TestFlight install on an iPhone Pro Max, already at
**2796 x 1290**, which is Apple's required 6.9" iPhone landscape size. Upload as-is in filename
order — no resizing, no reordering.

`app.json` has `supportsTablet: false`, so the 6.9" iPhone set is the only one the listing needs.

## What each one is for

The App Store shows only the first one or two in search, so the working scoreboard leads and the
set counter follows. The rest are there for the reviewer: build 6 was rejected under 4.3(a) as a
generic score counter, and these are the frames that show it is not one any more.

1. `01-scoreboard-soccer` — a real match in play: 2-1, 38:23, 1st Half, three notes logged.
2. `02-volleyball-sets` — `Set 2 · 1-0` at 24-22. The sport's real rules, live.
3. `03-match-log` — a note being written with the score, period and clock attached to it.
4. `04-history` — a finished match kept on the device, with its notes and its scoreline.
5. `05-competitive-halves` — the casual/competitive pill, which only renders before the first
   point, and the `2 × 45′` the match was set up as.
6. `06-basketball-quarters` — a quarter counting **down**, and per-sport +1/+2/+3 scoring.
7. `07-pick-a-sport` — the four sports and the way into History.

## Rules worth remembering

- Apple accepts only exact pixel sizes and will not scale for you. One screenshot is the
  minimum, ten the maximum.
- Capture on the device, not from `expo start --web` — a browser viewport is the wrong
  resolution and is not the app running on a phone, which is what Apple asks for.
- The clock reads the wall clock, so a frame needing a long clock is staged by turning off
  **Set Automatically** in iOS Date & Time and dragging the time forward while the clock runs.
- **Do not send them through a chat app.** Telegram caps photos at 1280px on the long side,
  which is how the first attempt arrived as 1280 x 590 from a 2796 x 1290 original. AirDrop, or
  send as a *file*.

This folder sits outside `assets/`, so the images are never pulled into the app bundle.
