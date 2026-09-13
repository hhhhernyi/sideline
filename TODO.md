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

## Release: App Store (in progress)

Listing metadata is pushed from `store.config.json` with `npx eas-cli@latest metadata:push`, and
`metadata:pull` reads back what App Store Connect actually holds. Done so far:

- [x] Name: **Sideline Scoreboard**. Both "Sideline" and "Scoreboard!" were refused as already
      taken — App Store Connect's reserved-name list is not publicly searchable, so the only way
      to test a name is to push it and see. The bundle ID and the home-screen name stay "Sideline".
- [x] Subtitle, description, keywords, categories (Sports / Utilities), age rating
- [x] Privacy policy URL — https://hhhhernyi.github.io/scoreboard-privacy/, served by GitHub Pages
      from the public repo `hhhhernyi/scoreboard-privacy`. Keep that repo public and Pages enabled:
      Apple re-checks the URL on every submission. It doubles as the support URL for now.

Left, and all of it manual in App Store Connect — `eas metadata` cannot do these:

- [ ] **Screenshots.** 6.7" and 6.5" iPhone, and they must be LANDSCAPE since the app is
      landscape-locked. Capture from the TestFlight build on the phone.
- [ ] **App Privacy questionnaire** (the "Data Collection" section). Answer *no data collected* —
      no backend, no storage, no network. This lives in the ASC UI, not in store.config.json.
- [ ] A real support URL, if the privacy page standing in for it is not good enough
- [ ] Set the version's Build to the one being shipped, then Add for Review → Submit
- [ ] Review takes ~24-48h

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
- [x] Badminton and volleyball now end at a winning score: 21 and 25, both win-by-2, badminton
      capped at 30. Soccer and basketball are played to the clock, so they keep counting.
- [ ] Volleyball is a single game, not a match — there is no set tracking, so "to 25" is one set
      rather than best-of-five. Adding sets means bringing back something like the period state
      that was removed, so it needs a deliberate design rather than a flag.
