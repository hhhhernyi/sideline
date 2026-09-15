# App Review Notes

Answers to Apple's Guideline 2.1 "Information Needed" questionnaire (received 15 Sep 2026 on
v1.0 build 6). This is the boilerplate new-developer questionnaire, not a defect report — no new
build is needed.

Apple asked for this in two places: as a **Resolution Center reply**, and pasted into **App Store
Connect → App Information → App Review Information → Notes**, so it is on file for every future
submission. Part 1 is the reply. Part 2 is the same content trimmed under the Notes field's
4000-character limit. Part 3 is the shot list for the recording.

---

## Part 1 — Resolution Center reply

Thank you for the review. Build 6 was tested on a physical iPhone via TestFlight before
submission. Here is all of the information requested.

**1. Screen recording**

Here is a screen recording made on a physical iPhone running the latest iOS, beginning with the
app being launched from the Home Screen and showing the typical user flow end to end:

https://drive.google.com/file/d/1WYupObO1lYo__EGB80pPY0704GJSdnIp/view

(The link opens without a sign-in. All of the information below has also been added to the Notes
field of the App Review Information section, as requested, for reference on future submissions.)

Please note the app's Home Screen name is **Sideline** — that is the bundle's display name. The
App Store listing name is "Scoreboard - All Sports". They refer to the same app.

The three items Apple asks to have included in the recording do not exist in this app, so none of
them appear in it:

- **Account registration, login and deletion** — the app has no accounts of any kind. There is
  no sign-up, no sign-in, no profile and no server, so there is nothing to delete.
- **User-generated content** — none is shared or published. A user may type a team's name (for
  example changing "Home" to "Lions"), but that text stays in memory on the one device, is never
  transmitted, stored or shown to any other user, and disappears when the screen is left. No
  other user can ever see it, so there is no content to report or block and no moderation
  mechanism is required.
- **Paid content or features** — there are none. No in-app purchases, no subscriptions, no
  unlockable features, no advertising. Every feature is available to everyone immediately.

**2. The app's purpose and target audience**

Scoreboard - All Sports turns an iPhone into a large, readable manual scoreboard for a game being
played in front of the user.

*Problem it solves:* amateur and recreational matches have no scoreboard. At school games, club
training, pick-up games, PE lessons and games in a park, the score is kept in someone's head or
on a scrap of paper, where it gets lost or disputed. This app is a scoreboard that anyone can
prop on the sideline and read from across a pitch or court.

*Target audience:* recreational and amateur players, coaches, referees, PE teachers and parents
watching a game. It is deliberately for people who want to start counting in two taps, with no
account and no setup.

*Value it provides:* the score is kept with the real rules of each sport rather than by two plain
counters — basketball has separate 1, 2 and 3 point buttons; volleyball runs to 25 win-by-two;
badminton runs to 21 win-by-two, capped at 30 — so the app announces the winner at the correct
moment. It is readable at a distance, works one-handed, and includes a real whistle that sounds
even with the ringer switch off, because a courtside phone is usually silenced.

**3. Instructions for setting up and accessing the main features**

No setup is required and none is possible. There are no login credentials, no demo account and no
sample files, because nothing in the app is behind a gate — every feature is reachable from
launch. The app is landscape-only and locks to landscape, so please hold the device sideways.

- **Launch** → the "Pick a sport" screen, a grid of four cards: Soccer, Basketball, Volleyball,
  Badminton. Tap any card to open the scoreboard for that sport.
- **Scoreboard screen** — two team panels, Home on the left, Away on the right:
  - *Add a point:* tap anywhere on a team's panel. Basketball instead shows separate 1, 2 and 3
    point buttons on each panel.
  - *Take a point back:* the −1 button on that team's panel.
  - *Rename a team:* tap the team's name ("Home" or "Away") and type. It is a plain text field.
  - *Change a team's colour:* tap the colour swatch on the panel, then choose from eight presets.
  - *Whistle:* press and hold the whistle button. It sounds for as long as it is held, and plays
    with the ringer switch off, which is intentional for courtside use.
  - *Reset:* the Reset button in the top bar returns the score to 0–0. Team names and colours are
    deliberately kept.
  - *Winner:* in volleyball and badminton, the top bar changes to "<team> wins" once the winning
    score is reached, and further points are blocked (−1 still works, so a mis-tap that ended the
    game early can be undone).
  - *Back:* "‹ Sports" in the top bar returns to the sport picker.
