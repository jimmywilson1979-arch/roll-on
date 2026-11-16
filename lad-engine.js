// =====================================================================
// Roll On · Snakes & Ladders — rules engine.
// Styles: Classic, Power-ups (land on stars to collect cards), Moving
// board (snakes and ladders shift every few rounds), or Everything.
// Themes: Jungle (snakes and ladders), Christmas (slides and candy-cane
// ladders), Space (black holes and rockets).
// Pure logic: the TV runs it; phones only see their own cards.
// =====================================================================
(function (root) {
  const L = {};
  L.now = () => Date.now();
  L.rng = Math.random;
  L.pace = 1; // the TV slows things down a little when the narrator is on
  const R = n => L.rng() * n | 0;
  const rand = (a, b) => a + R(b - a + 1);
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- themes ----------
  L.THEMES = {
    jungle: {
      key: "jungle", label: "🌴 Jungle", title: "Snakes & Ladders", icon: "🐍",
      down: "snake", downs: "snakes", up: "ladder", ups: "ladders", star: "⭐", starName: "power star",
      start: "🌴", finish: "🏆", finishName: "the top of the jungle",
      intro: "Welcome to the jungle! Climb the ladders, dodge the snakes, and be first to square 100.",
      warn: "The jungle is rumbling… snakes and ladders will move next round!",
      shifted: "The jungle shifts! Some snakes and ladders have moved.",
      pieces: [["j-lion", "🦁", "Lion"], ["j-tiger", "🐯", "Tiger"], ["j-chimpanzee", "🐵", "Chimp"], ["j-giraffe", "🦒", "Giraffe"], ["j-african-elephant", "🐘", "Elephant"], ["j-scarlet-macaw", "🦜", "Parrot"], ["j-sloth", "🦥", "Sloth"], ["j-zebra", "🦓", "Zebra"]],
      slideSay: ["Hisss! {n} slides down a snake to {to}.", "Oh no! A snake! {n} slithers down to {to}.", "Snake! Down goes {n} to square {to}."],
      climbSay: ["Up the ladder! {n} climbs to {to}.", "{n} finds a ladder and climbs to {to}!", "A ladder! Up, up, up to {to}!"],
    },
    xmas: {
      key: "xmas", label: "🎄 Christmas", title: "Slides & Ladders", icon: "🎄",
      down: "slide", downs: "slides", up: "candy-cane ladder", ups: "candy-cane ladders", star: "🎁", starName: "present",
      start: "🏠", finish: "🎄", finishName: "the Christmas tree",
      intro: "It's nearly Christmas! Climb the candy-cane ladders, watch out for the icy slides, and race to the tree on square 100.",
      warn: "Ho ho ho… the elves are moving things around next round!",
      shifted: "The elves have been busy! Some slides and ladders have moved.",
      pieces: [["token-santa", "🎅", "Santa"], ["token-snowman", "⛄", "Snowman"], ["token-reindeer", "🦌", "Reindeer"], ["token-elf", "🧝", "Elf"], ["token-penguin", "🐧", "Penguin"], ["token-present", "🎁", "Present"], ["token-gingerbread", "🍪", "Gingerbread"], ["token-bell", "🔔", "Bell"]],
      slideSay: ["Wheee! {n} whooshes down an icy slide to {to}.", "Slippery! {n} slides all the way down to {to}.", "Whoops, ice! Down slides {n} to {to}."],
      climbSay: ["A candy-cane ladder! {n} climbs to {to}.", "Up the candy cane goes {n}, to square {to}!", "Ho ho ho! {n} climbs up to {to}."],
    },
    space: {
      key: "space", label: "🚀 Space", title: "Black Holes & Rockets", icon: "🚀",
      down: "black hole", downs: "black holes", up: "rocket", ups: "rockets", star: "💫", starName: "star",
      start: "🌍", finish: "🪐", finishName: "the far planet",
      intro: "Three, two, one, blast off! Ride the rockets, avoid the black holes, and be first to reach the planet on square 100.",
      warn: "Warning! A meteor storm is coming… the black holes and rockets will move next round!",
      shifted: "Meteor storm! Some black holes and rockets have moved.",
      pieces: [["s-earth", "🌍", "Earth"], ["s-mars", "🔴", "Mars"], ["s-saturn", "🪐", "Saturn"], ["s-jupiter", "🟠", "Jupiter"], ["s-neptune", "🔵", "Neptune"], ["s-the-moon", "🌕", "Moon"], ["s-venus", "🟡", "Venus"], ["s-uranus", "🩵", "Uranus"]],
      slideSay: ["Uh oh! {n} gets sucked into a black hole, and pops out at {to}.", "Black hole! {n} spins all the way down to {to}.", "Whoosh! The black hole drags {n} back to {to}."],
      climbSay: ["Blast off! {n} rides a rocket to {to}!", "Rocket! {n} zooms up to {to}.", "Three, two, one… {n} launches to {to}!"],
    },
  };
  L.t = S => L.THEMES[S.settings.theme] || L.THEMES.jungle;

  // ---------- power-up cards ----------
  L.CARDS = {
    shield: { icon: "🛡️", name: "Shield", txt: t => `Saves you from the next ${t.down}. It works by itself.`, w: 2 },
    double: { icon: "⚡", name: "Double dice", txt: () => "Roll two dice this turn.", w: 2 },
    pick: { icon: "🎯", name: "Pick a number", txt: () => "Choose your own roll, from 1 to 6.", w: 2 },
    push: { icon: "💨", name: "Push back", txt: () => "Send a player back 5 squares.", w: 2 },
    swap: { icon: "🔄", name: "Swap places", txt: () => "Swap places with any player.", w: 1 },
    freeze: { icon: "🧊", name: "Freeze", txt: () => "Pick a player. They miss their next go.", w: 1 },
  };
  L.TARGETED = ["push", "swap", "freeze"];
  L.MAXCARDS = 3;
  const drawCard = () => { const bag = []; Object.entries(L.CARDS).forEach(([k, c]) => { for (let i = 0; i < c.w; i++) bag.push(k); }); return bag[R(bag.length)]; };

  L.STYLES = { classic: "🎲 Classic", powers: "⭐ Power-ups", moving: "🌀 Moving board", all: "🎉 Everything" };
  L.powers = S => S.settings.style === "powers" || S.settings.style === "all";
  L.moving = S => S.settings.style === "moving" || S.settings.style === "all";
  L.SHIFT_EVERY = 3;
  L.SETTINGS = () => [
    ["theme", "Theme", Object.values(L.THEMES).map(t => [t.key, t.label])],
    ["style", "Style", Object.entries(L.STYLES).map(([k, v]) => [k, v])],
    ["finish", "Finishing", [["quick", "🏁 Any roll gets you home"], ["bounce", "↩️ Exact roll (bounce back)"]]],
    ["six", "Roll a 6", [["again", "🎲 Go again"], ["no", "No extra go"]]],
    ["bots", "🤖 Computer players", [["auto", "Auto"], [0, "None"], [1, "1"], [2, "2"], [3, "3"]]],
  ];
  const COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#a66bff", "#ff8a3d", "#1fd1c1", "#ff6fb5"];
  const BOT_NAMES = ["Robo Rex", "Beep", "Sparky", "Bolt", "Widget", "Gizmo", "Pixel"];

  // ---------- board geometry ----------
  L.N = 100;
  L.row = sq => (sq - 1) / 10 | 0;               // 0 = bottom row
  L.col = sq => { const r = L.row(sq), c = (sq - 1) % 10; return r % 2 ? 9 - c : c; };
  L.xy = sq => sq <= 0 ? [.4, 9.55] : [L.col(sq) + .5, 9 - L.row(sq) + .5]; // board units, 0..10, y down
  // do two snakes/ladders cross? (so the board stays easy to read)
  const cross = (a, b) => { const [p1, p2, p3, p4] = [L.xy(a[0]), L.xy(a[1]), L.xy(b[0]), L.xy(b[1])]; const d = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); const d1 = d(p3, p4, p1), d2 = d(p3, p4, p2), d3 = d(p1, p2, p3), d4 = d(p1, p2, p4); return ((d1 > 0) !== (d2 > 0)) && ((d3 > 0) !== (d4 > 0)); };
  const near = (a, b) => [a[0], a[1]].some(q => [b[0], b[1]].some(r => Math.hypot(L.xy(q)[0] - L.xy(r)[0], L.xy(q)[1] - L.xy(r)[1]) < 1.01));

  function genBoard(S) {
    for (let tries = 0; tries < 600; tries++) {
      const used = new Set([1, L.N]), ladders = [], snakes = [], stars = [];
      const free = q => q > 1 && q < L.N && !used.has(q);
      let ok = true;
      for (let k = 0; k < 8 && ok; k++) { const e = makeLadder(used, null, ladders); if (!e) ok = false; else ladders.push(e); }
      for (let k = 0; k < 8 && ok; k++) { const e = makeSnake(used, null, snakes); if (!e) ok = false; else snakes.push(e); }
      if (!ok) continue;
      // power stars: spread out, one per row band where possible
      for (let r = 0; r < 9 && stars.length < 9; r++) { const opts = Array.from({ length: 10 }, (_, i) => r * 10 + 1 + i).filter(free); if (opts.length) { const q = opts[R(opts.length)]; stars.push(q); used.add(q); } }
      if (trapped(snakes)) continue;
      return { ladders, snakes, stars };
    }
    return { ladders: [[4, 25], [13, 46], [33, 49], [42, 63], [50, 69], [62, 81], [74, 92], [8, 30]], snakes: [[27, 5], [40, 3], [43, 18], [54, 31], [66, 45], [76, 58], [89, 53], [99, 41]], stars: [11, 22, 36, 48, 57, 68, 73, 85, 94] };
  }
  function makeLadder(used, avoid, others) {
    for (let k = 0; k < 400; k++) {
      const a = rand(2, 82), b = Math.min(L.N - 1, a + rand(11, 32));
      if (used.has(a) || used.has(b) || L.row(a) === L.row(b) || Math.abs(L.col(a) - L.col(b)) > 3 || (avoid && (avoid.has(a) || avoid.has(b)))) continue;
      if (others && others.some(o => cross(o, [a, b]) || near(o, [a, b]))) continue;
      used.add(a); used.add(b); return [a, b];
    }
    return null;
  }
  function makeSnake(used, avoid, others) {
    for (let k = 0; k < 400; k++) {
      const h = rand(18, 99), t = Math.max(2, h - rand(11, 36));
      if (used.has(h) || used.has(t) || L.row(h) === L.row(t) || Math.abs(L.col(h) - L.col(t)) > 5 || (avoid && (avoid.has(h) || avoid.has(t)))) continue;
      if (others && others.filter(o => cross(o, [h, t])).length > 0) continue;
      used.add(h); used.add(t); return [h, t];
    }
    return null;
  }
  const trapped = snakes => { const heads = new Set(snakes.map(s => s[0])); for (let q = 2; q < L.N - 6; q++) { let all = true; for (let d = 1; d <= 6; d++) if (!heads.has(q + d)) { all = false; break; } if (all) return true; } return false; };
  L.usedSquares = B => new Set([1, L.N, ...B.ladders.flat(), ...B.snakes.flat(), ...B.stars]);

  // what's on a square
  L.snakeAt = (S, q) => S.board.snakes.find(s => s[0] === q);
  L.ladderAt = (S, q) => S.board.ladders.find(l => l[0] === q);
  L.starAt = (S, q) => L.powers(S) && S.board.stars.includes(q);
  // where a piece ends up after landing on q (no side effects); used by the helper and the computer players
  L.landing = (S, q, hasShield) => { const s = L.snakeAt(S, q); if (s && !hasShield) return s[1]; const l = L.ladderAt(S, q); if (l) return l[1]; return q; };
  L.target = (S, pos, n) => { let q = pos + n; if (q > L.N) q = S.settings.finish === "bounce" ? L.N - (q - L.N) : L.N; return q; };
  L.preview = (S, p, n) => { const q = L.target(S, p.pos, n); return { q, end: L.landing(S, q, (p.cards || []).includes("shield")), snake: !!L.snakeAt(S, q), ladder: !!L.ladderAt(S, q), star: L.starAt(S, q) }; };

  function log(S, s) { S.log.push(s); if (S.log.length > 40) S.log.shift(); }
  // fx: things the TV and phones react to (sounds, narration). "at" = when it should happen on screen.
  function fx(S, o, delay) { S.fxN = (S.fxN || 0) + 1; o.n = S.fxN; o.at = L.now() + (delay || 0); S.fx.push(o); if (S.fx.length > 16) S.fx.shift(); }

  // ---------- lobby ----------
  L.newState = room => ({ v: 1, room, phase: "lobby", settings: { theme: "jungle", style: "all", finish: "quick", six: "again", bots: "auto" }, players: {}, order: [], host: null, log: [], fx: [], fxN: 0, board: null });
  L.setSetting = (S, k, v) => {
    if (!(S.phase === "lobby" || S.phase === "end")) return false;
    if (k === "theme" && L.THEMES[v]) S.settings.theme = v;
    else if (k === "style" && L.STYLES[v]) S.settings.style = v;
    else if (k === "finish" && ["quick", "bounce"].includes(v)) S.settings.finish = v;
    else if (k === "six" && ["again", "no"].includes(v)) S.settings.six = v;
    else if (k === "bots" && (v === "auto" || [0, 1, 2, 3].includes(+v))) S.settings.bots = v === "auto" ? "auto" : +v;
    else return false;
    if (S.phase === "lobby") S.board = genBoard(S); // the lobby shows a fresh board
    return true;
  };
  L.humans = S => S.order.filter(id => !S.players[id].bot);
  L.join = (S, id, name, kid) => {
    name = String(name || "").trim().slice(0, 14) || "Player";
    if (S.players[id]) { const p = S.players[id]; p.name = name; p.kid = !!kid; return "ok"; }
    // same name on a new phone takes back their place
    const same = S.order.find(x => !S.players[x].bot && S.players[x].name.toLowerCase() === name.toLowerCase());
    if (same && S.phase !== "lobby") { const p = S.players[same]; delete S.players[same]; p.id = id; S.players[id] = p; S.order = S.order.map(x => x === same ? id : x); if (S.host === same) S.host = id; if (S.turnPid === same) S.turnPid = id; return "ok"; }
    if (S.phase !== "lobby") return "watch";
    if (L.humans(S).length >= 8) return "full";
    const used = new Set(S.order.map(x => S.players[x].ci)), ci = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !used.has(i));
    S.players[id] = { id, name, kid: !!kid, ci, color: COLORS[ci], pos: 0, cards: [], frozen: 0 };
    S.order.push(id); if (!S.host) S.host = id;
    return "ok";
  };
  L.leaveLobby = (S, id) => { if (S.phase !== "lobby" || !S.players[id]) return; delete S.players[id]; S.order = S.order.filter(x => x !== id); if (S.host === id) S.host = S.order[0] || null; };
  L.botCount = S => { const h = L.humans(S).length, b = S.settings.bots; return Math.max(0, Math.min(8 - h, b === "auto" || b == null ? (h === 1 ? 2 : 0) : +b)); };
  function addBots(S) {
    S.order.filter(id => S.players[id].bot).forEach(id => delete S.players[id]);
    S.order = S.order.filter(id => S.players[id]);
    const n = L.botCount(S), names = shuffle(BOT_NAMES);
    for (let k = 0; k < n; k++) { const used = new Set(S.order.map(x => S.players[x].ci)), ci = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !used.has(i)); S.players["bot" + k] = { id: "bot" + k, name: names[k], kid: false, bot: true, ci, color: COLORS[ci], pos: 0, cards: [], frozen: 0 }; S.order.push("bot" + k); }
  }
  L.start = S => {
    if (!L.humans(S).length) return false;
    addBots(S);
    if (!S.board) S.board = genBoard(S);
    S.order = shuffle(S.order);
    S.order.forEach(id => Object.assign(S.players[id], { pos: 0, cards: [], frozen: 0 }));
    Object.assign(S, { phase: "play", round: 1, turnI: 0, turnPid: S.order[0], step: "roll", die: [1], rollN: 0, boost: null, cardUsed: false, sixes: 0, move: null, shift: null, shiftN: 0, winner: null, paused: false, log: [], fx: [], fxN: S.fxN || 0, startedAt: L.now(), lastAt: L.now() });
    const t = L.t(S);
    log(S, `${t.icon} ${t.title}! ${S.players[S.turnPid].name} goes first.`);
    fx(S, { k: "intro" }); fx(S, { k: "turn", pid: S.turnPid }, 400);
    return true;
  };

  // ---------- moving ----------
  // A move is a list of segments shown one after another on the TV:
  //  walk  {pid, path:[squares]}   step by step
  //  slide {pid, from, to, i}      down snake i
  //  climb {pid, from, to, i}      up ladder i
  //  fly   {pid, from, to}         jump straight there (swap)
  const DUR = { step: 260, slide: 1500, climb: 1200, fly: 900, pause: 350 };
  const segDur = g => (g.k === "walk" ? Math.max(1, g.path.length) * DUR.step : DUR[g.k] || 600) * L.pace + DUR.pause * L.pace;
  L.segDur = segDur;
  function walkPath(from, to) { const out = []; if (to >= from) for (let q = Math.max(1, from + 1); q <= to; q++) out.push(q); else for (let q = from - 1; q >= Math.max(1, to); q--) out.push(q); return out; }
  // land on q: snakes, ladders and stars. Adds segments, returns where the piece ends.
  function land(S, p, q, segs, notes) {
    const t = L.t(S);
    const sn = L.snakeAt(S, q);
    if (sn) {
      const ci = p.cards.indexOf("shield");
      if (ci >= 0) { p.cards.splice(ci, 1); notes.push({ k: "shield", pid: p.id, q }); return q; }
      segs.push({ k: "slide", pid: p.id, from: q, to: sn[1], i: S.board.snakes.indexOf(sn) }); notes.push({ k: "snake", pid: p.id, from: q, to: sn[1] }); return sn[1];
    }
    const ld = L.ladderAt(S, q);
    if (ld) { segs.push({ k: "climb", pid: p.id, from: q, to: ld[1], i: S.board.ladders.indexOf(ld) }); notes.push({ k: "ladder", pid: p.id, from: q, to: ld[1] }); return ld[1]; }
    if (L.starAt(S, q)) { if (p.cards.length < L.MAXCARDS) { const c = drawCard(); notes.push({ k: "star", pid: p.id, c, q }); } else notes.push({ k: "fullhand", pid: p.id, q }); }
    void t; return q;
  }
  // start a move: segs run on the TV, then finishMove applies the results
  function startMove(S, segs, notes, after, final) {
    const now = L.now(); let t = 0;
    segs.forEach(g => { g.t0 = t; g.dur = segDur(g); t += g.dur; });
    // narration/sounds fire when each part happens on screen
    let walked = 0; const walkEnd = segs.filter(g => g.k === "walk").reduce((a, g) => a + g.dur, 0);
    notes.forEach(n => { const g = segs.find(g => (g.k === "slide" || g.k === "climb") && g.pid === n.pid && g.from === n.from); fx(S, Object.assign({}, n), g ? g.t0 : n.k === "star" || n.k === "shield" || n.k === "fullhand" ? walkEnd : 0); });
    void walked;
    S.move = { segs, t0: now, dur: t, start: Object.fromEntries(S.order.map(id => [id, S.players[id].pos])), final, notes, after };
    S.step = "move";
  }
  L.movingNow = S => S.move && L.now() < S.move.t0 + S.move.dur;
  function finishMove(S) {
    const m = S.move; if (!m) return;
    Object.entries(m.final).forEach(([id, q]) => { if (S.players[id]) S.players[id].pos = q; });
    m.notes.filter(n => n.k === "star").forEach(n => { const p = S.players[n.pid]; if (p && p.cards.length < L.MAXCARDS) p.cards.push(n.c); });
    S.move = null; S.lastAt = L.now();
    const won = S.order.find(id => S.players[id].pos >= L.N);
    if (won) return win(S, won);
    if (m.after === "again") { S.step = "roll"; S.boost = null; S.cardUsed = false; fx(S, { k: "six", pid: S.turnPid }); return; }
    if (m.after === "roll") { S.step = "roll"; return; }
    nextTurn(S);
  }
  function win(S, id) {
    S.phase = "end"; S.winner = id; S.step = "done"; S.move = null;
    S.result = { winner: id, order: S.order.slice().sort((a, b) => S.players[b].pos - S.players[a].pos) };
    log(S, `🏆 ${S.players[id].name} wins!`);
    fx(S, { k: "win", pid: id });
  }
  function nextTurn(S) {
    S.boost = null; S.cardUsed = false; S.sixes = 0;
    for (let k = 0; k < S.order.length; k++) {
      S.turnI = (S.turnI + 1) % S.order.length;
      if (S.turnI === 0) { S.round++; if (roundStart(S)) return; }
      const p = S.players[S.order[S.turnI]];
      if (p.frozen) { p.frozen = 0; log(S, `🧊 ${p.name} is frozen and misses a go.`); fx(S, { k: "frozen", pid: p.id }); continue; }
      break;
    }
    S.turnPid = S.order[S.turnI]; S.step = "roll"; S.lastAt = L.now();
    fx(S, { k: "turn", pid: S.turnPid });
  }
  // moving board: warn one round before, then shift
  function roundStart(S) {
    if (!L.moving(S)) return false;
    const r = S.round, E = L.SHIFT_EVERY;
    if (r > 1 && (r - 1) % E === E - 1) { log(S, "🌀 " + L.t(S).warn); fx(S, { k: "warn" }); }
    if (r > 1 && (r - 1) % E === 0) { doShift(S); return true; }
    return false;
  }
  function doShift(S) {
    const B = S.board, occupied = new Set(S.order.map(id => S.players[id].pos)), moved = [];
    const nS = 2, nL = 2;
    shuffle(B.snakes.map((_, i) => i)).slice(0, nS).forEach(i => { const old = B.snakes[i], used = L.usedSquares(B); old.forEach(q => used.delete(q)); const e = makeSnake(used, occupied, B.snakes.filter((_, j) => j !== i)); if (e) { B.snakes[i] = e; moved.push({ k: "s", i, old, now: e }); } });
    shuffle(B.ladders.map((_, i) => i)).slice(0, nL).forEach(i => { const old = B.ladders[i], used = L.usedSquares(B); old.forEach(q => used.delete(q)); const e = makeLadder(used, occupied, B.ladders.filter((_, j) => j !== i)); if (e) { B.ladders[i] = e; moved.push({ k: "l", i, old, now: e }); } });
    if (trapped(B.snakes)) { moved.filter(m => m.k === "s").forEach(m => { B.snakes[m.i] = m.old; }); }
    S.shiftN++; S.shift = { at: L.now(), dur: 3200 * L.pace, moved };
    S.step = "shift"; S.lastAt = L.now();
    log(S, "🌀 " + L.t(S).shifted);
    fx(S, { k: "shift" });
    return true;
  }
  function endShift(S) {
    S.shift = null;
    // carry on with the first player of the new round (skipping frozen players)
    S.turnI = S.order.length - 1; // the loop below moves on to the first player without starting another round
    for (let k = 0; k < S.order.length; k++) {
      S.turnI = (S.turnI + 1) % S.order.length;
      const p = S.players[S.order[S.turnI]];
      if (p.frozen) { p.frozen = 0; log(S, `🧊 ${p.name} is frozen and misses a go.`); fx(S, { k: "frozen", pid: p.id }); continue; }
      break;
    }
    S.turnPid = S.order[S.turnI]; S.step = "roll"; S.boost = null; S.cardUsed = false; S.sixes = 0; S.lastAt = L.now();
    fx(S, { k: "turn", pid: S.turnPid });
  }

  // ---------- actions ----------
  function roll(S, p, pickN) {
    const t = L.t(S);
    let dice;
    if (S.boost === "pick") { const n = +pickN; if (!(n >= 1 && n <= 6)) return false; dice = [n]; }
    else if (S.boost === "double") dice = [1 + R(6), 1 + R(6)];
    else dice = [1 + R(6)];
    const total = dice.reduce((a, b) => a + b, 0);
    S.die = dice; S.rollN++; S.lastAt = L.now();
    fx(S, { k: "roll", pid: p.id, d: dice, pick: S.boost === "pick" });
    const from = p.pos;
    let to = from + total, segs = [], notes = [];
    if (to > L.N) {
      if (S.settings.finish === "bounce") { const back = L.N - (to - L.N); segs.push({ k: "walk", pid: p.id, path: walkPath(from, L.N).concat(walkPath(L.N, back)) }); notes.push({ k: "bounce", pid: p.id }); to = back; }
      else { to = L.N; segs.push({ k: "walk", pid: p.id, path: walkPath(from, L.N) }); }
    } else segs.push({ k: "walk", pid: p.id, path: walkPath(from, to) });
    const end = to >= L.N ? L.N : land(S, p, to, segs, notes);
    log(S, `🎲 ${p.name} rolled ${dice.join(" + ")}${dice.length > 1 ? ` = ${total}` : ""}${S.boost === "pick" ? " (picked)" : ""} → ${end === to ? to : `${to} → ${end}`}`);
    const again = S.settings.six === "again" && dice.length === 1 && dice[0] === 6 && S.boost !== "pick" && S.sixes < 2 && end < L.N;
    if (again) S.sixes++;
    startMove(S, segs, notes, again ? "again" : "next", { [p.id]: end });
    void t; return true;
  }
  function playCard(S, p, idx, target) {
    if (S.step !== "roll" || S.cardUsed || S.boost) return false;
    const c = p.cards[idx]; if (!c || c === "shield") return false;
    const t = L.t(S), q = target && S.players[target];
    if (L.TARGETED.includes(c) && (!q || q.id === p.id)) return false;
    p.cards.splice(idx, 1); S.cardUsed = true; S.lastAt = L.now();
    const C = L.CARDS[c];
    fx(S, { k: "card", pid: p.id, c, target: target || null });
    if (c === "double" || c === "pick") { S.boost = c; log(S, `${C.icon} ${p.name} played ${C.name}!`); return true; }
    if (c === "freeze") { q.frozen = 1; log(S, `🧊 ${p.name} froze ${q.name}! They miss their next go.`); return true; }
    if (c === "push") {
      const to = Math.max(0, q.pos - 5), segs = [{ k: "walk", pid: q.id, path: walkPath(q.pos, Math.max(1, to)) }], notes = [];
      const end = to <= 0 ? 0 : land(S, q, to, segs, notes);
      log(S, `💨 ${p.name} pushed ${q.name} back to ${end}.`);
      startMove(S, segs, notes, "roll", { [q.id]: end }); return true;
    }
    if (c === "swap") {
      const a = p.pos, b = q.pos;
      log(S, `🔄 ${p.name} swapped places with ${q.name}! (${a} ⇄ ${b})`);
      startMove(S, [{ k: "fly", pid: p.id, from: a, to: b }, { k: "fly", pid: q.id, from: b, to: a, together: true }], [], "roll", { [p.id]: b, [q.id]: a });
      // fly together: second segment starts at the same time as the first
      const g = S.move.segs; g[1].t0 = g[0].t0; S.move.dur = g[0].dur;
      return true;
    }
    void t; return false;
  }

  L.act = (S, pid, m) => {
    const t = m.t;
    if (t === "set" && (pid === S.host || m.tv)) return L.setSetting(S, m.k, m.v);
    if (t === "start" && (pid === S.host || m.tv) && S.phase === "lobby") return L.start(S);
    if (t === "again" && (pid === S.host || m.tv) && S.phase === "end") { S.phase = "lobby"; S.board = genBoard(S); return L.start(S); }
    if (t === "lobby" && (pid === S.host || m.tv) && S.phase === "end") { S.phase = "lobby"; S.order = S.order.filter(id => !S.players[id].bot); Object.keys(S.players).forEach(id => { if (S.players[id].bot) delete S.players[id]; }); S.board = genBoard(S); S.log = []; return true; }
    if (t === "pause" && (pid === S.host || m.tv) && S.phase === "play") {
      S.paused = !S.paused; const n = L.now();
      // freeze any animation where it is, and carry on from there
      if (S.paused) { S.pausedAt = n; } else { const d = n - (S.pausedAt || n); if (S.move) S.move.t0 += d; if (S.shift) S.shift.at += d; S.lastAt += d; (S.fx || []).forEach(f => { if (f.at > S.pausedAt) f.at += d; }); }
      return true;
    }
    if (t === "nudge" && (pid === S.host || m.tv)) return L.nudge(S);
    if (t === "endnow" && (pid === S.host || m.tv) && S.phase === "play") { const best = S.order.slice().sort((a, b) => S.players[b].pos - S.players[a].pos)[0]; win(S, best); S.result.early = true; return true; }
    const p = S.players[pid];
    if (!p || S.paused || S.phase !== "play" || S.turnPid !== pid) return false;
    if (t === "roll" && S.step === "roll") return roll(S, p, m.n);
    if (t === "card" && S.step === "roll" && L.powers(S)) return playCard(S, p, +m.i, m.target);
    if (t === "cancelboost") return false;
    return false;
  };
  // host: hurry a stuck turn along
  L.nudge = S => {
    if (S.phase !== "play") return false;
    if (S.step === "roll") { const p = S.players[S.turnPid]; if (S.boost === "pick") return roll(S, p, botPick(S, p)); return roll(S, p); }
    if (S.step === "move" && S.move) { S.move.t0 = 0; return L.tick(S); }
    return false;
  };

  // timers: called by the TV every 250ms. Returns true when the state changed.
  L.tick = S => {
    if (S.phase !== "play" || S.paused) return false;
    if (S.step === "move" && S.move && L.now() >= S.move.t0 + S.move.dur) { finishMove(S); return true; }
    if (S.step === "shift" && S.shift && L.now() >= S.shift.at + S.shift.dur) { endShift(S); return true; }
    return false;
  };

  // ---------- computer players ----------
  function botPick(S, p) {
    let best = 1, bestEnd = -1;
    for (let n = 1; n <= 6; n++) { const v = L.preview(S, p, n); const score = v.end + (v.star && p.cards.length < L.MAXCARDS ? 2 : 0); if (score > bestEnd) { bestEnd = score; best = n; } }
    return best;
  }
  function botCard(S, p) {
    const others = S.order.filter(id => id !== p.id).map(id => S.players[id]);
    const leader = others.slice().sort((a, b) => b.pos - a.pos)[0];
    for (let i = 0; i < p.cards.length; i++) {
      const c = p.cards[i];
      if (c === "pick") { const n = botPick(S, p), v = L.preview(S, p, n); if (v.ladder || [1, 2, 3, 4, 5, 6].some(k => L.preview(S, p, k).snake) || p.pos >= 94) return { i }; }
      if (c === "double" && leader && leader.pos - p.pos >= 12) return { i };
      if (c === "swap" && leader && leader.pos - p.pos >= 15) return { i, target: leader.id };
      if (c === "push" && leader && (leader.pos >= 55 || L.snakeAt(S, Math.max(1, leader.pos - 5))) && leader.pos >= p.pos - 5) return { i, target: leader.id };
      if (c === "freeze" && leader && leader.pos >= 70 && leader.pos >= p.pos) return { i, target: leader.id };
    }
    return null;
  }
  L.botStep = S => {
    if (S.phase !== "play" || S.paused || S.step !== "roll") return false;
    const p = S.players[S.turnPid]; if (!p || !p.bot) return false;
    if (L.now() - S.lastAt < 1300 * L.pace) return false;
    if (S.boost === "pick") return roll(S, p, botPick(S, p));
    if (L.powers(S) && !S.cardUsed && !S.boost) { const c = botCard(S, p); if (c && playCard(S, p, c.i, c.target)) return true; }
    return roll(S, p);
  };
  L.botPick = botPick;

  // ---------- what phones get ----------
  L.pub = S => { const o = JSON.parse(JSON.stringify(S)); Object.values(o.players).forEach(p => { p.nCards = (p.cards || []).length; p.shield = (p.cards || []).includes("shield"); delete p.cards; }); if (o.move) o.move.notes = o.move.notes.map(n => n.k === "star" ? { k: "star", pid: n.pid, q: n.q } : n); (o.fx || []).forEach(f => { if (f.k === "star") delete f.c; }); return o; };
  L.priv = (S, id) => { const p = S.players[id]; return p ? { cards: p.cards.slice() } : null; };

  root.Lad = L;
})(typeof window !== "undefined" ? window : globalThis);
