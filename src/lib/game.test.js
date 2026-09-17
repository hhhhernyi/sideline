/**
 * Rules checks for the match model and the clock.
 *
 * Plain node, no test framework and no dependency: `npm test` compiles the two pure modules
 * this covers into .test-build and runs this file against them. Everything here is a rule
 * somebody would notice being wrong at the side of a court - the fifth set played to 15,
 * badminton stopping at 30, a drawn game staying drawn - which is exactly the sort of thing
 * that breaks quietly and is never noticed until a match is already being scored on it.
 */

const g = require('../../.test-build/game.js');
const k = require('../../.test-build/clock.js');
const min = (n) => n * 60_000;

// The sports as declared: competitive rules. Casual is these with the competition stripped.
const VBC = { decidedBy: 'sets', win: { to: 25, by: 2 }, best: 5, decider: { to: 15, by: 2 }, label: 'Set' };
const BDC = { decidedBy: 'sets', win: { to: 21, by: 2, cap: 30 }, best: 3, label: 'Game' };
const VB = { decidedBy: 'sets', win: { to: 25, by: 2 }, label: 'Set' };
const BD = { decidedBy: 'sets', win: { to: 21, by: 2, cap: 30 }, label: 'Game' };
const SO = { decidedBy: 'clock', count: 2, minutes: 45, lengths: [20, 30, 40, 45], countsDown: false };
const BB = { decidedBy: 'clock', count: 4, minutes: 10, lengths: [6, 8, 10, 12], countsDown: true, overtimeMinutes: 5 };
// A casual game: one straight run of the clock, no halves to end.
const ST = { decidedBy: 'clock', count: 1, minutes: 30, lengths: [], countsDown: false };

let pass = 0, fail = 0;
const is = (label, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++; else { fail++; console.log(`FAIL ${label}\n  got  ${JSON.stringify(got)}\n  want ${JSON.stringify(want)}`); }
};

const run = (format, actions, state = g.initialMatch()) =>
  actions.reduce((s, a) => g.matchReducer(s, a, format), state);
const pts = (team, n) => Array.from({ length: n }, () => ({ type: 'score', team, delta: 1 }));
const next = { type: 'advance' };
// Rally to a close score. Scoring one side's points in a row would win the game partway
// through and the reducer would refuse the rest, so the two sides have to trade.
const rally = (h, a) => {
  const out = [];
  for (let i = 0; i < Math.max(h, a); i++) {
    if (i < h) out.push({ type: 'score', team: 'home', delta: 1 });
    if (i < a) out.push({ type: 'score', team: 'away', delta: 1 });
  }
  return out;
};

// --- one game is a whole match: no best-of, nothing to count towards
let s = run(BD, [...pts('home', 21)]);
is('one game ends the match', g.matchWinner(s, BD), 'home');
is('match has an end time', s.endedAt !== null, true);
is('still a single period', s.periods.length, 1);

s = run(VB, [...pts('away', 25)]);
is('volleyball single set wins', g.matchWinner(s, VB), 'away');

// --- a game stays live until the win rule is actually met
s = run(VB, [...rally(24, 24)]);
is('vb 24-24 live', g.periodOver(s, VB), false);
s = run(VB, [{ type: 'score', team: 'home', delta: 1 }], s);
is('vb 25-24 still live', g.periodOver(s, VB), false);
is('vb 25-24 no winner', g.matchWinner(s, VB), null);
s = run(VB, [{ type: 'score', team: 'home', delta: 1 }], s);
is('vb 26-24 takes it', g.matchWinner(s, VB), 'home');

// --- badminton: win by 2, hard cap at 30
s = run(BD, [...rally(20, 20), { type: 'score', team: 'home', delta: 1 }]);
is('bd 21-20 live', g.periodOver(s, BD), false);
is('bd 21-20 score', s.periods[0], { home: 21, away: 20 });
s = run(BD, [...rally(29, 29)]);
is('bd 29-29 live', g.periodOver(s, BD), false);
s = run(BD, [{ type: 'score', team: 'away', delta: 1 }], s);
is('bd 29-30 takes it', g.matchWinner(s, BD), 'away');

// --- a won game refuses points but still takes them back, and undo reopens the match
s = run(BD, [...pts('home', 21)]);
is('won game refuses +1', run(BD, [{ type: 'score', team: 'away', delta: 1 }], s).periods[0], { home: 21, away: 0 });
const undone = run(BD, [{ type: 'score', team: 'home', delta: -1 }], s);
is('won game allows -1', undone.periods[0], { home: 20, away: 0 });
is('undo reopens the game', g.periodOver(undone, BD), false);
is('undo clears the winner', g.matchWinner(undone, BD), null);
is('undo clears the end time', undone.endedAt, null);

