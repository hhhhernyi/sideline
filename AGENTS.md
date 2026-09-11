# Sideline

Expo SDK 57 / expo-router / TypeScript scoreboard app. Frontend only — no backend, no persistence; match state lives in a `useReducer` for the duration of a game.

Read the versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing Expo-specific code; APIs have changed across SDKs.

## Conventions

- Screens live in `src/app/` (expo-router file routing). Shared UI in `src/components/`, pure logic in `src/lib/`, static config in `src/constants/`.
- Sports are data, not code: add to `SPORTS` in `src/constants/sports.ts` rather than special-casing a sport in a screen.
- Styling is plain `StyleSheet.create` + colours from `useTheme()`. No styling libraries, no component libraries.
- Keep dependencies minimal. Prefer what Expo already ships.
- `npm run typecheck` must pass before committing.
