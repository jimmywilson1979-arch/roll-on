// =====================================================================
// Roll On · Fortunes — rules engine.
// Pure game logic: no screen code, so it can be tested on its own.
// The TV owns the one true copy of the state and runs everything here;
// phones only send actions ("roll", "buy", "bid"...) and show the state.
// =====================================================================
(function (root) {
  const E = {};
  E.now = () => Date.now();
  E.rng = Math.random;
  const R = n => E.rng() * n | 0;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const TH = () => root.THEMES;

  // ---------- the board ----------
  const L = (t, g) => g == null ? { t } : { t, g };
  const BOARD = [
    L("start"), L("prop", 0), L("quest"), L("prop", 0), L("station"), L("prop", 1), L("chance"), L("prop", 1), L("prop", 1),
    L("jail"), L("prop", 2), L("quest"), L("prop", 2), L("prop", 2), L("station"), L("prop", 3), L("prop", 3), L("prop", 3),
    L("free"), L("prop", 4), L("chance"), L("prop", 4), L("prop", 4), L("station"), L("prop", 5), L("prop", 5), L("prop", 5),
    L("gojail"), L("prop", 6), L("prop", 6), L("quest"), L("prop", 6), L("station"), L("chance"), L("prop", 7), L("prop", 7),
  ];
  const GROUPS = [
    { c: "#8a5a32", name: "Brown", price: [60, 60], house: 50 },
    { c: "#79cdf2", name: "Sky blue", price: [100, 100, 120], house: 50 },
    { c: "#e05aa8", name: "Pink", price: [140, 140, 160], house: 100 },
    { c: "#f39a2e", name: "Orange", price: [180, 180, 200], house: 100 },
    { c: "#e2453b", name: "Red", price: [220, 220, 240], house: 150 },
    { c: "#f3cf2c", name: "Yellow", price: [260, 260, 280], house: 150 },
    { c: "#2ea85a", name: "Green", price: [300, 300, 320], house: 200 },
    { c: "#2f5ccc", name: "Royal blue", price: [350, 400], house: 200 },
  ];
  GROUPS.forEach(g => g.sq = []);
  function rentTable(price, g) {
    const base = Math.max(2, Math.round(price * (0.06 + 0.06 * g / 7))), f = g / 7;
    return [base, ...[5 - f, 15 - 3 * f, 45 - 17 * f, 80 - 46 * f, 112 - 72 * f].map(x => Math.round(base * x / 5) * 5)];
  }
  let pn = 0, sn = 0;
  BOARD.forEach((b, i) => {
    b.i = i;
    if (b.t === "prop") { b.pn = pn++; const G = GROUPS[b.g]; b.k = G.sq.push(i) - 1; b.price = G.price[b.k]; b.house = G.house; b.rent = rentTable(b.price, b.g); }
    if (b.t === "station") { b.sn = sn++; b.price = 200; }
  });
  const STATION_RENT = [25, 50, 100, 200];
  const STATIONS = BOARD.filter(b => b.t === "station").map(b => b.i);
  const JAIL = 9, PASS = 200, JAIL_FINE = 50;
  const COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#a66bff", "#ff8a3d", "#1fd1c1", "#ff6fb5"];
  E.BOARD = BOARD; E.GROUPS = GROUPS; E.STATION_RENT = STATION_RENT; E.COLORS = COLORS; E.JAIL = JAIL; E.PASS = PASS; E.JAIL_FINE = JAIL_FINE;

  // ---------- settings ----------
  E.END_VALS = { time: [[60, "1 hour"], [90, "1½ hours"], [120, "2 hours"]], rounds: [[15, "15 rounds"], [20, "20 rounds"], [30, "30 rounds"]], target: [[4000, "4,000"], [6000, "6,000"], [8000, "8,000"]], classic: [] };
  E.END_DEFAULT = { time: 90, rounds: 20, target: 6000, classic: 0 };
  E.SETTINGS = () => [
    ["theme", "Theme", Object.values(TH()).map(t => [t.key, t.label])],
    ["end", "How the game ends", [["time", "⏱️ Time limit"], ["rounds", "🔁 Set rounds"], ["target", "🎯 First to a fortune"], ["classic", "👑 Last one standing"]]],
    ["endVal", null, null],
    ["quests", "Quest tasks", [[true, "🎭 On"], [false, "Off"]]],
    ["helper", "Helper mode", [["kids", "🧒 Kids"], ["all", "Everyone"], ["off", "Off"]]],
  ];
  E.defaultSettings = () => ({ theme: "kingdom", end: "time", endVal: 90, quests: true, helper: "kids" });
  E.setSetting = (S, k, v) => {
    if (!(S.phase === "lobby" || S.phase === "end")) return false;
    const st = S.settings;
    if (k === "theme" && TH()[v]) st.theme = v;
    else if (k === "end" && E.END_VALS[v]) { st.end = v; st.endVal = E.END_DEFAULT[v]; }
    else if (k === "endVal" && (E.END_VALS[st.end] || []).some(x => x[0] === v)) st.endVal = v;
    else if (k === "quests") st.quests = !!v;
    else if (k === "helper" && ["kids", "all", "off"].includes(v)) st.helper = v;
    else return false;
    return true;
  };
  E.endText = st => st.end === "classic" ? "Last one standing wins" : st.end === "time" ? `${(E.END_VALS.time.find(x => x[0] === st.endVal) || [0, st.endVal + " min"])[1]}, then the richest wins` : st.end === "rounds" ? `${st.endVal} rounds, then the richest wins` : `First to a fortune of ${st.endVal.toLocaleString("en-GB")} wins`;

  // ---------- helpers ----------
  const theme = S => TH()[S.settings.theme] || TH().kingdom;
  E.theme = theme;
  const money = (S, n) => theme(S).money(n);
  E.money = money;
  E.sqName = (S, i) => {
    const b = BOARD[i], t = theme(S);
    return b.t === "prop" ? t.props[b.pn] : b.t === "station" ? t.stations[b.sn] : b.t === "start" ? t.start : b.t === "jail" ? t.jailName : b.t === "free" ? t.free : b.t === "gojail" ? t.gojail : b.t === "chance" ? t.chance.name : t.quest.name;
  };
  E.fill = (S, txt) => {
    const t = theme(S);
    return String(txt || "").replace(/\{(\w+?)(\d*)\}/g, (_, w, n) => w === "m" ? money(S, +n) : w === "sq" ? E.sqName(S, +n) : w === "start" ? t.start : w === "jail" ? t.jail : w === "station" ? t.station : w === "house" ? t.house.n : w === "hotel" ? t.hotel.n : _);
  };
  const pl = (n, w) => n + " " + w + (n === 1 ? "" : "s");
  const nm = (S, pid) => (S.players[pid] || {}).name || "Someone";
  function log(S, s) { S.log.push(s); if (S.log.length > 40) S.log.shift(); }
  function fx(S, o) { S.fxN = (S.fxN || 0) + 1; o.n = S.fxN; S.fx.push(o); if (S.fx.length > 14) S.fx.shift(); }
  E.alive = S => S.order.filter(id => S.players[id] && !S.players[id].out);
  const cur = S => S.players[S.turnPid];

  E.groupOwner = (S, g) => { const o = GROUPS[g].sq.map(i => S.own[i] && S.own[i].o); return o.every(x => x && x === o[0]) ? o[0] : null; };
  E.groupHasHouses = (S, g) => GROUPS[g].sq.some(i => S.own[i] && S.own[i].h > 0);
  E.rentOf = (S, i) => {
    const b = BOARD[i], o = S.own[i];
    if (!o || o.m) return 0;
    if (b.t === "station") return STATION_RENT[STATIONS.filter(j => S.own[j] && S.own[j].o === o.o).length - 1];
    if (o.h > 0) return b.rent[o.h];
    return E.groupOwner(S, b.g) === o.o ? b.rent[0] * 2 : b.rent[0];
  };
  E.mortVal = i => BOARD[i].price / 2;
  E.unmortCost = i => Math.ceil(BOARD[i].price / 2 * 1.1 / 5) * 5;
  E.netWorth = (S, pid) => {
    const p = S.players[pid]; if (!p) return 0;
    let n = p.cash;
    S.own.forEach((o, i) => { if (o && o.o === pid) { n += o.m ? BOARD[i].price / 2 : BOARD[i].price; if (o.h) n += o.h * BOARD[i].house; } });
    return n;
  };
  E.mine = (S, pid) => S.own.map((o, i) => o && o.o === pid ? i : -1).filter(i => i >= 0);

  // ---------- lobby ----------
  E.newState = room => ({
    v: 1, room, phase: "lobby", settings: E.defaultSettings(), players: {}, order: [], host: null,
    own: Array(36).fill(null), log: [], fx: [], fxN: 0, trades: {}, debts: [], round: 0, playMs: 0,
  });
  E.join = (S, id, name, kid) => {
    name = String(name || "Player").trim().slice(0, 14) || "Player";
    let p = S.players[id];
    if (p) { p.name = name; p.kid = !!kid; return "ok"; }
    if (S.phase === "lobby") {
      if (S.order.length >= 8) return "full";
      const used = new Set(S.order.map(x => S.players[x].ci));
      const ci = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !used.has(i));
      S.players[id] = { id, name, kid: !!kid, ci, color: COLORS[ci], cash: 0, pos: 0 };
      S.order.push(id); if (!S.host) S.host = id;
      return "ok";
    }
    // mid-game: a new phone with the same name takes over that player (dead battery, new phone...)
    const old = S.order.find(x => S.players[x].name.toLowerCase() === name.toLowerCase());
    if (old && old !== id) { E.rebind(S, old, id); return "ok"; }
    return "watch";
  };
  E.rebind = (S, oldId, newId) => {
    const j = JSON.stringify(S).split('"' + oldId + '"').join('"' + newId + '"');
    const n = JSON.parse(j); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, n);
  };
  E.leaveLobby = (S, id) => {
    if (S.phase !== "lobby" || !S.players[id]) return;
    delete S.players[id]; S.order = S.order.filter(x => x !== id);
    if (S.host === id) S.host = S.order[0] || null;
  };

  E.start = S => {
    if (S.order.length < 2) return false;
    const r = R(S.order.length); S.order = S.order.slice(r).concat(S.order.slice(0, r));
    S.order.forEach(id => Object.assign(S.players[id], { cash: 1500, pos: 0, jail: 0, esc: [], out: false, outAt: 0, stats: { rentIn: 0, bought: 0, quests: 0, doubles: 0, jailed: 0, built: 0 } }));
    S.own = Array(36).fill(null);
    S.decks = { chance: shuffle(root.CHANCE.map((_, i) => i)), quest: shuffle(root.QUEST.map((_, i) => i).filter(i => S.settings.quests || root.QUEST[i].k !== "task")) };
    S.usedTasks = [];
    Object.assign(S, { phase: "play", round: 1, turnI: 0, turnPid: S.order[0], step: "roll", dbl: 0, again: false, dice: [1, 1], rollN: 0, playMs: 0, log: [], fx: [], trades: {}, debts: [], move: null, card: null, quest: null, auction: null, offer: null, lastCard: null, lastQuest: null, lastAuction: null, results: null, paused: false, startedAt: E.now(), lastTick: E.now() });
    log(S, `Let the game begin! ${nm(S, S.turnPid)} goes first.`);
    fx(S, { k: "turn", pid: S.turnPid });
    return true;
  };

  // ---------- money ----------
  function give(S, pid, amt, why) { const p = S.players[pid]; if (!p || amt <= 0) return; p.cash += amt; fx(S, { k: "cash", pid, amt, why }); }
  // returns true if paid now, false if it became a debt
  function pay(S, from, amt, to) {
    const p = S.players[from]; if (!p || amt <= 0) return true;
    if (p.cash >= amt) {
      p.cash -= amt; fx(S, { k: "cash", pid: from, amt: -amt });
      if (to && S.players[to] && !S.players[to].out) give(S, to, amt);
      return true;
    }
    S.debts.push({ pid: from, amt, to: to || null });
    log(S, `${nm(S, from)} owes ${money(S, amt)} and needs to raise money.`);
    fx(S, { k: "debt", pid: from, amt });
    return false;
  }
  function settle(S, cont) { if (S.debts.length) { S.step = "debt"; S.cont = cont; } else runCont(S, cont); }
  function runCont(S, c) {
    S.cont = null;
    if (c === "jailmove") { const p = cur(S); if (p.out) return nextTurn(S); p.jail = 0; return moveBy(S, S.turnPid, S.dice[0] + S.dice[1], true); }
    return afterLand(S);
  }
  function tryPayDebts(S, pid) {
    for (const d of S.debts.filter(d => d.pid === pid)) {
      const p = S.players[pid];
      if (p.cash >= d.amt) {
        p.cash -= d.amt; fx(S, { k: "cash", pid, amt: -d.amt });
        if (d.to && S.players[d.to] && !S.players[d.to].out) give(S, d.to, d.amt);
        S.debts.splice(S.debts.indexOf(d), 1);
        log(S, `${nm(S, pid)} paid what they owed.`);
      }
    }
    if (!S.debts.length && S.step === "debt") runCont(S, S.cont);
  }
  E.owed = (S, pid) => S.debts.filter(d => d.pid === pid).reduce((a, d) => a + d.amt, 0);

  // ---------- turns ----------
  function sendJail(S, pid) {
    const p = S.players[pid]; p.pos = JAIL; p.jail = 1; p.stats.jailed++; S.again = false; S.dbl = 0;
    log(S, `${p.name} is sent to ${theme(S).jail}!`); fx(S, { k: "jail", pid });
  }
  function roll(S, pid) {
    const p = S.players[pid];
    const d = [R(6) + 1, R(6) + 1], dbl = d[0] === d[1], sum = d[0] + d[1];
    S.dice = d; S.rollN++; fx(S, { k: "dice", pid, d });
    if (dbl) p.stats.doubles++;
    if (p.jail) {
      if (dbl) { p.jail = 0; S.again = false; log(S, `${p.name} rolled a double and escaped ${theme(S).jail}!`); return moveBy(S, pid, sum, true); }
      p.jail++;
      if (p.jail > 3) {
        S.again = false; log(S, `${p.name} has to pay ${money(S, JAIL_FINE)} to get out.`);
        if (pay(S, pid, JAIL_FINE, null)) return runCont(S, "jailmove");
        return settle(S, "jailmove");
      }
      log(S, `${p.name} didn't roll a double, so stays in ${theme(S).jail}.`);
      S.again = false; S.step = "end"; return;
    }
    if (dbl) {
      S.dbl++;
      if (S.dbl >= 3) { log(S, `Three doubles in a row! ${p.name} is too fast.`); sendJail(S, pid); S.step = "end"; return; }
    }
    S.again = dbl;
    moveBy(S, pid, sum, true);
  }
  function moveBy(S, pid, n, fromDice, opt) {
    const p = S.players[pid], from = p.pos, path = [];
    for (let i = 1; i <= Math.abs(n); i++) path.push(((from + Math.sign(n) * i) % 36 + 36) % 36);
    S.move = { pid, path, pass: n > 0 && from + n >= 36, opt: opt || {} };
    S.step = "moving"; S.moveEnd = E.now() + (fromDice ? 1300 : 400) + path.length * 240;
  }
  function moveTo(S, pid, to, opt) { const n = (to - S.players[pid].pos + 36) % 36; moveBy(S, pid, n || 36, false, opt); }
  function finishMove(S) {
    const m = S.move, p = S.players[m.pid]; S.move = null;
    p.pos = m.path[m.path.length - 1];
    if (m.pass) { give(S, m.pid, PASS, "pass"); log(S, `${p.name} passed ${theme(S).start} and collected ${money(S, PASS)}.`); }
    land(S, m.pid, m.opt);
  }
  function land(S, pid, opt) {
    const p = S.players[pid], i = p.pos, b = BOARD[i];
    if (b.t === "prop" || b.t === "station") {
      const o = S.own[i];
      if (!o) { S.offer = i; S.step = "buy"; return; }
      if (o.o === pid) { log(S, `${p.name} is home at ${E.sqName(S, i)}.`); return afterLand(S); }
      if (o.m) { log(S, `${E.sqName(S, i)} is mortgaged, so no rent to pay.`); return afterLand(S); }
      const r = E.rentOf(S, i) * (opt && opt.double ? 2 : 1), ow = S.players[o.o];
      log(S, `${p.name} pays ${money(S, r)} rent to ${ow.name} for ${E.sqName(S, i)}.`);
      ow.stats.rentIn += r; fx(S, { k: "rent", pid, to: o.o, amt: r, sq: i });
      pay(S, pid, r, o.o); return settle(S, "after");
    }
    if (b.t === "chance" || b.t === "quest") return draw(S, pid, b.t);
    if (b.t === "gojail") { sendJail(S, pid); return afterLand(S); }
    afterLand(S);
  }
  function afterLand(S) {
    const p = cur(S);
    if (!p || p.out) return nextTurn(S);
    S.offer = null;
    if (S.again && !p.jail) { S.step = "roll"; log(S, `${p.name} rolled a double, so rolls again.`); fx(S, { k: "again", pid: p.id }); }
    else S.step = "end";
  }
  E.timeUp = S => S.settings.end === "time" && S.playMs >= S.settings.endVal * 60000;
  E.lastRound = S => (S.settings.end === "rounds" && S.round >= S.settings.endVal) || E.timeUp(S);
  function nextTurn(S) {
    S.dbl = 0; S.again = false; S.card = null; S.quest = null; S.offer = null; S.auction = null; S.move = null;
    const al = E.alive(S);
    if (al.length <= 1) return endGame(S);
    const st = S.settings;
    if (st.end === "target") { const w = al.find(id => E.netWorth(S, id) >= st.endVal); if (w) return endGame(S); }
    let i = S.turnI, wrapped = false;
    for (let k = 0; k < S.order.length; k++) {
      i = (i + 1) % S.order.length; if (i === 0) wrapped = true;
      if (!S.players[S.order[i]].out) break;
    }
    if (wrapped) {
      if ((st.end === "rounds" && S.round >= st.endVal) || E.timeUp(S)) return endGame(S);
      S.round++;
    }
    S.turnI = i; S.turnPid = S.order[i]; S.step = "roll";
    fx(S, { k: "turn", pid: S.turnPid });
  }
  function endGame(S) {
    S.phase = "end"; S.step = null; S.move = null; S.auction = null; S.quest = null; S.card = null; S.trades = {};
    const al = E.alive(S), out = S.order.filter(id => S.players[id].out).sort((a, b) => S.players[b].outAt - S.players[a].outAt);
    const rank = al.sort((a, b) => E.netWorth(S, b) - E.netWorth(S, a)).concat(out);
    const P = S.players, top = (f, min) => { const best = S.order.slice().sort((a, b) => f(P[b]) - f(P[a]))[0]; return best && f(P[best]) >= (min || 1) ? best : null; };
    const aw = [];
    const a1 = top(p => p.stats.rentIn); if (a1) aw.push(["💰", "Rent Collector", a1, money(S, P[a1].stats.rentIn) + " in rent"]);
    const a2 = top(p => p.stats.bought); if (a2) aw.push(["🏘️", "Land Grabber", a2, pl(P[a2].stats.bought, "place") + " bought"]);
    const a3 = top(p => p.stats.built); if (a3) aw.push([theme(S).house.i, "Master Builder", a3, pl(P[a3].stats.built, "building") + " built"]);
    const a4 = top(p => p.stats.quests); if (a4) aw.push(["🎭", "Quest Hero", a4, pl(P[a4].stats.quests, "task") + " done"]);
    const a5 = top(p => p.stats.doubles, 2); if (a5) aw.push(["🎲", "Lucky Roller", a5, pl(P[a5].stats.doubles, "double")]);
    const a6 = top(p => p.stats.jailed); if (a6) aw.push(["⛓️", theme(S).jailName + " Regular", a6, pl(P[a6].stats.jailed, "visit")]);
    S.results = { rank: rank.map(id => ({ id, nw: P[id].out ? 0 : E.netWorth(S, id), out: !!P[id].out })), awards: aw };
    log(S, `Game over! ${nm(S, rank[0])} wins!`); fx(S, { k: "end" });
  }

  // ---------- cards ----------
  function draw(S, pid, deck) {
    const D = S.decks[deck], defs = deck === "chance" ? root.CHANCE : root.QUEST;
    if (!D.length) S.decks[deck] = shuffle(defs.map((_, i) => i).filter(i => (deck === "chance" || S.settings.quests || defs[i].k !== "task") && !Object.values(S.players).some(p => (p.esc || []).some(e => e[0] === deck && e[1] === i))));
    const ci = S.decks[deck].shift(), c = defs[ci];
    if (c.k !== "escape") S.decks[deck].push(ci);
    const t = theme(S), icon = deck === "chance" ? t.chance.icon : t.quest.icon, title = deck === "chance" ? t.chance.name : t.quest.name;
    if (c.k === "task") return startQuest(S, pid, { deck, ci, icon, title });
    S.card = { deck, ci, pid, icon, title, txt: E.fill(S, c.txt), at: E.now() };
    S.lastCard = S.card; S.step = "card";
    fx(S, { k: "card", pid, deck });
  }
  function applyCard(S) {
    const cd = S.card; if (!cd) return; S.card = null;
    const c = (cd.deck === "chance" ? root.CHANCE : root.QUEST)[cd.ci], pid = cd.pid, p = S.players[pid];
    log(S, `${p.name}: ${cd.txt}`);
    switch (c.k) {
      case "goto": return moveTo(S, pid, c.to, {});
      case "near": { const to = STATIONS.find(s => s > p.pos) ?? STATIONS[0]; return moveTo(S, pid, to, { double: true }); }
      case "back": return moveBy(S, pid, -c.n, false, {});
      case "jail": sendJail(S, pid); return afterLand(S);
      case "escape": p.esc.push([cd.deck, cd.ci]); return afterLand(S);
      case "money": if (c.amt > 0) { give(S, pid, c.amt); return afterLand(S); } pay(S, pid, -c.amt, null); return settle(S, "after");
      case "each": {
        const others = E.alive(S).filter(x => x !== pid);
        if (c.amt > 0) others.forEach(x => pay(S, x, c.amt, pid));
        else others.forEach(x => pay(S, pid, -c.amt, x));
        return settle(S, "after");
      }
      case "repairs": {
        let h = 0, ho = 0; S.own.forEach(o => { if (o && o.o === pid) { if (o.h === 5) ho++; else h += o.h; } });
        const amt = h * c.h + ho * c.c;
        if (!amt) { log(S, `No buildings, so nothing to pay!`); return afterLand(S); }
        pay(S, pid, amt, null); return settle(S, "after");
      }
    }
    afterLand(S);
  }

  // ---------- quests ----------
  function startQuest(S, pid, card) {
    const p = S.players[pid];
    let pool = root.TASKS.map((t, i) => i).filter(i => !!root.TASKS[i].kid === !!p.kid);
    let fresh = pool.filter(i => !S.usedTasks.includes(i)); if (!fresh.length) { S.usedTasks = S.usedTasks.filter(i => !pool.includes(i)); fresh = pool; }
    const ti = fresh[R(fresh.length)]; S.usedTasks.push(ti);
    const t = root.TASKS[ti];
    S.quest = Object.assign({ pid, ti, t: t.t, cat: t.cat || null, what: t.what || null, txt: t.txt || null, reward: [50, 100, 150][R(3)], endsAt: E.now() + (t.t === "secret" ? 75000 : 60000), votes: {} }, card);
    S.step = "quest";
    fx(S, { k: "quest", pid });
  }
  function resolveQuest(S, ok, skipped) {
    const q = S.quest; if (!q) return; S.quest = null;
    const p = S.players[q.pid];
    S.lastQuest = Object.assign({}, q, { ok, skipped: !!skipped });
    if (ok) { give(S, q.pid, q.reward, "quest"); p.stats.quests++; log(S, `${p.name} completed the ${q.title} and wins ${money(S, q.reward)}!`); }
    else log(S, skipped ? `${p.name} skipped the ${q.title}.` : `${p.name} didn't quite manage the ${q.title}. No reward this time.`);
    fx(S, { k: "questdone", pid: q.pid, ok });
    afterLand(S);
  }
  E.voters = S => S.quest ? E.alive(S).filter(x => x !== S.quest.pid) : [];
  function checkVotes(S) {
    const q = S.quest; if (!q || q.t !== "perform") return;
    const v = E.voters(S); if (v.length && v.every(x => q.votes[x] != null)) finishVotes(S);
  }
  function finishVotes(S) {
    const vs = Object.values(S.quest.votes), yes = vs.filter(Boolean).length, no = vs.length - yes;
    resolveQuest(S, yes >= no);
  }

  // ---------- auctions ----------
  function startAuction(S, i) {
    S.auction = { sq: i, bids: {}, endsAt: E.now() + 25000 }; S.step = "auction"; S.offer = null;
    log(S, `${E.sqName(S, i)} goes up for auction! Everyone bids secretly on their phone.`); fx(S, { k: "auction", sq: i });
  }
  function closeAuction(S) {
    const a = S.auction; if (!a) return;
    const list = Object.entries(a.bids).map(([id, b]) => ({ id, a: b.a, t: b.t })).sort((x, y) => y.a - x.a || x.t - y.t);
    const w = list.find(b => b.a > 0 && S.players[b.id] && !S.players[b.id].out && S.players[b.id].cash >= b.a);
    S.auction = null;
    if (w) {
      S.players[w.id].cash -= w.a; fx(S, { k: "cash", pid: w.id, amt: -w.a });
      S.own[a.sq] = { o: w.id, h: 0, m: false }; S.players[w.id].stats.bought++;
      log(S, `${nm(S, w.id)} won ${E.sqName(S, a.sq)} for ${money(S, w.a)}!`);
    } else log(S, `Nobody bid on ${E.sqName(S, a.sq)}. It stays unsold.`);
    S.lastAuction = { sq: a.sq, bids: list.map(b => [b.id, b.a]), w: w ? w.id : null, a: w ? w.a : 0, at: E.now() };
    fx(S, { k: "sold", sq: a.sq, pid: w ? w.id : null });
    afterLand(S);
  }

  // ---------- building and mortgages ----------
  E.canBuild = (S, pid, i) => {
    const b = BOARD[i], o = S.own[i];
    if (!o || o.o !== pid || b.t !== "prop" || o.h >= 5) return false;
    if (E.groupOwner(S, b.g) !== pid) return false;
    const G = GROUPS[b.g].sq.map(j => S.own[j]);
    if (G.some(x => x.m)) return false;
    return o.h <= Math.min(...G.map(x => x.h)) && S.players[pid].cash >= b.house;
  };
  E.canSell = (S, pid, i) => { const b = BOARD[i], o = S.own[i]; return !!(o && o.o === pid && o.h > 0 && o.h >= Math.max(...GROUPS[b.g].sq.map(j => (S.own[j] || { h: 0 }).h))); };
  E.canMortgage = (S, pid, i) => { const b = BOARD[i], o = S.own[i]; return !!(o && o.o === pid && !o.m && (b.t === "station" || !E.groupHasHouses(S, b.g))); };
  E.canUnmortgage = (S, pid, i) => { const o = S.own[i]; return !!(o && o.o === pid && o.m && S.players[pid].cash >= E.unmortCost(i)); };
  E.tradable = (S, i) => { const b = BOARD[i]; return b.t === "station" || !E.groupHasHouses(S, b.g); };
  function manage(S, pid, what, i) {
    const p = S.players[pid], o = S.own[i], b = BOARD[i], t = theme(S);
    if (what === "build" && E.canBuild(S, pid, i)) { p.cash -= b.house; o.h++; p.stats.built++; fx(S, { k: "build", pid, sq: i, h: o.h }); { const w = o.h === 5 ? t.hotel.n : t.house.n; log(S, `${p.name} built ${/^[aeiou]/i.test(w) ? "an" : "a"} ${w} on ${E.sqName(S, i)}.`); }; return true; }
    if (what === "sell" && E.canSell(S, pid, i)) { o.h--; p.cash += b.house / 2; fx(S, { k: "cash", pid, amt: b.house / 2 }); log(S, `${p.name} sold a building on ${E.sqName(S, i)}.`); return true; }
    if (what === "mortgage" && E.canMortgage(S, pid, i)) { o.m = true; p.cash += E.mortVal(i); fx(S, { k: "cash", pid, amt: E.mortVal(i) }); log(S, `${p.name} mortgaged ${E.sqName(S, i)}.`); return true; }
    if (what === "unmortgage" && E.canUnmortgage(S, pid, i)) { o.m = false; p.cash -= E.unmortCost(i); log(S, `${p.name} paid off the mortgage on ${E.sqName(S, i)}.`); return true; }
    return false;
  }
  // Helper: raise money the gentle way (keeps full sets and buildings as long as possible)
  E.raisePlan = (S, pid, need) => {
    const T = JSON.parse(JSON.stringify(S)), steps = [];
    const mineIdx = () => E.mine(T, pid);
    const val = () => T.players[pid].cash;
    const order = () => {
      const m = mineIdx();
      const loose = m.filter(i => BOARD[i].t === "prop" && E.groupOwner(T, BOARD[i].g) !== pid && E.canMortgage(T, pid, i)).sort((a, b) => BOARD[a].price - BOARD[b].price);
      const st = m.filter(i => BOARD[i].t === "station" && E.canMortgage(T, pid, i));
      const sell = m.filter(i => E.canSell(T, pid, i)).sort((a, b) => T.own[b].h - T.own[a].h || BOARD[a].house - BOARD[b].house);
      const rest = m.filter(i => E.canMortgage(T, pid, i)).sort((a, b) => BOARD[a].price - BOARD[b].price);
      return loose.length ? ["mortgage", loose[0]] : st.length ? ["mortgage", st[0]] : sell.length ? ["sell", sell[0]] : rest.length ? ["mortgage", rest[0]] : null;
    };
    let guard = 0;
    while (val() < need && guard++ < 200) { const s = order(); if (!s) break; manage(T, pid, s[0], s[1]); steps.push(s); }
    return { steps, enough: val() >= need };
  };

  // ---------- bankruptcy ----------
  function bankrupt(S, pid) {
    const p = S.players[pid]; if (!p || p.out) return;
    const d = S.debts.find(x => x.pid === pid), to = d && d.to && S.players[d.to] && !S.players[d.to].out ? d.to : null;
    S.own.forEach((o, i) => { if (o && o.o === pid && o.h) { p.cash += o.h * BOARD[i].house / 2; o.h = 0; } });
    S.own.forEach((o, i) => { if (o && o.o === pid) S.own[i] = to ? { o: to, h: 0, m: o.m } : null; });
    if (to && p.cash > 0) give(S, to, p.cash);
    p.cash = 0; p.out = true; p.outAt = E.now();
    p.esc = [];
    S.debts = S.debts.filter(x => x.pid !== pid); S.debts.forEach(x => { if (x.to === pid) x.to = null; });
    Object.keys(S.trades).forEach(k => { const t = S.trades[k]; if (t.from === pid || t.to === pid) delete S.trades[k]; });
    if (S.auction) delete S.auction.bids[pid];
    log(S, `${p.name} is out of the game${to ? `, and everything goes to ${nm(S, to)}` : ""}.`);
    fx(S, { k: "out", pid });
    if (E.alive(S).length <= 1) return endGame(S);
    if (S.step === "debt") { if (!S.debts.length) runCont(S, S.cont); }
    else if (S.turnPid === pid) nextTurn(S);
    else if (S.step === "auction") { const al = E.alive(S); if (al.every(x => S.auction.bids[x])) closeAuction(S); }
    else if (S.step === "quest") checkVotes(S);
  }

  // ---------- trades ----------
  function cleanTrade(S, from, x) {
    const to = String(x.to || ""), P = S.players;
    if (!P[to] || P[to].out || to === from) return null;
    const ints = a => (Array.isArray(a) ? a : []).map(Number).filter(i => Number.isInteger(i) && i >= 0 && i < 36);
    const give = [...new Set(ints(x.give))], get = [...new Set(ints(x.get))];
    const gc = Math.max(0, Math.floor(+x.gc || 0)), tc = Math.max(0, Math.floor(+x.tc || 0));
    if (!give.length && !get.length && !gc && !tc) return null;
    if (give.some(i => !S.own[i] || S.own[i].o !== from || !E.tradable(S, i))) return null;
    if (get.some(i => !S.own[i] || S.own[i].o !== to || !E.tradable(S, i))) return null;
    if (gc > P[from].cash) return null;
    return { from, to, give, get, gc, tc };
  }

  // ---------- actions from phones (and the TV for the host) ----------
  E.act = (S, pid, m) => {
    const p = S.players[pid], t = m.t;
    if (S.phase === "lobby" || S.phase === "end") {
      if (pid !== S.host && !m.tv) return false;
      if (t === "set") return E.setSetting(S, m.k, m.v);
      if (t === "start" && S.phase === "lobby") return E.start(S);
      if (t === "again" && S.phase === "end") return E.start(S);
      if (t === "lobby" && S.phase === "end") { S.phase = "lobby"; S.results = null; return true; }
      return false;
    }
    if (S.phase !== "play") return false;
    const isHost = pid === S.host || m.tv;
    // host controls
    if (t === "pause" && isHost) { S.paused = !S.paused; log(S, S.paused ? "Game paused." : "Game on!"); return true; }
    if (t === "endnow" && isHost) { endGame(S); return true; }
    if (t === "nudge" && isHost) return E.nudge(S);
    if (!p || p.out) return false;
    if (S.paused) return false;
    const myTurn = pid === S.turnPid;
    switch (t) {
      case "roll": if (myTurn && S.step === "roll") { roll(S, pid); return true; } return false;
      case "jailpay": if (myTurn && S.step === "roll" && p.jail && p.cash >= JAIL_FINE) { pay(S, pid, JAIL_FINE, null); p.jail = 0; log(S, `${p.name} paid ${money(S, JAIL_FINE)} to get out of ${theme(S).jail}.`); return true; } return false;
      case "jailcard": if (myTurn && S.step === "roll" && p.jail && p.esc.length) { const e = p.esc.shift(); S.decks[e[0]].push(e[1]); p.jail = 0; log(S, `${p.name} used a get-out-free card!`); return true; } return false;
      case "buy": if (myTurn && S.step === "buy" && p.cash >= BOARD[S.offer].price) {
        const i = S.offer; p.cash -= BOARD[i].price; fx(S, { k: "cash", pid, amt: -BOARD[i].price }); S.own[i] = { o: pid, h: 0, m: false }; p.stats.bought++;
        log(S, `${p.name} bought ${E.sqName(S, i)} for ${money(S, BOARD[i].price)}.`); fx(S, { k: "bought", pid, sq: i }); afterLand(S); return true;
      } return false;
      case "pass": if (myTurn && S.step === "buy") { startAuction(S, S.offer); return true; } return false;
      case "bid": {
        const a = S.auction; if (S.step !== "auction" || !a || a.bids[pid]) return false;
        a.bids[pid] = { a: Math.max(0, Math.min(p.cash, Math.floor(+m.a || 0))), t: E.now() };
        if (E.alive(S).every(x => a.bids[x])) closeAuction(S);
        return true;
      }
      case "cardok": if (myTurn && S.step === "card") { applyCard(S); return true; } return false;
      case "qdone": if (S.step === "quest" && S.quest && S.quest.pid === pid) { if (m.skip) resolveQuest(S, false, true); else if (S.quest.t === "secret") resolveQuest(S, !!m.ok); else { S.quest.ready = true; checkVotes(S); } return true; } return false;
      case "vote": if (S.step === "quest" && S.quest && S.quest.t === "perform" && S.quest.pid !== pid && S.quest.votes[pid] == null) { S.quest.votes[pid] = !!m.ok; checkVotes(S); return true; } return false;
      case "build": case "sell": case "mortgage": case "unmortgage": {
        if (S.step === "moving") return false;
        if (!manage(S, pid, t, +m.i)) return false;
        tryPayDebts(S, pid); return true;
      }
      case "autoraise": {
        const need = E.owed(S, pid); if (!need) return false;
        const plan = E.raisePlan(S, pid, need); plan.steps.forEach(s => manage(S, pid, s[0], s[1]));
        tryPayDebts(S, pid); return true;
      }
      case "bankrupt": if (S.debts.some(d => d.pid === pid)) { bankrupt(S, pid); return true; } return false;
      case "endturn": if (myTurn && S.step === "end") { nextTurn(S); return true; } return false;
      case "offer": {
        const tr = cleanTrade(S, pid, m); if (!tr) return false;
        Object.keys(S.trades).forEach(k => { if (S.trades[k].from === pid) delete S.trades[k]; });
        const id = Math.random().toString(36).slice(2, 8); S.trades[id] = Object.assign(tr, { id, at: E.now() });
        log(S, `${p.name} offered ${nm(S, tr.to)} a trade.`); fx(S, { k: "offer", pid, to: tr.to }); return true;
      }
      case "cancel": { const tr = S.trades[m.id]; if (tr && tr.from === pid) { delete S.trades[m.id]; return true; } return false; }
      case "answer": {
        const tr = S.trades[m.id]; if (!tr || tr.to !== pid) return false;
        delete S.trades[m.id];
        if (!m.ok) { log(S, `${p.name} said no to ${nm(S, tr.from)}'s trade.`); fx(S, { k: "declined", pid: tr.from }); return true; }
        const ok = cleanTrade(S, tr.from, tr);
        if (!ok || S.players[tr.to].cash < tr.tc) { log(S, `That trade can't happen any more (something changed).`); fx(S, { k: "declined", pid: tr.from }); return true; }
        const A = S.players[tr.from], B = S.players[tr.to];
        tr.give.forEach(i => S.own[i].o = tr.to); tr.get.forEach(i => S.own[i].o = tr.from);
        A.cash += tr.tc - tr.gc; B.cash += tr.gc - tr.tc;
        log(S, `🤝 ${A.name} and ${B.name} made a trade!`); fx(S, { k: "trade", a: tr.from, b: tr.to, tr });
        tryPayDebts(S, tr.from); tryPayDebts(S, tr.to);
        return true;
      }
    }
    return false;
  };
  // host "move things along" for a stuck turn
  E.nudge = S => {
    switch (S.step) {
      case "roll": roll(S, S.turnPid); return true;
      case "buy": startAuction(S, S.offer); return true;
      case "auction": closeAuction(S); return true;
      case "card": applyCard(S); return true;
      case "quest": if (S.quest.t === "perform") finishVotes(S); else resolveQuest(S, false); return true;
      case "end": nextTurn(S); return true;
      case "debt": { const d = S.debts[0]; if (d) bankrupt(S, d.pid); return true; }
    }
    return false;
  };

  // ---------- clock ----------
  E.tick = S => {
    if (S.phase !== "play") return false;
    const n = E.now(), dt = Math.max(0, Math.min(2000, n - (S.lastTick || n))); S.lastTick = n;
    if (S.paused) {
      // keep timers frozen while paused
      if (S.auction) S.auction.endsAt += dt; if (S.quest) S.quest.endsAt += dt; if (S.moveEnd) S.moveEnd += dt; if (S.card) S.card.at += dt;
      return false;
    }
    S.playMs += dt;
    if (S.step === "moving" && S.move && n >= S.moveEnd) { finishMove(S); return true; }
    if (S.step === "auction" && S.auction && n >= S.auction.endsAt) { closeAuction(S); return true; }
    if (S.step === "quest" && S.quest && n >= S.quest.endsAt) { if (S.quest.t === "perform") finishVotes(S); else resolveQuest(S, false); return true; }
    if (S.step === "card" && S.card && n - S.card.at > 15000) { applyCard(S); return true; }
    return false;
  };

  // ---------- helper advice ----------
  E.advice = (S, pid) => {
    const p = S.players[pid]; if (!p) return null;
    const t = theme(S), out = [];
    if (S.step === "buy" && S.turnPid === pid) {
      const i = S.offer, b = BOARD[i], left = p.cash - b.price;
      if (left < 0) out.push(`You need ${money(S, b.price - p.cash)} more to buy this. You could mortgage a place in My lands, or let it go to auction.`);
      else if (b.t === "prop") {
        const G = GROUPS[b.g].sq, mineN = G.filter(j => S.own[j] && S.own[j].o === pid).length, other = G.map(j => S.own[j] && S.own[j].o).find(o => o && o !== pid);
        if (left < 100) out.push(`⚠️ Buying leaves you with only ${money(S, left)}. You could auction it instead.`);
        else if (mineN === G.length - 1) out.push(`⭐ Buy it! It finishes your ${GROUPS[b.g].name.toLowerCase()} set, and then you can build ${t.house.n}s.`);
        else if (mineN) out.push(`👍 Good buy. You'd own ${mineN + 1} of the ${G.length} ${GROUPS[b.g].name.toLowerCase()} places.`);
        else if (other && G.filter(j => S.own[j] && S.own[j].o === other).length === G.length - 1) out.push(`🛑 Buy it to stop ${nm(S, other)} getting the full set!`);
        else out.push(`👍 Good buy. Owning places means other players pay you rent.`);
      } else out.push(left < 100 ? `⚠️ Buying leaves you with only ${money(S, left)}.` : `👍 Good buy. The more of these you own, the more rent you get.`);
    }
    if (S.step === "auction" && S.auction && !S.auction.bids[pid]) out.push(`💡 A good bid would be about ${money(S, E.suggestBid(S, pid))}.`);
    if (E.owed(S, pid)) { const need = E.owed(S, pid), pl = E.raisePlan(S, pid, need); out.push(pl.enough ? `💡 Press “Sort it for me” and I'll mortgage or sell what you need to raise ${money(S, need)}.` : `😬 Even selling everything won't cover this. You'll have to give up.`); }
    if (S.step === "end" && S.turnPid === pid) {
      const sets = GROUPS.map((g, gi) => gi).filter(gi => E.groupOwner(S, gi) === pid && GROUPS[gi].sq.some(i => E.canBuild(S, pid, i)));
      if (sets.length) out.push(`🏗️ You own every ${sets.map(g => GROUPS[g].name.toLowerCase()).join(" and ")} place, so you can build ${t.house.n}s in My lands. Rent goes up a lot!`);
      else out.push(`👍 All done. Press End turn to pass the dice on.`);
    }
    if (S.step === "roll" && S.turnPid === pid && p.jail) out.push(p.esc.length ? `💡 Use your get-out-free card!` : p.cash > 400 ? `💡 Paying ${money(S, JAIL_FINE)} gets you moving again.` : `💡 Try rolling for a double. It's free!`);
    return out.length ? out : null;
  };
  E.suggestBid = (S, pid) => {
    const a = S.auction; if (!a) return 0; const b = BOARD[a.sq], p = S.players[pid];
    let v = b.price;
    if (b.t === "prop") {
      const G = GROUPS[b.g].sq, mineN = G.filter(j => S.own[j] && S.own[j].o === pid).length;
      if (mineN === G.length - 1) v *= 1.5;
      else if (G.some(j => S.own[j] && S.own[j].o !== pid && G.filter(k => S.own[k] && S.own[k].o === S.own[j].o).length === G.length - 1)) v *= 1.2;
      else v *= .8;
    }
    return Math.max(0, Math.min(Math.round(v / 10) * 10, Math.max(0, p.cash - 50)));
  };

  // what the phones are allowed to see
  E.pub = S => {
    const o = JSON.parse(JSON.stringify(S));
    delete o.decks; delete o.usedTasks;
    if (o.auction) o.auction.bids = Object.fromEntries(Object.keys(o.auction.bids).map(k => [k, 1]));
    if (o.quest && o.quest.t === "secret") o.quest.what = null;
    o.log = o.log.slice(-12);
    return o;
  };

  root.Engine = E;
})(typeof window !== "undefined" ? window : globalThis);