// --- another game only happens if someone asks for one
s = run(BD, [...rally(10, 8)]);
is('no new game mid-play', run(BD, [next], s).periods.length, 1);
s = run(BD, [...pts('home', 21), next]);
is('new game appended', s.periods.length, 2);
is('new game is live', s.current, 1);
is('new game reopens the match', g.matchWinner(s, BD), null);
is('first game kept', s.periods[0], { home: 21, away: 0 });

// two games apiece is a draw rather than an invented winner
s = run(BD, [...pts('home', 21), next, ...pts('away', 21)]);
is('one each is a draw', g.matchWinner(s, BD), null);
is('games won', g.periodsWon(s, BD), { home: 1, away: 1 });
s = run(BD, [next, ...pts('home', 21)], s);
is('best of the three played', g.matchWinner(s, BD), 'home');

// --- soccer: points land in the live half, the board shows the match
s = run(SO, [...pts('home', 1), next, ...pts('home', 1), ...pts('away', 2)]);
is('soccer per-half scores', s.periods, [{ home: 1, away: 0 }, { home: 1, away: 2 }]);
is('soccer total', g.totals(s), { home: 2, away: 2 });
is('soccer live match undecided', g.matchWinner(s, SO), null);
s = run(SO, [next], s);
is('soccer draw stays null', g.matchWinner(s, SO), null);
is('soccer finished', s.endedAt !== null, true);
is('soccer stops at two halves', s.periods.length, 2);

s = run(SO, [...pts('home', 2), next, ...pts('away', 1), next]);
is('soccer winner on total', g.matchWinner(s, SO), 'home');

s = run(BB, [...pts('home', 10), next, next, next, next]);
is('basketball has four quarters', s.periods.length, 4);
is('basketball finished', g.matchWinner(s, BB), 'home');

// --- notes capture the moment, not the latest score
const note = (text, clock = 0) => ({ type: 'note', text, clock });
s = run(VB, [...rally(12, 14), note('  review the block touch  ', min(14) + 20_000), ...pts('home', 5)]);
is('note count', s.notes.length, 1);
is('note period', s.notes[0].period, 0);
is('note score frozen', s.notes[0].score, { home: 12, away: 14 });
is('note trimmed', s.notes[0].text, 'review the block touch');
is('note keeps the clock', k.formatClock(s.notes[0].clock), '14:20');
is('empty note ignored', run(VB, [note('   ')]).notes.length, 0);

// a note on a clocked sport freezes the match total, not the half's own score
s = run(SO, [...pts('home', 1), next, ...pts('away', 2), note('handball, watch the replay')]);
is('note on a clocked sport takes the total', s.notes[0].score, { home: 1, away: 2 });
is('note knows its half', s.notes[0].period, 1);

// notes survive the set they were written in, and keep their own periods
s = run(VBC, [...rally(20, 18), note('timeout'), ...pts('home', 5), next, ...pts('away', 25), note('net touch')]);
is('notes accumulate across sets', s.notes.length, 2);
is('first note stayed in set 1', s.notes[0].period, 0);
is('second note is in set 2', s.notes[1].period, 1);
is('notes get separate ids', s.notes[0].id !== s.notes[1].id, true);

// --- a casual game: one straight run of the clock
let c1 = run(ST, [...pts('home', 3), ...pts('away', 1)]);
is('straight game has one period', c1.periods.length, 1);
is('straight game is live', g.matchWinner(c1, ST), null);
c1 = run(ST, [next], c1);
is('one advance finishes it', c1.endedAt !== null, true);
is('straight game still one period', c1.periods.length, 1);
is('straight game winner', g.matchWinner(c1, ST), 'home');

// --- the period noun follows the split, not the sport
is('one part has no halves', g.clockLabel(1), 'Period');
is('two parts are halves', g.clockLabel(2), 'Half');
is('four parts are quarters', g.clockLabel(4), 'Quarter');
is('three parts fall back', g.clockLabel(3), 'Period');