- Scores live in memory for the life of the screen only. Nothing is saved to disk, exported or
  transmitted, by design.

**4. External services, tools or platforms used to deliver core functionality**

None. The app makes no network requests at all — it has no networking code and needs no
connection to work. Specifically:

- **Data or content providers:** none. Nothing is fetched. The four sports and their scoring
  rules are hard-coded in the app binary.
- **Authentication services:** none. There are no accounts.
- **Payment processors:** none. Nothing is sold — no in-app purchases, subscriptions or ads.
- **AI services:** none. No machine learning, on-device or remote.
- **Analytics, attribution, crash reporting or tracking SDKs:** none.
- **Backend or cloud storage:** none.

The app is built with Expo (React Native). Everything it contains is an open-source client-side
library compiled into the binary: expo-router (navigation), expo-audio (plays the whistle file
bundled in the app), expo-haptics (Taptic feedback when a point is scored), and
react-native-reanimated, react-native-gesture-handler and react-native-safe-area-context for the
interface. The binary is compiled on Expo Application Services (EAS), which is a build service
used at compile time only — the shipped app never contacts Expo or any other server, and
over-the-air updates are not enabled.

This is consistent with our App Privacy declaration: no data is collected.

**5. Regional differences**

There are none. The app behaves identically in every region and on every storefront. It contains
no geolocation, no region or locale detection, no server, no remote configuration and no feature
flags, so there is no mechanism by which behaviour or content could vary by region. The interface
is English (en-US) only and is not localised. No feature or content is region-locked, and nothing
is withheld in any territory.

**6. Regulated industry or protected third-party material**

Neither applies to this app.

*Not a regulated industry.* It is a manual counter operated entirely by the user's taps. There is
no gambling, betting, odds or wagering, no real-money or simulated gaming, no health, medical or
fitness data, no financial services, and it is not directed at children (no Kids Category).

*No protected third-party material.* The app contains no licensed sports content of any kind:

- No league, club, federation, team, competition or player names, logos, marks or kits. "Soccer",
  "Basketball", "Volleyball" and "Badminton" are the generic names of the sports themselves. The
  app is not affiliated with, endorsed by or licensed from any sporting body, and claims no such
  association anywhere in the app or its metadata.
- No live scores, fixtures, standings, statistics or any other licensed sports data. The app has
  no data feed. Every number on screen was typed by the user tapping the screen.
- **Whistle sound:** a public-domain recording released under CC0 1.0 on Wikimedia Commons, which
  I edited for this app. Source:
  https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav
- **Icons:** Material Design Icons (MaterialCommunityIcons), Apache 2.0 / SIL OFL.
- **App icon, in-app artwork and all App Store screenshots:** created by me for this app.

Please let me know if anything further would help.

---

## Part 2 — App Review Information → Notes (condensed, fits the 4000-char limit)

SCREEN RECORDING (physical iPhone, latest iOS, begins at launch):
https://drive.google.com/file/d/1WYupObO1lYo__EGB80pPY0704GJSdnIp/view

Scoreboard - All Sports is a manual scoreboard for a game being played in front of the user. Pick
one of four sports (soccer, basketball, volleyball, badminton), optionally rename the two teams
and pick their colours, then tap a team's panel to add a point. It is for amateur players,
coaches, referees, PE teachers and parents, where no scoreboard exists and the score is otherwise
kept in someone's head.

HOME SCREEN NAME: the app installs as "Sideline" (the bundle display name). The listing name is
"Scoreboard - All Sports". Same app.

NO ACCOUNTS / DEMO ACCOUNT: not applicable. There is no registration, sign-in, profile or account
deletion, because the app has no accounts, no server and no setup. Nothing is behind a gate, so no
credentials or sample files are needed.

HOW TO REACH EVERY FEATURE (landscape-only - please hold the device sideways; no setup):
- Launch to the "Pick a sport" grid, then tap Soccer, Basketball, Volleyball or Badminton.
- Tap anywhere on a team panel to add a point (basketball shows 1/2/3 point buttons); -1 takes a
  point back; tap a team's name to rename it; tap its swatch to pick from 8 colours; press and
  hold the whistle button to whistle for as long as it is held (it plays with the ringer switch
  off, intentionally, for courtside use); Reset returns the score to 0-0 and keeps names and
  colours; "Sports" in the top bar goes back.
