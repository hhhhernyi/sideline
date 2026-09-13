# TODO

## Release: TestFlight (done for build 3)

- [x] iOS build 3 built and submitted; tested on device
- App record: https://appstoreconnect.apple.com/apps/6811497662/testflight/ios
- An `Team (Expo)` internal testing group was created by the submit and already includes
  hyileenet@gmail.com. Internal testers skip Beta App Review.

Further rounds are now two non-interactive commands — an App Store Connect API key is stored on
EAS and `ascAppId` is pinned in eas.json, so neither prompts for an Apple login:

    npx eas-cli@latest build --platform ios --profile production
    npx eas-cli@latest submit --platform ios --latest

`autoIncrement` handles build numbers; `--latest` resolves to the newest finished build.

## Release: App Store (next)

- [ ] The listing name "Sideline" is TAKEN on the App Store. The record is currently the
      placeholder `Sideline (3fa1a8)` and cannot ship under it. Pick a unique listing name
      ("Sideline Scoreboard", "Sideline — Match Scores"). This is listing metadata only: the
      bundle ID and the home-screen name from app.json both stay "Sideline".
- [ ] Listing metadata: description, keywords, support URL, age rating questionnaire
- [ ] Screenshots must be LANDSCAPE (the app is landscape-locked); 6.7" and 6.5" sizes required.
      Capture them from the TestFlight build on the phone.
- [ ] Privacy / Data Collection: answer "no data collected" — no backend, no storage
- [ ] Set the version's Build, then Add for Review → Submit. Review takes ~24-48h.

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

- [x] Replace the app icon and splash — now the seven-segment split-scoreboard mark
- [x] Scoreboard design pass: undo and the period button are gone, Reset moved to the top-right
      opposite Back at matching size. Scoring is just the panels and their +/- buttons now.
- [ ] Tennis was removed rather than faked: it cannot be expressed as data in `sports.ts`, since
      15/30/40/deuce needs real logic in `lib/game.ts`. Add it back only with that logic.
- [ ] Badminton and volleyball still count linearly with no rally-to-21/25 or win-by-2 handling.
      Same story — needs logic in `lib/game.ts`, not a `sports.ts` entry.