// --- period names, still used by the summary
is('set name', g.periodName(VB, 1), 'Set 2');
is('game name', g.periodName(BD, 2), 'Game 3');
is('half name', g.periodName(SO, 1), '2nd Half');
is('quarter name', g.periodName(BB, 3), '4th Quarter');
is('straight game period name', g.periodName(ST, 0), '1st Period');
is('overtime past a straight game', g.periodName(ST, 1), 'Overtime');
// soccer played as quarters says quarters
is('soccer as quarters', g.periodName({ ...SO, count: 4 }, 2), '3rd Quarter');

// --- clock formatting
is('clock zero', k.formatClock(0), '00:00');
is('clock one second', k.formatClock(1000), '00:01');
is('clock minute and a second', k.formatClock(61_000), '01:01');
is('clock half time', k.formatClock(min(45)), '45:00');
is('clock full time reads 90, not 1:30:00', k.formatClock(min(90)), '90:00');
is('clock never goes negative', k.formatClock(-5000), '00:00');

// a set sport times the whole session and never expires
is('sets clock', k.readClock(VB, min(48)), { text: '48:00', added: null, expired: false });

// soccer counts up, and added time pushes full time back
is('soccer 44:59 live', k.readClock(SO, min(45) - 1000, 45), { text: '44:59', added: null, expired: false });
is('soccer 45:00 up', k.readClock(SO, min(45), 45).expired, true);
is('soccer 45:00 with +2 is not up', k.readClock(SO, min(45), 45, 2), { text: '45:00', added: '+2', expired: false });
is('soccer 46:59 with +2 still live', k.readClock(SO, min(47) - 1000, 45, 2).expired, false);
is('soccer 47:00 with +2 is up', k.readClock(SO, min(47), 45, 2).expired, true);
is('no added time shown at zero', k.readClock(SO, min(10), 45, 0).added, null);

// basketball counts down to the buzzer and stops there
is('basketball starts at the full quarter', k.readClock(BB, 0, 10), { text: '10:00', added: null, expired: false });
is('basketball counts down', k.readClock(BB, min(3), 10).text, '07:00');
is('basketball buzzer', k.readClock(BB, min(10), 10), { text: '00:00', added: null, expired: true });
is('basketball cannot go past the buzzer', k.readClock(BB, min(12), 10).text, '00:00');

// the period length is whatever the match is using, not the sport's default
is('custom 8-minute quarter', k.readClock(BB, min(3), 8).text, '05:00');
is('custom 8-minute buzzer', k.readClock(BB, min(8), 8).expired, true);
is('30-minute half is up at 30', k.readClock(SO, min(30), 30).expired, true);
is('overtime runs its own five', k.readClock(BB, min(5), 5).expired, true);

// --- overtime: basketball has no draw
let t = run(BB, [...pts('home', 10), ...pts('away', 10), next, next, next, next]);
is('level at the buzzer is not a win', g.matchWinner(t, BB), null);
is('four quarters played', t.periods.length, 4);
t = run(BB, [{ type: 'overtime' }], t);
is('overtime adds a period', t.periods.length, 5);
is('overtime is live', t.endedAt, null);
is('overtime is named', g.periodName(BB, 4), 'Overtime');
is('second overtime is numbered', g.periodName(BB, 5), 'Overtime 2');
t = run(BB, [...pts('home', 2), next], t);
is('overtime decides it', g.matchWinner(t, BB), 'home');

// but only from a level, finished game
let u = run(BB, [...pts('home', 2), ...pts('away', 10), next, next, next, next]);
is('no overtime when someone won', run(BB, [{ type: 'overtime' }], u).periods.length, 4);
u = run(BB, [...pts('home', 5), ...pts('away', 5)]);
is('no overtime mid-game', run(BB, [{ type: 'overtime' }], u).periods.length, 1);
// soccer declares no overtime, so a draw stands
let d = run(SO, [...pts('home', 1), ...pts('away', 1), next, next]);
is('soccer draw stands', run(SO, [{ type: 'overtime' }], d).periods.length, 2);

// --- casual is the competitive rules with the competition taken out
is('casual drops the best-of', g.casualFormat(VBC), VB);
is('casual drops the decider', g.casualFormat(VBC).decider, undefined);
is('casual badminton', g.casualFormat(BDC), BD);
is('casual clock is one straight period', g.casualFormat(BB).count, 1);
is('casual clock counts up', g.casualFormat(BB).countsDown, false);
is('casual clock has no overtime', g.casualFormat(BB).overtimeMinutes, undefined);
is('casual keeps the win rule', g.casualFormat(VBC).win, { to: 25, by: 2 });

