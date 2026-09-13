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