- Volleyball ends at 25 win-by-2 and badminton at 21 win-by-2 capped at 30; the top bar then
  reads "<team> wins" and blocks further points, while -1 still works to undo a mis-tap.
- Scores live in memory only, for the life of the screen. Nothing is saved, exported or sent.

NO USER-GENERATED CONTENT: a user may type a team name, but it stays in memory on that one
device, is never transmitted, and no other user can ever see it. There is therefore no content to
report or block and no moderation mechanism is required.

NO PAID CONTENT: no in-app purchases, subscriptions, unlockable features or advertising.

EXTERNAL SERVICES: none. The app makes no network requests at all and works with no connection.
No data or content providers (the four sports and their rules are hard-coded in the binary), no
authentication service, no payment processor, no AI service, no analytics or tracking SDK, and no
backend or cloud storage. Built with Expo (React Native); every dependency is an open-source
client-side library compiled into the binary. EAS is a compile-time build service only; the
shipped app contacts no server and OTA updates are disabled. Consistent with our App Privacy
declaration: no data collected.

REGIONAL DIFFERENCES: none. Identical in every region and storefront. No geolocation, region
detection, server, remote config or feature flags, so behaviour cannot vary by region. English
(en-US) only. Nothing is region-locked.

REGULATED INDUSTRY: not applicable. A manual counter driven entirely by the user's taps. No
gambling, betting or wagering, no real-money or simulated gaming, no health or medical data, no
financial services, not directed at children.

THIRD-PARTY MATERIAL: none that is protected. No league, club, federation, team or competition
names, logos, marks or kits - "Soccer", "Basketball", "Volleyball" and "Badminton" are the generic
sports. No affiliation with or endorsement by any sporting body is held or claimed. No live
scores, fixtures or statistics, and no data feed - every number on screen was typed by the user.
Whistle sound: public domain (CC0 1.0) from Wikimedia Commons, edited by me -
https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav
Icons: Material Design Icons, Apache 2.0 / SIL OFL. App icon, artwork and screenshots: created by
me for this app.

---

## Part 3 — Screen recording shot list

Apple's requirements: a **physical device** (not the simulator), **latest iOS**, starting with the
app **launching**, showing the **typical user flow**. Aim for 60-90 seconds.

Capture with iOS Control Center → Screen Recording. Leave the microphone **off** — in-app audio is
captured either way, and the whistle needs to be audible. Hold the phone in **landscape** for the
whole recording; the app locks to landscape and a portrait recording of it is hard to read.

1. **Start on the Home Screen** with the app icon visible, recording already running. Tap the
   **Sideline** icon and let the splash screen and launch play out in full — do not cut into an
   already-open app, as the recording has to begin with the launch.
2. **"Pick a sport" screen** — pause about two seconds so all four cards are legible, then tap
   **Basketball** (best first choice: it shows the 1/2/3 point buttons, which is the feature least
   obvious from a screenshot).
3. **Score a few points** — tap the 2 and 3 point buttons on each side so the numbers visibly
   climb, then press **−1** once to show a point being taken back.
4. **Rename a team** — tap "Home", type a real name (e.g. "Lions"), dismiss the keyboard. Do the
   same for "Away" if there is time.
5. **Change a colour** — tap a team's colour swatch, pick a different preset, and let the panel
   visibly change colour.
6. **Whistle** — press and hold the whistle button for two seconds so a sustained blast is
   audible, release, then give it two short taps. This is the moment to be sure the device volume
   is up and the recording is capturing app audio.
7. **Reset** — tap Reset and show the score return to 0-0 while the team names and colours stay.
8. **Back and a second sport** — tap "‹ Sports", then open **Badminton**. Tap one side up to the
   win (21, win by two) so the reviewer sees the title bar change to "<team> wins" and further
   taps stop scoring. Press **−1** once to show the board becoming live again.
9. **End on the scoreboard**, hold still for two seconds, then stop the recording.

Deliver it two ways, because the Notes field cannot hold a file:

- **Resolution Center:** attach the video file directly to the reply.
- **App Review Information → Notes:** paste a link (an unlisted YouTube video or a public Dropbox
  or Google Drive link that needs no sign-in) alongside the Part 2 text, so future submissions
  have it on file. Verify the link opens in a private browser window — a link a reviewer cannot
  open reads as no recording at all.