// --- competitive volleyball: best of five, and a set is not the match
let v = run(VBC, [...pts('home', 25)]);
is('competitive set won is not the match', g.matchWinner(v, VBC), null);
is('competitive set is over', g.periodOver(v, VBC), true);
is('set score after one', g.periodsWon(v, VBC), { home: 1, away: 0 });
v = run(VBC, [next, ...pts('home', 25), next, ...pts('home', 25)], v);
is('three sets takes it', g.matchWinner(v, VBC), 'home');
is('three sets played', v.periods.length, 3);
is('match ended itself', v.endedAt !== null, true);

// the same points casually are a whole match after one set
is('casual one set is the match', g.matchWinner(run(VB, [...pts('home', 25)]), VB), 'home');

// --- the fifth set is to 15, and only the fifth
v = run(VBC, [
  ...pts('home', 25), next, ...pts('away', 25), next,
  ...pts('home', 25), next, ...pts('away', 25), next,
  ...pts('home', 15),
]);
is('fifth set to 15 wins it', g.matchWinner(v, VBC), 'home');
is('final set score', g.periodsWon(v, VBC), { home: 3, away: 2 });
is('fifth set rule', g.ruleFor(VBC, 4), { to: 15, by: 2 });
is('fourth set rule', g.ruleFor(VBC, 3), { to: 25, by: 2 });
is('casual has no decider to reach', g.ruleFor(VB, 4), { to: 25, by: 2 });

// --- competitive badminton: best of three
let b = run(BDC, [...pts('home', 21), next, ...pts('away', 21)]);
is('one game each is not a win', g.matchWinner(b, BDC), null);
b = run(BDC, [next, ...pts('home', 21)], b);
is('third game decides', g.matchWinner(b, BDC), 'home');
is('a best-of-three cannot run to four', run(BDC, [next], b).periods.length, 3);

// --- a mis-tap that ended a competitive match can still be taken back
b = run(BDC, [...pts('home', 21), next, ...pts('home', 21)]);
is('two straight games wins', g.matchWinner(b, BDC), 'home');
b = run(BDC, [{ type: 'score', team: 'home', delta: -1 }], b);
is('undo reopens the match', g.matchWinner(b, BDC), null);
is('undo clears the end time', b.endedAt, null);

// --- a casual clock never runs out, whatever the sport
is('casual soccer clock', k.readClock(g.casualFormat(SO), min(52), 0), { text: '52:00', added: null, expired: false });
is('casual basketball counts up', k.readClock(g.casualFormat(BB), min(7), 0).text, '07:00');

// --- the scoreline history files away
is('casual single game', g.scoreline(run(BD, [...rally(21, 19)]), BD), '21 - 19');
is('casual clock game', g.scoreline(run(ST, [...pts('home', 3), ...pts('away', 1)]), ST), '3 - 1');

// a competitive set match leads with sets and breaks out the games. Note the third set runs to
// 25, not 15 - only a genuine fifth set is the decider.
let sl = run(VBC, [
  ...rally(25, 22), next, ...rally(21, 25), next, ...rally(25, 20), next, ...rally(25, 18),
]);
is('competitive sets scoreline', g.scoreline(sl, VBC), '3 - 1 (25-22, 21-25, 25-20, 25-18)');
is('competitive match is won', g.matchWinner(sl, VBC), 'home');
// one set played and abandoned still reads as sets, because a best-of was declared
is('competitive one set', g.scoreline(run(VBC, [...rally(25, 22)]), VBC), '1 - 0');

// a clocked match leads with the total and breaks out the halves
sl = run(SO, [...pts('home', 1), next, ...pts('home', 1), ...pts('away', 2), next]);
is('halves scoreline', g.scoreline(sl, SO), '2 - 2 (1-0, 1-2)');
sl = run(BB, [...pts('home', 10), next, ...pts('away', 8), next, next, next]);
is('quarters scoreline', g.scoreline(sl, BB), '10 - 8 (10-0, 0-8, 0-0, 0-0)');

// two casual games in a row lead with games won, not points
sl = run(BD, [...pts('home', 21), next, ...rally(19, 21)]);
is('two casual games', g.scoreline(sl, BD), '1 - 1 (21-0, 19-21)');

// a match with an id, so history can file it twice without duplicating it
const fresh = g.initialMatch(1758000000000);
is('match has an id', typeof fresh.id === 'string' && fresh.id.length > 0, true);
is('ids differ between matches', g.initialMatch().id !== g.initialMatch().id, true);
is('reset starts a new match', run(BD, [...pts('home', 5), { type: 'reset' }]).id !== fresh.id, true);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
