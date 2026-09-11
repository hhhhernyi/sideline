# TODO

## Release: TestFlight (in progress)

Builds are already queued on EAS and credentials are set up — nothing here is time-sensitive.
Build artifacts are kept for 30 days.

- [ ] Check the iOS build succeeded: https://expo.dev/accounts/hhhhernyi/projects/sideline/builds
- [ ] Submit it: `npx eas-cli@latest submit --platform ios --latest`
      - `--latest` resolves to the most recent finished build, so no file to download
      - Say yes when it offers to create the app record in App Store Connect
      - Expect another Apple login + 2FA code; the saved session expires quickly
- [ ] App Store Connect → TestFlight: wait for the build to leave "Processing" (5-15 min)
- [ ] Create an Internal Testing group and add yourself
      - No Beta App Review for internal testers
      - No export-compliance prompt: `ITSAppUsesNonExemptEncryption: false` is already in app.json
- [ ] Install TestFlight on the iPhone, sign in with the same Apple ID, install Sideline

Updates later are just `eas build` then `eas submit` again — `autoIncrement` handles build numbers.

## Release: Google Play (paused)

An Android production build and its keystore already exist on EAS. Paused because the only test
device is an iPhone.

- [ ] Create the app in Play Console (the API cannot create a listing; the first upload must be
      done by hand through the console)
- [ ] Testing → Internal testing → new release → upload the `.aab`
- [ ] Add testers, share the opt-in link
- [ ] Before production: content rating, data safety (nothing is collected), screenshots
- [ ] Note: personal Play accounts created after Nov 2023 need 12 testers for 14 continuous days
      of closed testing before production. Internal testing is not gated on this.

## App

- [ ] Replace the app icon and splash — `assets/images/` is still the Expo default artwork
- [ ] Tennis and badminton count points linearly, so tennis reads 1-2-3 rather than 15/30/40, and
      "3 sets" means three periods rather than best-of-three. These are the first sports that
      cannot be expressed as data in `sports.ts` alone; real scoring needs logic in `lib/game.ts`
- [ ] Scoreboard still uses the scaffold layout — it has not had the design pass the picker got
