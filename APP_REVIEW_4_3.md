# Guideline 4.3(a) — Design — Spam

Rejection received **17 Sep 2026** on v1.0 build 6, after the 2.1 questionnaire had been
answered and the build resubmitted.

## What the rejection actually says

> We noticed the app shares a similar binary, metadata, and/or concept as apps submitted to the
> App Store by you or other developers, with only minor differences.

Read it carefully before answering it:

- **"by you or other developers."** This is a one-app account, so the "by you" half cannot
  apply. The reviewer is saying the *concept* is indistinguishable from apps already listed.
- **It is not an accusation of using a template.** So a reply arguing "this is original
  hand-written code, here is the repository" answers a charge nobody made. Those replies fail.
- **The Extended Review paragraph is account-level.** Resubmitting the same build with a letter
  is the move that escalates towards removal from the Developer Program. A new build is not
  optional here.

And they had a point. Build 6 was 717 lines: tap a panel to score, undo, a whistle, eight
colours, and four sports that differed by three numbers in a constants file. No persistence —
closing the app lost the match. Against the hundreds of free scoreboard apps already listed,
there was little to tell it apart. The listing did not help: **"Scoreboard - All Sports"** is a
keyword string rather than a name, which is itself a 4.3 signal.

## What changed for build 7

Not a longer feature list — a different concept. The app now asks one question before the first
point and behaves like two different apps depending on the answer.

| | Casual | Competitive |
|---|---|---|
| Volleyball | one set, to 25 | best of five, **fifth set to 15** |
| Badminton | one game, to 21 | best of three, win by 2, cap at 30 |
| Soccer | one clock counting up | halves stopping at 45:00, added time signalled +1 to +5 |
| Basketball | one clock counting up | quarters counting **down** to the buzzer, overtime on a tie |
| Controls | score, clock, notes | plus period, length and added-time controls |

Three things carry the difference:

1. **A match log.** Notes are written during play and each one keeps the score, the period and
   the clock at the moment it was written — "Set 2 · 21-19 · 14:20 — review whether the block
   was touched". This is the part no generic scoreboard does, and it is what the reply leads
   with.
2. **Matches are kept.** Saved *as they are played* rather than when they end, so a match
   survives the phone being locked, pocketed or swiped away mid-game. History holds the date,
   sport, teams, set-by-set scoreline, duration and every note.
3. **The match is the user's to define.** Straight through, halves or quarters; any period
   length, not the rulebook's. A rec game runs for as long as the court is booked.

## Part 1 — Resolution Center reply

> Thank you for the review.
>
> We have submitted a new build rather than resubmitting the previous one, because we think the
> observation about the earlier version was fair. Build 6 was a simple score counter, and a
> score counter is not a distinct app.
>
> Build 7 is built around a different idea: that casual play and officiated play need different
> tools, and that a scoreboard should record a match rather than only display a number.
>
> The app asks, before the first point, whether the match is casual or competitive, and that
> answer changes the rules it enforces. In casual play there is one game and one clock counting
> up — no sets, no halves, no buzzer — because a rec game on a booked court is not a fixture.
> In competitive play the sport's real rules apply: volleyball is best of five with the fifth
> set played to 15; badminton is best of three to 21, win by two, capped at 30; soccer has
> halves that stop at 45:00 until added time is signalled; basketball has quarters counting
> down to a buzzer and goes to overtime rather than recording a tie.
>
> The feature we would point to most is the match log. During play, the user can write a note,
> and the app attaches the score, the period and the clock reading at that exact moment — for
> example "Set 2 · 21-19 · 14:20 — review whether the block was touched". Officials and coaches
> keep these notes on paper today. We are not aware of another scoreboard app that captures
> them against the state of the match.
>
> Matches are also now recorded. They are saved continuously as they are played rather than
> when they finish, so a match survives the phone being locked or closed mid-game. The History
> screen keeps the date, sport, teams, set-by-set scoreline, duration and every note, and a
> match can be shared as plain text or deleted.
>
> We have also renamed the listing. The previous name, "Scoreboard - All Sports", was a keyword
> string rather than a name, and we understand why that reads as generic. The app is now
> "Sideline Scoreboard", which matches the name on the home screen, and the description has
> been rewritten around what the app does rather than which sports it covers.
>
> The app remains entirely offline. There are no accounts, no analytics, no tracking and no
> network access of any kind. Match data stays on the device, and the only thing that leaves is
> a summary the user chooses to share.
>
> We would be glad to provide anything further that would help the review.

## Part 2 — Screen recording shot list

Record on a physical iPhone, landscape, one continuous take. Link-share on Drive and verify the
link anonymously before sending — the previous round's link had to be checked this way too.

1. Sport picker. Tap **History** to show past matches, expand one to show its notes, tap
   **Done**.
2. Open **Badminton**, leave it on **CASUAL**. Score to 21 — show the match ending on one game,
   with no set counter anywhere.
3. Back out. Open **Badminton** again, tap **COMPETITIVE**. Score to 21 — show **New Game**
   appearing and the caption reading the set score. Start a second game.
4. Open **Soccer**, **COMPETITIVE**. Open the setup sheet: show Straight / Halves / Quarters and
   the length options. Start the clock, let it run, open **ADDED TIME** and pick +3.
5. Open **Volleyball**. Add a note mid-rally — show the sheet pre-filled with the set, score and
   clock, type a sentence, add it, show it listed.
6. Return to the picker, open **History**, show the match just played with its notes, and tap
   **Share** to show the summary in the share sheet.

## Checklist before submitting

- [ ] Build 7 built and submitted (`eas build` / `eas submit`)
- [ ] `npx eas-cli@latest metadata:push` for the new name and description
- [ ] **New screenshots** at exactly 2796x1290 for 6.9". The old set shows the old app and the
      old name. Never move them through a chat app — Telegram caps photos at 1280px and
      silently destroys a valid capture.
- [ ] Privacy policy URL still live: https://hhhhernyi.github.io/scoreboard-privacy/ — the repo
      `hhhhernyi/scoreboard-privacy` must stay **public**, Apple re-checks it every submission
- [ ] App Privacy still "no data collected" — nothing changed, matches never leave the device
- [ ] Part 1 pasted into Resolution Center (**4000-character cap**, undocumented and uncounted)
- [ ] A rejected version cannot be resubmitted from its own page. Open the 1.0 version page,
      save an edit, **Add for Review**, then **Submit to App Review**. Nothing is submitted
      until the status reads **Waiting for Review**; "Ready for Review" means it is still
      staged.

## If the name is refused

"Sideline", "Scoreboard!" and "Sports Scoreboard" were all refused as already taken, and App
Store Connect's reserved-name list is not publicly searchable — the only way to test a name is
to push it and read the error. If "Sideline Scoreboard" is taken, try in order: **Sideline Match
Log**, **Sideline Scorekeeper**, **Sideline Courtside**. Keep "Sideline" in it either way: it is
the home-screen name, and it is now also the sign-off on every shared summary.
