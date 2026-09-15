# App Review Notes

Answers to Apple's Guideline 2.1 "Information Needed" questionnaire (received 15 Sep 2026 on
v1.0 build 6). This is the boilerplate new-developer questionnaire, not a defect report — no new
build is needed.

Apple asked for this in two places: as a **Resolution Center reply**, and pasted into **App Store
Connect → App Information → App Review Information → Notes**, so it is on file for every future
submission. Part 1 is the reply. Part 2 is the same content shaped for the notes field. Part 3 is
the shot list for the recording.

**Both fields cap at 4000 characters** - the Resolution Center reply box as well as the notes
field, which is not documented anywhere and only shows up when a longer paste is refused. Both
parts here are written to fit, so check the count before adding to either.

---

## Part 1 — Resolution Center reply (3909 chars)

Thank you. Build 6 was tested on a physical iPhone via TestFlight before submission. Everything below has also been added to the App Review Information notes.

1. SCREEN RECORDING
Recorded on a physical iPhone on the latest iOS, starting from the app launching on the Home Screen and showing the typical user flow. Opens without a sign-in:
https://drive.google.com/file/d/1WYupObO1lYo__EGB80pPY0704GJSdnIp/view
The Home Screen name is "Sideline" (the bundle display name); the listing name is "Scoreboard - All Sports". Same app. There is no account registration, login or deletion, no user-generated content, and no paid content or in-app purchases, so none of those appear in the recording. A user may type a team name, but it stays on that one device, is never transmitted, and no other user can see it, so no reporting or blocking mechanism is required.

2. PURPOSE AND AUDIENCE
A manual scoreboard for a game being played in front of the user: for amateur players, coaches, referees, PE teachers and parents. Amateur matches have no scoreboard, so the score is kept in someone's head and gets lost or disputed; this is one anyone can prop on the sideline and read across a pitch. It scores by each sport's real rules rather than as two plain counters - basketball has 1, 2 and 3 point buttons, volleyball runs to 25 win-by-2, badminton to 21 win-by-2 capped at 30.

3. SETUP AND ACCESS
No setup, no login credentials, no demo account and no sample files: nothing is behind a gate. Landscape-only, so please hold the device sideways.
- Launch to the "Pick a sport" grid, then tap Soccer, Basketball, Volleyball or Badminton.
- Tap anywhere on a team panel to add a point (basketball shows 1/2/3 buttons); -1 takes a point back; tap a team's name to rename it, its swatch to recolour it; press and hold the whistle button to whistle for as long as it is held (it plays with the ringer switch off, intentionally, for courtside use); Reset returns the score to 0-0 and keeps names and colours; "Sports" goes back.
- In volleyball and badminton the top bar reads "<team> wins" at the winning score and blocks further points.
- Scores live in memory only; nothing is saved, exported or sent.

4. EXTERNAL SERVICES
None. The app makes no network requests at all and works with no connection. No data or content providers (the sports and their rules are hard-coded in the binary), no authentication service, no payment processor, no AI service, no analytics or tracking SDK, no backend or cloud storage. Built with Expo (React Native); every dependency is an open-source client-side library compiled into the binary. EAS builds it at compile time only; the shipped app contacts no server and OTA updates are disabled. This matches our App Privacy declaration: no data collected.

5. REGIONAL DIFFERENCES
None. The app functions identically in every region and storefront. No geolocation, region detection, server, remote configuration or feature flags, so behaviour cannot vary by region. English (en-US) only.

6. REGULATED INDUSTRY / PROTECTED MATERIAL
Neither applies. It is a manual counter driven entirely by the user's taps: no gambling, betting or wagering, no real-money or simulated gaming, no health or medical data, no financial services, not directed at children. It contains no league, club, team or competition names, logos, marks or kits - "Soccer", "Basketball", "Volleyball" and "Badminton" are the generic sports - and claims no affiliation with any sporting body. No live scores, fixtures or statistics and no data feed; every number on screen was typed by the user. Whistle sound: public domain (CC0 1.0) from Wikimedia Commons, edited by me - https://commons.wikimedia.org/wiki/File:218318_splicesound_referee-whistle-blow-gymnasium.wav Icons: Material Design Icons (Apache 2.0 / SIL OFL). App icon, artwork and screenshots: created by me.

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
