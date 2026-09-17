# Sideline

Expo SDK 57 / expo-router / TypeScript scoreboard app. Frontend only — no backend and no
accounts. Finished matches are kept on the device; nothing leaves it except a summary the user
chooses to share.

Read the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-specific
code; APIs have changed across SDKs.

## How a match works

Two modes, chosen on the scoreboard before the first point and locked once play starts — the
rules cannot change under a match already being played.

- **Casual** — one game rather than a best-of, one straight run of the clock rather than halves,
  counting up, no buzzer, no added time, no overtime.
- **Competitive** — the sport's real rules: volleyball best of five with the fifth to 15,
  badminton best of three, halves and quarters counting to their end, added time, overtime.

Sports declare their *competitive* rules in `src/constants/sports.ts`. `casualFormat()` in
`src/lib/game.ts` derives the other mode from them, so there is one set of rules rather than two
that drift apart. How a match is split and how long a part runs are the user's, not the sport's —
the sport only supplies the defaults.

## Conventions

- Screens live in `src/app/` (expo-router file routing). Shared UI in `src/components/`, pure
  logic in `src/lib/`, static config in `src/constants/`.
- Sports are data, not code: add to `SPORTS` rather than special-casing a sport in a screen.
- Anything the rules decide belongs in `src/lib/game.ts`, not in a screen. It is pure, it has no
  imports, and it is the only part under test.
- Styling is plain `StyleSheet.create` + colours from `useTheme()`. No styling libraries, no
  component libraries.
- Sheets are in-tree absolute overlays, never `Modal`: iOS throws when a modal's
  `supportedOrientations` shares nothing with an app locked to landscape. A sheet with a text
  field must lift clear of the keyboard (`useKeyboardHeight`) and scroll its contents — in
  landscape the keyboard takes most of the screen.
- Orientation is owned by `app.json` alone. No runtime orientation code.
- Keep dependencies minimal. Prefer what Expo already ships.

## History

Matches are filed to `expo-sqlite`'s key-value store as they are played, not when they end: a
swipe-up kill runs no cleanup, so the record has to already be on disk. Saving is debounced on
change, ticked while the clock runs, and forced when the app leaves the foreground — all upserts
on a match id.

A record stores its scoreline and period names as **text rendered at save time**, never as rules
to re-derive. A record is a record of what happened; editing the rules later must not rewrite a
game that was already played.

## Before committing

- `npm run typecheck` must pass.
- `npm test` must pass — plain node, no framework, covering the scoring rules and the clock.
  Add to `src/lib/game.test.js` whenever a rule changes.
