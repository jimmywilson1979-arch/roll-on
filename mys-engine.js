// =====================================================================
// Roll On · Mystery — rules engine (Classic Whodunnit mode).
// The game secretly picks WHO, WHERE and WITH WHAT. Players jump between
// rooms, search hiding spots, make guesses (others privately show a card),
// and accuse. Built so Detective Agency and Sneaky Suspect modes, more
// stories, and family-as-suspects can plug in later.
// Pure logic: the TV runs it; phones only ever see their own secrets.
// =====================================================================
(function (root) {
  const M = {};
  M.now = () => Date.now();
  M.rng = Math.random;
  const R = n => M.rng() * n | 0;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---------- stories ----------
  M.STORIES = {
    cake: {
      key: "cake", label: "🎂 Who ate the cake?", title: "Who Ate the Cake?", crime: "ate the birthday cake",
      intro: "Someone has eaten the birthday cake! Find out WHO did it, WHERE, and WITH WHAT.",
      reveal: (s, r, i) => `It was ${s} in the ${r}, with the ${i}!`,
      who: [
        ["👵", "Grandma Rose", "Grandma Rose was asleep in her chair all afternoon. Snoring loudly!"],
        ["👨", "Uncle Bob", "Uncle Bob was out washing the car. His hands were covered in soap, not cake."],
        ["👩", "Aunt Sue", "Aunt Sue was on the phone the whole time. Chat, chat, chat!"],
        ["🧒", "Cousin Max", "Cousin Max was building a den with his toys. Not a crumb on him!"],
        ["🐶", "Rex the Dog", "Rex was fast asleep in his basket. His nose is clean as a whistle."],
        ["🐱", "Mr Whiskers", "Mr Whiskers was chasing butterflies outside. No icing on those whiskers!"],
      ],
      where: [
        ["🍳", "Kitchen", "The kitchen floor is spotless. The cake wasn't eaten in here.", [["🧊", "Fridge"], ["🔥", "Oven"], ["🗑️", "Bin"]]],
        ["🛋️", "Lounge", "Not a single crumb on the lounge sofa. It wasn't here!", [["🛋️", "Sofa"], ["📚", "Bookshelf"], ["🪴", "Plant pot"]]],
        ["🌳", "Garden", "The garden ants haven't found any cake. Not out here!", [["🛖", "Shed"], ["🌷", "Flower bed"], ["🏠", "Kennel"]]],
        ["🛏️", "Bedroom", "The bed is neat and tidy. No cake was eaten in the bedroom.", [["🛏️", "Bed"], ["👕", "Wardrobe"], ["🧸", "Toy box"]]],
        ["🚪", "Hallway", "The hallway carpet is crumb-free. Not here!", [["🧥", "Coat rack"], ["👟", "Shoe pile"], ["🟫", "Doormat"]]],
        ["📚", "Study", "The study smells of old books, not chocolate. Not here!", [["🖥️", "Desk"], ["🗄️", "Filing cabinet"], ["🌍", "Globe"]]],
      ],
      what: [
        ["🥄", "Big Spoon", "The big spoon is still shiny in the drawer. It wasn't used!"],
        ["🖐️", "Bare Hands", "There are no sticky fingerprints anywhere. Not with bare hands!"],
        ["🍴", "Fork", "All the forks are clean and counted. Not the fork!"],
        ["🍨", "Ice-cream Scoop", "The ice-cream scoop is still in its box. Not used!"],
        ["🥢", "Chopsticks", "The chopsticks haven't left the cupboard. Not those!"],
        ["🚜", "Toy Digger", "The toy digger's bucket is full of sand, not cake!"],
      ],
      // what the narrator says a suspect does when they're named in a question
      react: [
        ["Grandma Rose pretends to be fast asleep…", "Grandma Rose peers over her glasses. Hmm."],
        ["Uncle Bob looks nervous…", "Uncle Bob whistles and looks at the ceiling."],
        ["Aunt Sue nearly drops her phone!", "Aunt Sue gasps. Me? Never!"],
        ["Cousin Max hides behind a cushion.", "Cousin Max can't stop giggling…"],
        ["Rex wags his tail very, very fast.", "Rex licks his lips…"],
        ["Mr Whiskers licks his paw… suspiciously.", "Mr Whiskers just stares. And stares."],
      ],
      lockedRoom: 5, key: ["🔑", "the Study key"],
      empty: ["Just dust and fluff.", "Nothing here but an old sock.", "A spider waves at you. Nothing else!", "Empty. Not even a crumb.", "Just a lost button."],
    },
  };
  M.SIZES = { small: [4, "🧒 Small (4 of each, quicker)"], full: [6, "🕵️ Full (6 of each)"] };
  M.SETTINGS = () => [
    ["story", "Story", Object.values(M.STORIES).map(s => [s.key, s.label])],
    ["size", "Mystery size", Object.entries(M.SIZES).map(([k, v]) => [k, v[1]])],
    ["bots", "🤖 Computer detectives", [["auto", "Auto"], [0, "None"], [1, "1"], [2, "2"], [3, "3"]]],
  ];
  M.st = S => M.STORIES[S.settings.story] || M.STORIES.cake;
  const COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#a66bff", "#ff8a3d", "#1fd1c1", "#ff6fb5"];
  // card ids: s0.. suspects, r0.. rooms, i0.. items
  M.card = (S, id) => { const st = M.st(S), k = id[0], n = +id.slice(1), row = (k === "s" ? st.who : k === "r" ? st.where : st.what)[n]; return { id, kind: k, icon: row[0], name: row[1], clue: row[2] }; };
  M.cards = S => { const n = S.n || 6; const out = []; ["s", "r", "i"].forEach(k => { for (let j = 0; j < n; j++) out.push(k + j); }); return out; };
  M.rooms = S => Array.from({ length: S.n || 6 }, (_, j) => j);

  function log(S, s) { S.log.push(s); if (S.log.length > 40) S.log.shift(); }
  function fx(S, o) { S.fxN = (S.fxN || 0) + 1; o.n = S.fxN; S.fx.push(o); if (S.fx.length > 14) S.fx.shift(); }

  // ---------- lobby ----------
  M.newState = room => ({ v: 1, room, phase: "lobby", settings: { story: "cake", size: "full", bots: "auto" }, players: {}, order: [], host: null, log: [], fx: [], fxN: 0 });
  M.setSetting = (S, k, v) => {
    if (!(S.phase === "lobby" || S.phase === "end")) return false;
    if (k === "story" && M.STORIES[v]) S.settings.story = v;
    else if (k === "size" && M.SIZES[v]) S.settings.size = v;
    else if (k === "bots" && ["auto", 0, 1, 2, 3].includes(v)) S.settings.bots = v;
    else return false;
    return true;
  };
  M.join = (S, id, name, kid) => {
    name = String(name || "Player").trim().slice(0, 14) || "Player";
    const p = S.players[id];
    if (p) { p.name = name; p.kid = !!kid; return "ok"; }
    if (S.phase === "lobby") {
      if (S.order.length >= 6) return "full";
      const used = new Set(S.order.map(x => S.players[x].ci)), ci = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !used.has(i));
      S.players[id] = { id, name, kid: !!kid, ci, color: COLORS[ci], room: -1, hand: [], known: {}, skip: 0 };
      S.order.push(id); if (!S.host) S.host = id;
      return "ok";
    }
    const old = S.order.find(x => !S.players[x].bot && S.players[x].name.toLowerCase() === name.toLowerCase());
    if (old && old !== id) { M.rebind(S, old, id); return "ok"; }
    return "watch";
  };
  M.rebind = (S, a, b) => { const n = JSON.parse(JSON.stringify(S).split('"' + a + '"').join('"' + b + '"')); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, n); };
  M.leaveLobby = (S, id) => { if (S.phase !== "lobby" || !S.players[id]) return; delete S.players[id]; S.order = S.order.filter(x => x !== id); if (S.host === id) S.host = S.order[0] || null; };
  M.humans = S => S.order.filter(id => !S.players[id].bot);
  M.botCount = S => { const h = M.humans(S).length, b = S.settings.bots; return Math.max(0, Math.min(6 - h, b === "auto" || b == null ? (h === 1 ? 2 : 0) : +b)); };
  const BOT_NAMES = ["Detective Bolt", "Inspector Cog", "Sherlock Bot", "Agent Sparky"];
  function addBots(S) {
    S.order.filter(id => S.players[id].bot).forEach(id => delete S.players[id]); S.order = S.order.filter(id => S.players[id]);
    const n = M.botCount(S), names = shuffle(BOT_NAMES);
    for (let k = 0; k < n; k++) { const used = new Set(S.order.map(x => S.players[x].ci)), ci = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !used.has(i)); S.players["bot" + k] = { id: "bot" + k, name: names[k], kid: false, bot: true, ci, color: COLORS[ci], room: -1, hand: [], known: {}, skip: 0 }; S.order.push("bot" + k); }
  }

  // ---------- new mystery ----------
  M.start = S => {
    if (!M.humans(S).length) return false;
    addBots(S);
    const st = M.st(S); S.n = M.SIZES[S.settings.size][0];
    const sol = { s: "s" + R(S.n), r: "r" + R(S.n), i: "i" + R(S.n) };
    const innocent = shuffle(M.cards(S).filter(c => c !== sol.s && c !== sol.r && c !== sol.i));
    const np = S.order.length, per = np <= 2 ? 3 : np <= 4 ? 2 : 1;
    S.order.forEach((id, k) => Object.assign(S.players[id], { hand: innocent.slice(k * per, k * per + per), known: {}, room: -1, skip: 0, guessed: false, stats: { searched: 0, guesses: 0, wrong: 0 } }));
    S.order.forEach(id => S.players[id].hand.forEach(c => S.players[id].known[c] = "hand"));
    const hidden = innocent.slice(np * per);
    // hiding spots: 3 per room. The key is never inside the locked room.
    const locked = S.n === 6 ? st.lockedRoom : -1;
    const spots = []; M.rooms(S).forEach(r => [0, 1, 2].forEach(k => spots.push({ r, k })));
    const sp = shuffle(spots), contents = {};
    const keySpot = sp.find(x => x.r !== locked);
    const fill = [...hidden.map(c => ({ c })), ...(locked >= 0 ? [] : []), { c: "mag" }, { c: "mag" }];
    contents[keySpot.r + ":" + keySpot.k] = locked >= 0 ? "key" : "mag";
    let q = sp.filter(x => x !== keySpot);
    fill.forEach(f => { const s = q.shift(); if (s) contents[s.r + ":" + s.k] = f.c; });
    S.spots = {}; spots.forEach(x => S.spots[x.r + ":" + x.k] = { c: contents[x.r + ":" + x.k] || null, e: R(st.empty.length), by: [] });
    Object.assign(S, { sol, phase: "play", round: 1, turnI: 0, turnPid: S.order[0], step: "roll", die: 1, rollN: 0, searches: 0, bonus: false, locked, unlocked: locked < 0, ask: null, lastAsk: null, accuse: null, tips: [], log: [], fx: [], result: null, paused: false, scene: -1, found: null, startedAt: M.now() });
    log(S, st.intro); fx(S, { k: "turn", pid: S.turnPid });
    return true;
  };

  // ---------- turns ----------
  const cur = S => S.players[S.turnPid];
  function nextTurn(S) {
    S.ask = null; S.scene = -1; S.searches = 0; S.bonus = false; S.found = null;
    for (let g = 0; g < S.order.length + 1; g++) {
      S.turnI = (S.turnI + 1) % S.order.length;
      if (S.turnI === 0) { S.round++; roundTip(S); }
      const p = S.players[S.order[S.turnI]];
      if (p.skip > 0) { p.skip--; log(S, `${p.name} is still on the naughty step (${p.skip ? p.skip + " more turn" : "back next turn"}).`); continue; }
      break;
    }
    S.turnPid = S.order[S.turnI]; S.step = "roll"; cur(S).guessed = false;
    fx(S, { k: "turn", pid: S.turnPid });
  }
  // keeps the game moving: from round 7, every 3 rounds the detective's notebook reveals an innocent card to everyone
  function roundTip(S) {
    if (S.round < 7 || (S.round - 7) % 3) return;
    const pool = M.cards(S).filter(c => c !== S.sol.s && c !== S.sol.r && c !== S.sol.i && !S.tips.includes(c));
    if (!pool.length) return;
    const c = pool[R(pool.length)]; S.tips.push(c);
    S.order.forEach(id => { if (!S.players[id].known[c]) S.players[id].known[c] = "tip"; });
    log(S, `🔎 Detective's tip: ${M.card(S, c).clue}`); fx(S, { k: "tip", c });
  }
  M.roomOpen = (S, r) => r !== S.locked || S.unlocked;
  function roll(S) { const d = R(6) + 1; S.die = d; S.rollN++; S.searches = d <= 2 ? 1 : 2; S.bonus = d >= 5; S.step = "room"; log(S, `${cur(S).name} rolled ${d}: ${S.searches} search${S.searches > 1 ? "es" : ""}${S.bonus ? " + a witness 👀" : ""}.`); fx(S, { k: "dice", d }); }
  function goRoom(S, r) {
    if (!M.rooms(S).includes(r) || !M.roomOpen(S, r)) return false;
    const p = cur(S); p.room = r; S.scene = r; S.step = "search";
    log(S, `${p.name} goes to the ${M.st(S).where[r][1]}.`); fx(S, { k: "room", pid: p.id, r });
    return true;
  }
  function search(S, k) {
    const p = cur(S), key = p.room + ":" + k, sp = S.spots[key], st = M.st(S);
    if (!sp || S.searches <= 0 || sp.by.includes(p.id)) return false;
    S.searches--; sp.by.push(p.id); p.stats.searched++;
    const spotName = st.where[p.room][3][k][1];
    let found;
    if (sp.c === "key") { found = { t: "key" }; if (!S.unlocked) { S.unlocked = true; log(S, `🔑 ${p.name} found ${st.key[1]} in the ${spotName}! The ${st.where[S.locked][1]} is open.`); fx(S, { k: "unlock" }); } else found = { t: "empty", txt: "The key was here, but someone already used it." }; }
    else if (sp.c === "mag") { found = { t: "mag" }; S.searches++; log(S, `🔍 ${p.name} found a magnifying glass in the ${spotName}: one more search!`); }
    else if (sp.c) { found = { t: "clue", c: sp.c }; if (!p.known[sp.c]) p.known[sp.c] = "found"; log(S, `${p.name} searched the ${spotName} and found a clue!`); fx(S, { k: "clue", pid: p.id }); }
    else { found = { t: "empty", txt: st.empty[sp.e] }; log(S, `${p.name} searched the ${spotName}. Nothing there.`); }
    S.found = Object.assign({ pid: p.id, spot: spotName, r: p.room, k, at: M.now() }, found);
    fx(S, { k: "search", pid: p.id, r: p.room, spot: spotName, res: found.t, more: S.searches });
    return true;
  }
  function witness(S) {
    const p = cur(S); if (!S.bonus) return false; S.bonus = false;
    const pool = M.cards(S).filter(c => c !== S.sol.s && c !== S.sol.r && c !== S.sol.i && !p.known[c]);
    if (!pool.length) { S.found = { pid: p.id, t: "empty", txt: "The witness had nothing new to say.", at: M.now() }; return true; }
    const c = pool[R(pool.length)]; p.known[c] = "witness";
    S.found = { pid: p.id, t: "clue", c, witness: true, at: M.now() };
    log(S, `${p.name} talked to a witness and learned something.`); fx(S, { k: "clue", pid: p.id, w: 1 });
    return true;
  }
  // guess: who + with what, in the room you're in. Going round the table, the first player
  // holding one of those cards must show one privately.
  function guess(S, s, i) {
    const p = cur(S); if (p.guessed || p.room < 0) return false;
    const r = "r" + p.room; if (!/^s\d$/.test(s) || !/^i\d$/.test(i) || +s.slice(1) >= S.n || +i.slice(1) >= S.n) return false;
    p.guessed = true; p.stats.guesses++;
    const order = []; for (let k = 1; k < S.order.length; k++) order.push(S.order[(S.turnI + k) % S.order.length]);
    S.ask = { from: p.id, s, r, i, order, at: 0, results: [], shown: null, waiting: null };
    S.step = "asking";
    const st = M.st(S); log(S, `🤔 ${p.name} asks: was it ${M.card(S, s).name}, in the ${st.where[p.room][1]}, with the ${M.card(S, i).name}?`);
    fx(S, { k: "guess", pid: p.id, s, r, i });
    advanceAsk(S);
    return true;
  }
  function advanceAsk(S) {
    const a = S.ask;
    while (a.at < a.order.length) {
      const id = a.order[a.at], q = S.players[id], has = q.hand.filter(c => c === a.s || c === a.r || c === a.i);
      if (has.length) { a.waiting = id; a.options = has; if (q.bot || has.length === 1) return show(S, id, has[R(has.length)]); S.step = "showing"; return; }
      a.results.push({ id, had: false }); a.at++;
    }
    a.waiting = null; a.doneAt = M.now(); S.step = "search";
    log(S, `😮 Nobody could show a card!`); fx(S, { k: "nobody" });
  }
  function show(S, id, c) {
    const a = S.ask; if (!a || a.waiting !== id || !a.options.includes(c)) return false;
    const asker = S.players[a.from];
    a.results.push({ id, had: true }); a.shown = { by: id, c }; a.waiting = null; a.options = null; a.doneAt = M.now();
    if (!asker.known[c]) asker.known[c] = "shown:" + id;
    S.found = { pid: a.from, t: "clue", c, by: id, at: M.now() };
    log(S, `🃏 ${S.players[id].name} secretly showed ${asker.name} a card.`); fx(S, { k: "shown", by: id, to: a.from });
    S.step = "search";
    return true;
  }
  function accuse(S, s, r, i) {
    const p = cur(S), st = M.st(S);
    S.accuse = { pid: p.id, s, r, i, at: M.now() };
    const right = s === S.sol.s && r === S.sol.r && i === S.sol.i;
    log(S, `☝️ ${p.name} accuses: ${M.card(S, s).name}, in the ${M.card(S, r).name}, with the ${M.card(S, i).name}!`);
    fx(S, { k: "accuse", pid: p.id, s, r, i });
    if (right) { S.phase = "end"; S.step = null; S.result = { winner: p.id, sol: S.sol }; log(S, `🎉 ${p.name} solved it! ${st.reveal(M.card(S, s).name, M.card(S, r).name, M.card(S, i).name)}`); fx(S, { k: "solved", pid: p.id }); return true; }
    p.skip = 2; p.stats.wrong++; S.accuse.wrong = true;
    // a wrong accusation tells you which part was wrong (one of them), so it isn't wasted
    const wrongParts = [s !== S.sol.s ? s : null, r !== S.sol.r ? r : null, i !== S.sol.i ? i : null].filter(Boolean);
    const c = wrongParts[R(wrongParts.length)]; if (!p.known[c]) p.known[c] = "accuse";
    S.found = { pid: p.id, t: "clue", c, accuse: true, at: M.now() };
    log(S, `❌ Wrong! ${p.name} goes on the naughty step for 2 turns.`); fx(S, { k: "wrong", pid: p.id });
    // if every detective is on the naughty step at once, let them off
    if (S.order.every(id => S.players[id].skip > 0)) S.order.forEach(id => S.players[id].skip = 0);
    nextTurn(S);
    return true;
  }

  // ---------- actions ----------
  M.act = (S, pid, m) => {
    const t = m.t, p = S.players[pid];
    if (S.phase === "lobby" || S.phase === "end") {
      if (pid !== S.host && !m.tv) return false;
      if (t === "set") return M.setSetting(S, m.k, m.v);
      if (t === "start" && S.phase === "lobby") return M.start(S);
      if (t === "again" && S.phase === "end") return M.start(S);
      if (t === "lobby" && S.phase === "end") { S.phase = "lobby"; S.order.filter(id => S.players[id].bot).forEach(id => delete S.players[id]); S.order = S.order.filter(id => S.players[id]); return true; }
      return false;
    }
    if (S.phase !== "play") return false;
    if (t === "pause" && (pid === S.host || m.tv)) { S.paused = !S.paused; return true; }
    if (t === "nudge" && (pid === S.host || m.tv)) return M.nudge(S);
    if (t === "endnow" && (pid === S.host || m.tv)) { S.phase = "end"; S.result = { winner: null, sol: S.sol, gaveUp: true }; log(S, `The detectives gave up. ${M.st(S).reveal(M.card(S, S.sol.s).name, M.card(S, S.sol.r).name, M.card(S, S.sol.i).name)}`); fx(S, { k: "solved" }); return true; }
    if (!p || S.paused) return false;
    if (t === "show") return show(S, pid, m.c);
    if (pid !== S.turnPid) return false;
    switch (t) {
      case "roll": if (S.step === "roll") { roll(S); return true; } return false;
      case "room": if (S.step === "room") return goRoom(S, +m.r); return false;
      case "search": if (S.step === "search") return search(S, +m.k); return false;
      case "witness": if (S.step === "search") return witness(S); return false;
      case "guess": if (S.step === "search") return guess(S, m.s, m.i); return false;
      case "accuse": if (S.step === "search" || S.step === "room" || S.step === "roll") return accuse(S, m.s, m.r, m.i); return false;
      case "endturn": if (S.step === "search" || S.step === "room") { nextTurn(S); return true; } return false;
    }
    return false;
  };
  M.nudge = S => {
    if (S.step === "showing" && S.ask && S.ask.waiting) return show(S, S.ask.waiting, S.ask.options[0]);
    if (S.step === "roll") { roll(S); return true; }
    nextTurn(S); return true;
  };
  M.tick = S => false;

  // ---------- computer detectives ----------
  // how close a detective is: cards ruled out ÷ cards that need ruling out
  M.progress = (S, p) => { const need = 3 * (S.n || 6) - 3, got = Object.keys(p.known || {}).length; return Math.min(1, got / need); };
  M.unknown = (S, p, k) => M.cards(S).filter(c => c[0] === k && !p.known[c]);
  M.botStep = S => {
    if (S.phase !== "play" || S.paused) return false;
    const n = M.now(); if (S.botWait && n < S.botWait) return false;
    const wait = ms => { S.botWait = n + ms * (M.pace || 1); return true; };
    if (S.step === "showing" && S.ask && S.ask.waiting && S.players[S.ask.waiting].bot) { show(S, S.ask.waiting, S.ask.options[0]); return wait(1200); }
    const p = cur(S); if (!p || !p.bot) return false;
    const us = M.unknown(S, p, "s"), ur = M.unknown(S, p, "r"), ui = M.unknown(S, p, "i");
    if (S.step !== "showing" && us.length === 1 && ur.length === 1 && ui.length === 1) { accuse(S, us[0], ur[0], ui[0]); return wait(2500); }
    switch (S.step) {
      case "roll": roll(S); return wait(1400);
      case "room": {
        const open = M.rooms(S).filter(r => M.roomOpen(S, r));
        const unsearched = r => [0, 1, 2].filter(k => !S.spots[r + ":" + k].by.includes(p.id)).length;
        const score = r => (ur.includes("r" + r) ? 3 : 0) + unsearched(r) + M.rng();
        const best = open.sort((a, b) => score(b) - score(a))[0];
        goRoom(S, best); return wait(1600);
      }
      case "search": {
        const k = [0, 1, 2].find(k => !S.spots[p.room + ":" + k].by.includes(p.id));
        if (S.searches > 0 && k != null) { search(S, k); return wait(1500); }
        if (S.bonus) { witness(S); return wait(1300); }
        if (!p.guessed) {
          const s = us.length ? us[R(us.length)] : "s" + R(S.n), i = ui.length ? ui[R(ui.length)] : "i" + R(S.n);
          guess(S, s, i); return wait(2200);
        }
        nextTurn(S); return wait(1200);
      }
    }
    return false;
  };

  // ---------- what each screen may see ----------
  M.pub = S => {
    const o = JSON.parse(JSON.stringify(S));
    delete o.sol; delete o.botWait;
    Object.values(o.players).forEach(p => { p.handN = (p.hand || []).length; delete p.hand; delete p.known; });
    if (o.spots) Object.values(o.spots).forEach(s => { delete s.c; delete s.e; });
    if (o.found) o.found = { pid: o.found.pid, t: o.found.t === "clue" ? "clue" : o.found.t, spot: o.found.spot, at: o.found.at, witness: o.found.witness, by: o.found.by };
    if (o.ask) { if (o.ask.shown) o.ask.shown = { by: o.ask.shown.by }; delete o.ask.options; }
    if (o.phase === "end") o.sol = S.sol;
    o.log = o.log.slice(-10);
    return o;
  };
  M.priv = (S, id) => {
    const p = S.players[id]; if (!p) return null;
    const f = S.found && S.found.pid === id ? S.found : null;
    return { hand: p.hand, known: p.known, found: f, mustShow: S.ask && S.ask.waiting === id ? { options: S.ask.options, from: S.ask.from, s: S.ask.s, r: S.ask.r, i: S.ask.i } : null };
  };
  root.Mys = M;
})(typeof window !== "undefined" ? window : globalThis);
