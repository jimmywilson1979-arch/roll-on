// =====================================================================
// Roll On · Adventure — team game rules engine (everyone vs the board).
// Explore a hidden island map, find 4 map pieces, reach the X and win
// the Team Finale before the storm (or dragon, or midnight) arrives.
// Pure logic: the TV runs it, phones send actions.
// =====================================================================
(function (root) {
  const A = {};
  A.now = () => Date.now();
  A.rng = Math.random;
  const R = n => A.rng() * n | 0;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = R(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const N = 7, CAMP = 6 * N + 3;
  const WATER = new Set([0, 1, 5, 6, 7, 13, 35, 41, 42, 48]);
  A.N = N; A.CAMP = CAMP; A.WATER = WATER;
  const rc = i => [i / N | 0, i % N];
  const dist = (a, b) => { const [r1, c1] = rc(a), [r2, c2] = rc(b); return Math.abs(r1 - r2) + Math.abs(c1 - c2); };
  A.rc = rc; A.dist = dist;
  A.nbrs = i => { const [r, c] = rc(i), out = []; [[-1, 0, "up"], [1, 0, "down"], [0, -1, "left"], [0, 1, "right"]].forEach(([dr, dc, d]) => { const r2 = r + dr, c2 = c + dc; if (r2 >= 0 && r2 < N && c2 >= 0 && c2 < N && !WATER.has(r2 * N + c2)) out.push({ i: r2 * N + c2, d }); }); return out; };

  // ---------- themes ----------
  A.THEMES = {
    island: {
      key: "island", label: "🏝️ Treasure Island", title: "Treasure Island", danger: "storm", dangerIcon: "🌩️", dangerText: "The storm is coming",
      lose: "The storm swept over the island! The treasure stays buried… this time.", win: "You found the treasure! The whole crew is rich!",
      piece: "map piece", pieceIcon: "🗺️", pieceAll: "The map is complete! X marks the spot!", x: "Treasure X", xIcon: "❌", xFound: "💰",
      finale: "Dig for the treasure! Everyone tap as fast as you can!", finaleIcon: "⛏️",
      heroes: { brave: ["🏴‍☠️", "Captain", "Brave: gets a second go at any challenge"], peek: ["🔭", "Lookout", "Can peek at a hidden square next to them once a turn"], heal: ["🩹", "Ship's Doctor", "Never gets stuck, and frees stuck teammates"], fast: ["🐒", "Explorer", "Moves 1 extra step every turn"] },
      tiles: { camp: ["⛺", "Base Camp"], calm: ["🌴", "Palm Grove|Sandy Beach|Jungle Path|Coconut Grove|Lagoon|Rock Pools"], item: ["📦", "Shipwreck|Supply Crate|Old Chest|Pirate Cache"], chal: ["🦜", "Parrot Puzzle"], map: ["🗺️", "Map Piece"], quick: ["🟫", "Quicksand"], snake: ["🐍", "Snake Pit"], cave: ["🕳️", "Dark Cave"], rock: ["🪨", "Rockfall"], look: ["🗼", "Lookout Tower"], x: ["❌", "Strange Marks"] },
      look: { sea: "#1678b8", sea2: "#0c4f80", land: "#f0d58c", land2: "#d9b865", fog: "#3f8f6a", fog2: "#2a6b4d", ink: "#3a2a10", accent: "#ffcf3f" },
    },
    dragon: {
      key: "dragon", label: "🐉 Dragon's Mountain", title: "Dragon's Mountain", danger: "dragon", dangerIcon: "🐉", dangerText: "The dragon is waking",
      lose: "The dragon woke up and chased everyone off the mountain!", win: "The dragon is beaten and its gold is yours!",
      piece: "rune stone", pieceIcon: "🔷", pieceAll: "All four runes! The dragon's lair is revealed!", x: "Dragon's Lair", xIcon: "🐉", xFound: "👑",
      finale: "Battle the dragon! Everyone tap to attack!", finaleIcon: "⚔️",
      heroes: { brave: ["🛡️", "Knight", "Brave: gets a second go at any challenge"], peek: ["🔮", "Wizard", "Can peek at a hidden square next to them once a turn"], heal: ["💚", "Healer", "Never gets stuck, and frees stuck teammates"], fast: ["🏹", "Ranger", "Moves 1 extra step every turn"] },
      tiles: { camp: ["🏕️", "Village"], calm: ["🌲", "Pine Forest|Meadow|Mountain Path|Stream|Old Bridge|Ruins"], item: ["🧰", "Blacksmith|Traveller's Pack|Treasure Nook|Hermit's Hut"], chal: ["📜", "Riddle Stone"], map: ["🔷", "Rune Stone"], quick: ["🕸️", "Giant Web"], snake: ["🐺", "Wolf Den"], cave: ["🕳️", "Goblin Cave"], rock: ["🪨", "Rockslide"], look: ["🗻", "High Peak"], x: ["🔥", "Scorched Rocks"] },
      look: { sea: "#3a3550", sea2: "#1f1b30", land: "#b9d58a", land2: "#8fb562", fog: "#5a5f7a", fog2: "#3d4158", ink: "#1f2a12", accent: "#ffb347" },
    },
    xmas: {
      key: "xmas", label: "🎄 Save Christmas", title: "Save Christmas", danger: "clock", dangerIcon: "🕛", dangerText: "Midnight is coming",
      lose: "Midnight struck before the sleigh was loaded! Christmas is late this year…", win: "The sleigh is loaded and Christmas is saved!",
      piece: "lost present sack", pieceIcon: "🎁", pieceAll: "All the presents found! Now find Santa's sleigh!", x: "Santa's Sleigh", xIcon: "🛷", xFound: "🎅",
      finale: "Load the sleigh! Everyone tap as fast as you can!", finaleIcon: "🛷",
      heroes: { brave: ["🧝", "Head Elf", "Brave: gets a second go at any challenge"], peek: ["⭐", "Star Gazer", "Can peek at a hidden square next to them once a turn"], heal: ["🍪", "Mrs Claus", "Never gets stuck, and frees stuck teammates"], fast: ["🦌", "Reindeer", "Moves 1 extra step every turn"] },
      tiles: { camp: ["🏠", "Santa's Workshop"], calm: ["🌲", "Pine Woods|Snowfield|Frozen Pond|Candy Cane Path|Igloo|Toy Shop"], item: ["🎁", "Gift Pile|Elf Store|Cocoa Hut|Sweet Shop"], chal: ["🧩", "Elf Puzzle"], map: ["🎁", "Present Sack"], quick: ["❄️", "Deep Snow"], snake: ["🐻‍❄️", "Polar Bear"], cave: ["🕳️", "Ice Cave"], rock: ["🌨️", "Avalanche"], look: ["🗼", "Lighthouse"], x: ["🛷", "Sleigh Tracks"] },
      look: { sea: "#26496e", sea2: "#152c47", land: "#f4fbff", land2: "#d6e8f5", fog: "#8fb0c8", fog2: "#6d90aa", ink: "#16324a", accent: "#ff5a6a" },
    },
  };
  A.ITEMS = {
    rope: ["🪢", "Rope", "Climb out of quicksand (used automatically)"],
    torch: ["🔦", "Torch", "Walk through caves safely (keep it)"],
    compass: ["🧭", "Compass", "+2 steps this turn"],
    snack: ["🍌", "Snack", "+1 step, or get un-stuck"],
    charm: ["🍀", "Lucky Charm", "Pushes the danger back 1"],
  };
  const ITEM_BAG = ["compass", "compass", "compass", "snack", "snack", "snack", "rope", "rope", "torch", "torch", "charm", "charm"];
  A.CHALS = { tap: "Tap Frenzy", memory: "Memory", count: "Quick Count", odd: "Odd One Out", react: "Quick Reflexes", hold: "Steady Hand" };
  A.DIFF = { easy: [16, "🙂 Easy"], normal: [12, "😀 Normal"], hard: [10, "😬 Hard"] };
  // more players = more turns each round, so the danger track is shorter for bigger teams
  A.dangerMax = S => Math.max(6, Math.round(A.DIFF[S.settings.diff][0] * ([0, 2.5, 1.15, .9, .7, .56, .47, .42, .38][S.order.length] || .38)));
  A.SETTINGS = () => [
    ["theme", "Adventure", Object.values(A.THEMES).map(t => [t.key, t.label])],
    ["diff", "Difficulty", Object.entries(A.DIFF).map(([k, v]) => [k, v[1]])],
    ["bots", "🤖 Computer teammates", [["auto", "Auto"], [0, "None"], [1, "1"], [2, "2"], [3, "3"]]],
  ];
  A.th = S => A.THEMES[S.settings.theme] || A.THEMES.island;
  A.hero = (S, p) => A.th(S).heroes[p.hero] || A.th(S).heroes.brave;
  A.tileName = (S, i) => { const t = S.grid[i], d = A.th(S).tiles[t.k], names = d[1].split("|"); return names[(t.v || 0) % names.length]; };
  A.tileIcon = (S, i) => { const t = S.grid[i]; if (t.k === "x" && S.xKnown) return A.th(S).xIcon; return A.th(S).tiles[t.k][0]; };
  const COLORS = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#a66bff", "#ff8a3d", "#1fd1c1", "#ff6fb5"];
  const HEROES = ["brave", "peek", "heal", "fast"];

  function log(S, s) { S.log.push(s); if (S.log.length > 40) S.log.shift(); }
  function fx(S, o) { S.fxN = (S.fxN || 0) + 1; o.n = S.fxN; S.fx.push(o); if (S.fx.length > 14) S.fx.shift(); }
  const nm = (S, id) => (S.players[id] || {}).name || "Someone";

  // ---------- lobby ----------
  A.newState = room => ({ v: 1, room, phase: "lobby", settings: { theme: "island", diff: "normal", bots: "auto" }, players: {}, order: [], host: null, grid: [], log: [], fx: [], fxN: 0 });
  A.setSetting = (S, k, v) => {
    if (!(S.phase === "lobby" || S.phase === "end")) return false;
    if (k === "theme" && A.THEMES[v]) S.settings.theme = v;
    else if (k === "diff" && A.DIFF[v]) S.settings.diff = v;
    else if (k === "bots" && ["auto", 0, 1, 2, 3].includes(v)) S.settings.bots = v;
    else return false;
    return true;
  };
  A.join = (S, id, name, kid) => {
    name = String(name || "Player").trim().slice(0, 14) || "Player";
    const p = S.players[id];
    if (p) { p.name = name; p.kid = !!kid; return "ok"; }
    if (S.phase === "lobby") {
      if (S.order.length >= 8) return "full";
      const used = new Set(S.order.map(x => S.players[x].ci)), ci = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !used.has(i));
      const taken = S.order.map(x => S.players[x].hero), hero = HEROES.find(h => !taken.includes(h)) || HEROES[S.order.length % 4];
      S.players[id] = { id, name, kid: !!kid, ci, color: COLORS[ci], hero, pos: CAMP, items: [], stuck: 0 };
      S.order.push(id); if (!S.host) S.host = id;
      return "ok";
    }
    const old = S.order.find(x => !S.players[x].bot && S.players[x].name.toLowerCase() === name.toLowerCase());
    if (old && old !== id) { A.rebind(S, old, id); return "ok"; }
    return "watch";
  };
  A.rebind = (S, a, b) => { const n = JSON.parse(JSON.stringify(S).split('"' + a + '"').join('"' + b + '"')); Object.keys(S).forEach(k => delete S[k]); Object.assign(S, n); };
  A.leaveLobby = (S, id) => { if (S.phase !== "lobby" || !S.players[id]) return; delete S.players[id]; S.order = S.order.filter(x => x !== id); if (S.host === id) S.host = S.order[0] || null; };
  A.humans = S => S.order.filter(id => !S.players[id].bot);
  A.botCount = S => { const h = A.humans(S).length, b = S.settings.bots; return Math.max(0, Math.min(8 - h, b === "auto" || b == null ? (h === 1 ? 2 : 0) : +b)); };
  const BOT_NAMES = ["Robo Rex", "Captain Bolt", "Sparky", "Professor Cog"];
  function addBots(S) {
    S.order.filter(id => S.players[id].bot).forEach(id => delete S.players[id]); S.order = S.order.filter(id => S.players[id]);
    const n = A.botCount(S), names = shuffle(BOT_NAMES);
    for (let k = 0; k < n; k++) {
      const used = new Set(S.order.map(x => S.players[x].ci)), ci = [0, 1, 2, 3, 4, 5, 6, 7].find(i => !used.has(i));
      const taken = S.order.map(x => S.players[x].hero), hero = HEROES.find(h => !taken.includes(h)) || HEROES[k % 4];
      S.players["bot" + k] = { id: "bot" + k, name: names[k], kid: false, bot: true, ci, color: COLORS[ci], hero, pos: CAMP, items: [], stuck: 0 };
      S.order.push("bot" + k);
    }
  }

  // ---------- new map ----------
  function makeMap(S) {
    const land = [...Array(N * N).keys()].filter(i => !WATER.has(i) && i !== CAMP);
    const grid = Array.from({ length: N * N }, (_, i) => WATER.has(i) ? null : { k: "calm", rev: false, used: false, v: R(6) });
    grid[CAMP] = { k: "camp", rev: true, used: true, v: 0 };
    const free = new Set(land), take = (n, ok) => { const c = shuffle([...free].filter(ok)).slice(0, n); c.forEach(i => free.delete(i)); return c; };
    const far = d => i => dist(i, CAMP) >= d;
    const xi = take(1, far(5))[0]; grid[xi].k = "x";
    const maps = take(4, i => dist(i, CAMP) >= 3 && dist(i, xi) >= 2);
    maps.forEach((i, k) => { grid[i].k = "map"; grid[i].guard = k < 2; });
    take(8, () => true).forEach(i => grid[i].k = "item");
    take(7, () => true).forEach(i => grid[i].k = "chal");
    ["quick", "snake", "cave", "rock"].forEach(k => take(3, far(2)).forEach(i => grid[i].k = k));
    take(2, far(2)).forEach(i => grid[i].k = "look");
    // make sure hazards never wall the camp in
    S.grid = grid; S.xIdx = xi;
  }
  A.start = S => {
    if (!A.humans(S).length) return false;
    addBots(S);
    if (!S.order.length) return false;
    makeMap(S);
    S.order.forEach(id => Object.assign(S.players[id], { pos: CAMP, items: [], stuck: 0, stats: { explored: 0, pieces: 0, chal: 0, items: 0 } }));
    // everyone starts with one handy item
    S.order.forEach((id, k) => S.players[id].items.push(["compass", "snack", "rope", "torch"][k % 4]));
    Object.assign(S, { phase: "play", round: 1, turnI: 0, turnPid: S.order[0], step: "roll", steps: 0, die: 1, rollN: 0, danger: 0, dangerMax: A.dangerMax(S), pieces: 0, xKnown: false, peeked: false, chal: null, event: null, finale: null, log: [], fx: [], result: null, paused: false, lastTick: A.now(), startedAt: A.now() });
    log(S, `${A.th(S).dangerText}! Find the ${A.th(S).piece}s before it's too late.`);
    fx(S, { k: "turn", pid: S.turnPid });
    return true;
  };

  // ---------- turns ----------
  const cur = S => S.players[S.turnPid];
  function nextTurn(S) {
    S.event = null; S.chal = null; S.peeked = false; S.steps = 0;
    let i = S.turnI, wrapped = false;
    i = (i + 1) % S.order.length; if (i === 0) wrapped = true;
    if (wrapped) {
      S.round++; S.danger++;
      fx(S, { k: "danger" });
      log(S, `${A.th(S).dangerIcon} ${A.th(S).dangerText}… (${S.dangerMax - S.danger} left)`);
      if (S.danger >= S.dangerMax) return lose(S);
    }
    S.turnI = i; S.turnPid = S.order[i];
    const p = cur(S);
    S.step = p.stuck ? "stuck" : "roll";
    fx(S, { k: "turn", pid: S.turnPid });
  }
  function lose(S) { S.phase = "end"; S.result = { won: false }; S.step = null; log(S, A.th(S).lose); fx(S, { k: "lose" }); }
  function win(S) { S.phase = "end"; S.result = { won: true, rounds: S.round }; S.step = null; log(S, A.th(S).win); fx(S, { k: "win" }); }
  function dangerUp(S, why) { S.danger++; log(S, `${A.th(S).dangerIcon} ${why} The ${A.th(S).danger} gets closer!`); fx(S, { k: "danger" }); if (S.danger >= S.dangerMax) { lose(S); return true; } return false; }
  function giveItem(S, pid, it) {
    const p = S.players[pid]; it = it || ITEM_BAG[R(ITEM_BAG.length)];
    if (p.items.length >= 5) { log(S, `${p.name}'s backpack is full!`); return null; }
    p.items.push(it); p.stats.items++; fx(S, { k: "item", pid, it });
    return it;
  }
  function roll(S) {
    const p = cur(S), d = R(6) + 1;
    S.die = d; S.rollN++;
    S.steps = [1, 1, 2, 2, 3, 3][d - 1] + (p.hero === "fast" ? 1 : 0);
    S.step = "move"; S.peeked = false;
    log(S, `${p.name} rolled ${d}: ${S.steps} step${S.steps > 1 ? "s" : ""}.`);
    fx(S, { k: "dice", pid: p.id, d });
  }
  function freeStuckAt(S, pid) {
    const p = S.players[pid]; if (p.hero !== "heal") return;
    S.order.forEach(id => { const q = S.players[id]; if (id !== pid && q.pos === p.pos && q.stuck) { q.stuck = 0; log(S, `${p.name} helped ${q.name} get free!`); fx(S, { k: "freed", pid: id }); } });
  }
  function move(S, to) {
    const p = cur(S);
    if (!A.nbrs(p.pos).some(n => n.i === to)) return false;
    p.pos = to; S.steps--;
    const t = S.grid[to], fresh = !t.rev;
    freeStuckAt(S, p.id);
    S.order.forEach(id => { const q = S.players[id]; if (q.hero === "heal" && q.pos === to && p.stuck) p.stuck = 0; });
    if (fresh) { t.rev = true; p.stats.explored++; S.steps = 0; fx(S, { k: "reveal", i: to }); }
    enter(S, to, fresh);
    return true;
  }
  function after(S) { // after a square has been dealt with
    if (S.phase !== "play") return;
    S.event = S.event && S.event.keep ? S.event : S.event;
    const p = cur(S);
    if (p.stuck) { S.steps = 0; S.step = "end"; return; }
    S.step = S.steps > 0 ? "move" : "end";
  }
  function event(S, icon, txt) { S.event = { icon, txt, at: A.now() }; log(S, txt); }
  function enter(S, i, fresh) {
    const p = cur(S), t = S.grid[i], T = A.th(S), name = A.tileName(S, i);
    switch (t.k) {
      case "camp": event(S, T.tiles.camp[0], `${p.name} is back at ${name}.`); return after(S);
      case "calm": if (fresh) event(S, T.tiles.calm[0], `${p.name} explored ${name}. All quiet.`); return after(S);
      case "look":
        if (!t.used) { t.used = true; A.nbrs(i).concat(A.nbrs(i).flatMap(n => A.nbrs(n.i))).forEach(n => { if (!S.grid[n.i].rev) { S.grid[n.i].rev = true; fx(S, { k: "reveal", i: n.i }); } }); event(S, T.tiles.look[0], `${p.name} climbed the ${name} and can see the squares all around!`); }
        return after(S);
      case "item":
        if (!t.used) { t.used = true; const it = giveItem(S, p.id); event(S, T.tiles.item[0], it ? `${p.name} searched the ${name} and found a ${A.ITEMS[it][1]} ${A.ITEMS[it][0]}!` : `${p.name} found something, but their backpack is full.`); }
        return after(S);
      case "map":
        if (t.used) return after(S);
        if (t.guard) return startChal(S, ["odd", "count"][R(2)], "map", `A ${T.piece} is here, but it's hard to grab!`);
        return gotPiece(S, i);
      case "chal":
        if (t.used) return after(S);
        return startChal(S, ["tap", "memory", "count", "odd", "react", "hold"][R(6)], "chal", `${name}! Win it to find an item.`);
      case "quick":
        if (p.hero === "heal") { event(S, T.tiles.quick[0], `${p.name} steps carefully around the ${name}.`); return after(S); }
        if (p.items.includes("rope")) { p.items.splice(p.items.indexOf("rope"), 1); event(S, "🪢", `${p.name} fell in the ${name} but climbed out with a rope!`); return after(S); }
        p.stuck = 1; S.steps = 0; event(S, T.tiles.quick[0], `Oh no! ${p.name} is stuck in the ${name}! They'll miss a turn unless someone helps.`); fx(S, { k: "stuck", pid: p.id }); return after(S);
      case "snake":
        return startChal(S, "react", "snake", `${name}! Be quick or lose an item!`);
      case "cave":
        if (t.used) return after(S);
        if (p.items.includes("torch")) { t.used = true; const it = giveItem(S, p.id); event(S, "🔦", `${p.name}'s torch lights up the ${name}${it ? `. Found a ${A.ITEMS[it][1]} ${A.ITEMS[it][0]}!` : "."}`); return after(S); }
        return startChal(S, "memory", "cave", `The ${name} is pitch dark! Remember the way out.`);
      case "rock":
        if (t.used) return after(S);
        return startChal(S, "tap", "rock", `${name}! Clear the rocks fast or the ${T.danger} gets closer!`);
      case "x":
        if (S.xKnown) { event(S, T.xIcon, `${p.name} reached the ${T.x}! Press DIG to start the Team Finale!`); return after(S); }
        event(S, T.tiles.x[0], `${p.name} found ${name}… something is here, but you need all 4 ${T.piece}s first.`); return after(S);
    }
    after(S);
  }
  function gotPiece(S, i) {
    const p = cur(S), T = A.th(S); S.grid[i].used = true; S.pieces++; p.stats.pieces++;
    event(S, T.pieceIcon, `${p.name} found a ${T.piece}! (${S.pieces} of 4)`); fx(S, { k: "piece", pid: p.id });
    if (S.pieces >= 4 && !S.xKnown) { S.xKnown = true; S.grid[S.xIdx].rev = true; log(S, T.pieceAll); fx(S, { k: "xknown", i: S.xIdx }); S.event.txt += " " + T.pieceAll; }
    after(S);
  }

  // ---------- phone challenges ----------
  function startChal(S, type, why, txt) {
    const p = cur(S);
    S.chal = { pid: p.id, type, why, txt, kid: !!p.kid, retry: p.hero === "brave", endsAt: A.now() + 45000, seed: R(1e9), tries: 0 };
    S.step = "chal"; S.event = { icon: "🎯", txt: `${p.name}: ${txt}`, at: A.now() };
    fx(S, { k: "chal", pid: p.id, type });
  }
  function chalResult(S, ok) {
    const c = S.chal; if (!c) return;
    const p = S.players[c.pid], T = A.th(S), t = S.grid[p.pos];
    if (!ok && c.retry && c.tries === 0) { c.tries = 1; c.seed = R(1e9); c.endsAt = A.now() + 45000; c.second = true; log(S, `${p.name} is brave and tries again!`); fx(S, { k: "retry", pid: p.id }); return; }
    S.chal = null;
    if (ok) { p.stats.chal++; fx(S, { k: "chalok", pid: p.id }); }
    else fx(S, { k: "chalfail", pid: p.id });
    switch (c.why) {
      case "map": if (ok) return gotPiece(S, p.pos); event(S, T.pieceIcon, `${p.name} couldn't grab the ${T.piece}. Try again another turn!`); break;
      case "chal": if (ok) { t.used = true; const it = giveItem(S, p.id); event(S, "🎉", `${p.name} did it${it ? ` and wins a ${A.ITEMS[it][1]} ${A.ITEMS[it][0]}!` : "!"}`); } else event(S, "😅", `${p.name} didn't quite manage it. Come back and try again!`); break;
      case "snake": if (ok) event(S, "😎", `${p.name} dodged it!`); else if (p.items.length) { const k = R(p.items.length), it = p.items.splice(k, 1)[0]; event(S, T.tiles.snake[0], `${p.name} dropped their ${A.ITEMS[it][1]} while running away!`); } else event(S, T.tiles.snake[0], `${p.name} ran away just in time!`); break;
      case "cave": if (ok) { t.used = true; const it = giveItem(S, p.id); event(S, "🎉", `${p.name} found the way${it ? ` and a ${A.ITEMS[it][1]} ${A.ITEMS[it][0]}!` : "!"}`); } else { event(S, "😵", `${p.name} got lost in the dark and ended up back at camp!`); p.pos = A.CAMP; } break;
      case "rock": t.used = true; if (ok) event(S, "💪", `${p.name} cleared the way!`); else { S.event = null; if (dangerUp(S, "The rocks slowed everyone down.")) return; } break;
    }
    after(S);
  }

  // ---------- the finale ----------
  A.finaleTarget = S => S.order.reduce((a, id) => { const p = S.players[id]; return a + (p.bot ? 32 : p.kid ? 22 : 38); }, 0);
  function startFinale(S) {
    S.finale = { startAt: A.now() + 3500, endsAt: A.now() + 13500, taps: {}, target: A.finaleTarget(S) };
    S.step = "finale"; S.event = { icon: A.th(S).finaleIcon, txt: A.th(S).finale, at: A.now() };
    fx(S, { k: "finale" });
  }
  function finishFinale(S) {
    const f = S.finale, total = Object.values(f.taps).reduce((a, b) => a + b, 0);
    S.lastFinale = { total, target: f.target };
    S.finale = null;
    if (total >= f.target) return win(S);
    log(S, `Only ${total} of ${f.target}! So close. Try again next turn.`);
    if (dangerUp(S, "Not enough!")) return;
    S.step = "end";
  }

  // ---------- actions ----------
  A.act = (S, pid, m) => {
    const t = m.t, p = S.players[pid];
    if (S.phase === "lobby" || S.phase === "end") {
      if (t === "hero" && p && S.phase === "lobby" && A.th(S).heroes[m.h]) { p.hero = m.h; return true; }
      if (pid !== S.host && !m.tv) return false;
      if (t === "set") return A.setSetting(S, m.k, m.v);
      if (t === "start" && S.phase === "lobby") return A.start(S);
      if (t === "again" && S.phase === "end") return A.start(S);
      if (t === "lobby" && S.phase === "end") { S.phase = "lobby"; S.order.filter(id => S.players[id].bot).forEach(id => delete S.players[id]); S.order = S.order.filter(id => S.players[id]); return true; }
      return false;
    }
    if (S.phase !== "play") return false;
    if (t === "pause" && (pid === S.host || m.tv)) { S.paused = !S.paused; return true; }
    if (t === "endnow" && (pid === S.host || m.tv)) { lose(S); S.result.gaveUp = true; return true; }
    if (t === "nudge" && (pid === S.host || m.tv)) return A.nudge(S);
    if (!p || S.paused) return false;
    if (t === "tap" && S.step === "finale" && S.finale) { S.finale.taps[pid] = Math.max(S.finale.taps[pid] || 0, Math.min(200, +m.n || 0)); return true; }
    if (t === "give") {
      const to = S.players[m.to], k = p.items.indexOf(m.it);
      if (!to || to === p || k < 0 || to.items.length >= 5 || S.step === "chal" || S.step === "finale") return false;
      p.items.splice(k, 1); to.items.push(m.it); log(S, `${p.name} gave ${to.name} a ${A.ITEMS[m.it][1]} ${A.ITEMS[m.it][0]}.`); fx(S, { k: "give", pid, to: to.id, it: m.it }); return true;
    }
    if (t === "use" && m.it === "charm") {
      const k = p.items.indexOf("charm"); if (k < 0 || S.danger <= 0 || S.step === "finale") return false;
      p.items.splice(k, 1); S.danger--; log(S, `🍀 ${p.name} used a Lucky Charm! The ${A.th(S).danger} backs off.`); fx(S, { k: "charm", pid }); return true;
    }
    if (pid !== S.turnPid) { if (t === "chal" && S.chal && S.chal.pid === pid) { chalResult(S, !!m.ok); return true; } return false; }
    switch (t) {
      case "roll": if (S.step === "roll") { roll(S); return true; } return false;
      case "move": if (S.step === "move" && S.steps > 0) return move(S, +m.i); return false;
      case "peek": {
        if (p.hero !== "peek" || S.peeked || !(S.step === "move" || S.step === "roll" || S.step === "end")) return false;
        const n = A.nbrs(p.pos).find(n => n.i === +m.i && !S.grid[n.i].rev); if (!n) return false;
        S.grid[n.i].rev = true; S.peeked = true; log(S, `${p.name} peeked at a hidden square: ${A.tileName(S, n.i)}.`); fx(S, { k: "reveal", i: n.i }); return true;
      }
      case "use": {
        const k = p.items.indexOf(m.it); if (k < 0) return false;
        if (m.it === "compass" && (S.step === "move" || S.step === "end")) { p.items.splice(k, 1); S.steps += 2; S.step = "move"; log(S, `🧭 ${p.name} used a compass: +2 steps!`); return true; }
        if (m.it === "snack" && S.step === "stuck") { p.items.splice(k, 1); p.stuck = 0; S.step = "roll"; log(S, `🍌 ${p.name} ate a snack and wriggled free!`); return true; }
        if (m.it === "snack" && (S.step === "move" || S.step === "end")) { p.items.splice(k, 1); S.steps += 1; S.step = "move"; log(S, `🍌 ${p.name} ate a snack: +1 step!`); return true; }
        if (m.it === "rope" && S.step === "stuck") { p.items.splice(k, 1); p.stuck = 0; S.step = "roll"; log(S, `🪢 ${p.name} climbed out with a rope!`); return true; }
        return false;
      }
      case "wait": if (S.step === "stuck") { p.stuck = 0; log(S, `${p.name} waits to get free.`); nextTurn(S); return true; } return false;
      case "dig": if ((S.step === "move" || S.step === "end") && S.xKnown && p.pos === S.xIdx) { startFinale(S); return true; } return false;
      case "endturn": if (S.step === "move" || S.step === "end") { nextTurn(S); return true; } return false;
      case "chal": if (S.chal && S.chal.pid === pid) { chalResult(S, !!m.ok); return true; } return false;
    }
    return false;
  };
  A.nudge = S => {
    if (S.step === "roll") { roll(S); return true; }
    if (S.step === "chal") { chalResult(S, false); if (S.chal) chalResult(S, false); return true; }
    if (S.step === "move" || S.step === "end" || S.step === "stuck") { const p = cur(S); if (S.step === "stuck") p.stuck = 0; nextTurn(S); return true; }
    if (S.step === "finale") { finishFinale(S); return true; }
    return false;
  };
  A.tick = S => {
    if (S.phase !== "play") return false;
    const n = A.now(), dt = Math.max(0, Math.min(2000, n - (S.lastTick || n))); S.lastTick = n;
    if (S.paused) { if (S.chal) S.chal.endsAt += dt; if (S.finale) { S.finale.startAt += dt; S.finale.endsAt += dt; } return false; }
    if (S.step === "chal" && S.chal && n > S.chal.endsAt) { chalResult(S, false); return true; }
    if (S.step === "finale" && S.finale) {
      // computer teammates tap along
      if (n > S.finale.startAt) S.order.forEach(id => { if (S.players[id].bot) S.finale.taps[id] = Math.min(32 + R(8), Math.floor((n - S.finale.startAt) / 10000 * (32 + R(10)))); });
      if (n > S.finale.endsAt + 1500) { finishFinale(S); return true; }
    }
    return false;
  };

  // ---------- computer teammates ----------
  function path(S, from, goal, avoid) { // BFS over land, returns first step
    const prev = new Map([[from, -1]]), q = [from];
    while (q.length) { const c = q.shift(); if (goal(c) && c !== from) { let s = c; while (prev.get(s) !== from) s = prev.get(s); return s; } for (const n of A.nbrs(c)) if (!prev.has(n.i) && !(avoid(n.i) && !goal(n.i))) { prev.set(n.i, c); q.push(n.i); } }
    return null;
  }
  A.botStep = S => {
    if (S.phase !== "play" || S.paused) return false;
    const n = A.now(); if (S.botWait && n < S.botWait) return false;
    const p = cur(S); if (!p || !p.bot) return false;
    const wait = ms => { S.botWait = n + ms; return true; };
    const hazard = i => S.grid[i].rev && ["quick", "snake"].includes(S.grid[i].k);
    if (S.danger >= S.dangerMax - 2 && p.items.includes("charm")) { A.act(S, p.id, { t: "use", it: "charm" }); return wait(700); }
    switch (S.step) {
      case "stuck": if (p.items.includes("snack")) A.act(S, p.id, { t: "use", it: "snack" }); else if (p.items.includes("rope")) A.act(S, p.id, { t: "use", it: "rope" }); else A.act(S, p.id, { t: "wait" }); return wait(1100);
      case "roll":
        if (p.hero === "peek" && !S.peeked) { const h = A.nbrs(p.pos).find(x => !S.grid[x.i].rev); if (h) { A.act(S, p.id, { t: "peek", i: h.i }); return wait(900); } }
        A.act(S, p.id, { t: "roll" }); return wait(1400);
      case "chal": if (!S.chal.botAt) { S.chal.botAt = n + 2500; return false; } if (n < S.chal.botAt) return false; S.chal.botAt = 0; A.act(S, p.id, { t: "chal", ok: A.rng() < .7 }); return wait(1200);
      case "move": case "end": {
        if (S.xKnown && p.pos === S.xIdx) { A.act(S, p.id, { t: "dig" }); return wait(1000); }
        if (S.step === "end" || S.steps <= 0) {
          if (S.xKnown && p.items.includes("compass") && dist(p.pos, S.xIdx) > 1) { A.act(S, p.id, { t: "use", it: "compass" }); return wait(700); }
          A.act(S, p.id, { t: "endturn" }); return wait(1000);
        }
        let goal;
        if (S.xKnown) goal = i => i === S.xIdx;
        else { const unused = i => S.grid[i] && ((S.grid[i].k === "map" && !S.grid[i].used) || (["item", "chal", "cave"].includes(S.grid[i].k) && !S.grid[i].used && S.grid[i].rev)); goal = i => !S.grid[i].rev || (unused(i) && S.grid[i].k === "map"); }
        // other teammates are heading for the nearest spots too, so spread out a little by preferring unexplored areas
        const step = path(S, p.pos, goal, hazard) ?? path(S, p.pos, goal, () => false);
        if (step == null) { A.act(S, p.id, { t: "endturn" }); return wait(800); }
        A.act(S, p.id, { t: "move", i: step }); return wait(650);
      }
    }
    return false;
  };

  A.pub = S => { const o = JSON.parse(JSON.stringify(S)); if (o.grid) o.grid = o.grid.map((t, i) => t && (t.rev ? t : { rev: false })); delete o.xIdx; if (S.xKnown) o.xIdx = S.xIdx; o.log = o.log.slice(-10); return o; };
  root.Adv = A;
})(typeof window !== "undefined" ? window : globalThis);
