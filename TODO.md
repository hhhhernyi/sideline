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

## Release: App Store (submitted, awaiting review)

Version 1.0 with build 6 submitted 13 Sep 2026. Review typically takes 24-48h, and
`automaticRelease: true` in store.config.json means approval puts it live without another step.

Listing metadata lives in `store.config.json` — `npx eas-cli@latest metadata:push` writes it,
`metadata:pull` reads back what App Store Connect actually holds. Screenshots, App Privacy,
pricing, copyright and content rights are App Store Connect UI only; eas metadata cannot touch
them.

- Name **Scoreboard - All Sports**. "Sideline", "Scoreboard!" and "Sports Scoreboard" were all
  refused as taken. The reserved-name list is not publicly searchable and the App Store shows no
  published app under any of them, so the only way to test a name is to push it and read the
  error. Listing name only — the bundle ID and the home-screen name are still "Sideline".
- Privacy policy https://hhhhernyi.github.io/scoreboard-privacy/ (GitHub Pages, public repo
  `hhhhernyi/scoreboard-privacy`). **Keep that repo public and Pages enabled** — Apple re-checks
  the URL on every submission, so it has to outlive any one of them.
- iPhone-only as of build 6. `supportsTablet: true` would have required a 13" iPad screenshot set
  and put the app in front of a reviewer on a device its layout has never run on.

If rejected, the likeliest causes are the listing name being read as descriptive text or a query
about the privacy URL. Both are metadata fixes — resubmit without a new build.

## Release: Google Play (not started)

An Android production build and its keystore already exist on EAS from 11 Sep, but they predate
everything in this session — the artwork, the whistle, haptics, win rules. Rebuild rather than
reuse. The delay is not the build: a personal Play account opened after Nov 2023 needs **12
testers running a closed test for 14 continuous days** before production is unlocked, so start
that clock early even if the listing is not finished.

Android also needs its own pass on two things iOS never exercised: `expo-audio` playing with the
phone on silent, and `expo-haptics`, which is a no-op on some devices.

- [ ] **Create the app in Play Console by hand.** The API cannot create a listing, and the first
      upload must go through the console UI. https://play.google.com/console
- [ ] **Build the AAB:** `npx eas-cli@latest build --platform android --profile production`
      (`production` has `autoIncrement`, so versionCode looks after itself)
- [ ] **Testing → Internal testing → Create new release**, upload the `.aab`, add yourself
- [ ] Install from the opt-in link and check the whistle on silent, haptics, and that the
      landscape lock holds on an Android device
- [ ] **Testing → Closed testing**, recruit 12 testers, and leave it running 14 continuous days.
      The count and the clock both reset if testers drop below 12 — this is the long pole.
- [ ] **Store listing:** name, short description (80 chars), full description (4000), feature
      graphic **1024x500** (Play requires this and the App Store has no equivalent, so it has to
      be made from scratch), phone screenshots (min 2, landscape is fine)
- [ ] **Content rating** questionnaire — answer honestly, it will come out "Everyone"
- [ ] **Data safety** — no data collected, no data shared. Mirrors the App Store answer and the
      same privacy URL works: https://hhhhernyi.github.io/scoreboard-privacy/
- [ ] **Ads: none.** Declare it, or the listing is flagged later
- [ ] Once closed testing has run its 14 days: **Production → Create new release**, roll out

Submission from the CLI is possible afterwards with `eas submit --platform android`, but it needs
a Google Service Account JSON key set up first — worth doing once the listing exists, not before.

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
