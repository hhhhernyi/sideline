# Sideline

A pocket scoreboard for whatever you're playing. Pick a sport, tap to score. No accounts, no storage — everything lives in memory for the current match.

## Run

```sh
npm install
npm start          # Expo dev server; scan QR with Expo Go
npm run ios        # or android / web
npm run typecheck
```

## Layout

```
src/
  app/              expo-router screens
    _layout.tsx     root Stack + theme provider
    index.tsx       sport picker
    game/[sport].tsx  the scoreboard
  components/       reusable UI (TeamPanel)
  constants/
    sports.ts       sport definitions: increments, period names
    theme.ts        colours, spacing
  hooks/            useTheme
  lib/game.ts       score reducer (score / undo / nextPeriod / reset)
assets/images/      icon + splash (still the Expo defaults — replace)
```

## Adding a sport

Add an entry to `SPORTS` in `src/constants/sports.ts`. That's it — the picker and game screen read from it.
