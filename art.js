// =====================================================================
// Roll On · Storybook art pack.
// Hand-drawn SVG art (free, no image files) and the 🎨 look switch.
// The look switch is saved per device. Classic = the original emoji look.
// Add art for another theme by adding a block under ICONS / SCENES.
// =====================================================================
(function (root) {
  const KEY = "rollon_fx";
  let on = true;
  try { const v = localStorage.getItem(KEY); if (v != null) on = JSON.parse(v); } catch (e) { }
  const apply = () => document.documentElement.classList.toggle("fx", on);
  apply();

  const O = `stroke="#2b1d0e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const svg = (body, vb, par) => `<svg class="art" viewBox="${vb || "0 0 100 100"}"${par ? ` preserveAspectRatio="${par}"` : ""} aria-hidden="true">${body}</svg>`;

  // shared gradients (defined once in the page)
  const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <radialGradient id="rgCrystal" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#f3e8ff"/><stop offset=".35" stop-color="#b38cf0"/><stop offset=".8" stop-color="#5a2fa8"/><stop offset="1" stop-color="#2c1260"/></radialGradient>
    <linearGradient id="lgGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7dc84"/><stop offset=".55" stop-color="#d4a23a"/><stop offset="1" stop-color="#9a6a18"/></linearGradient>
    <linearGradient id="lgStone" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d6cfbf"/><stop offset=".6" stop-color="#c2b9a6"/><stop offset="1" stop-color="#a39a87"/></linearGradient>
    <linearGradient id="lgRoof" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d0583b"/><stop offset=".55" stop-color="#b8452e"/><stop offset="1" stop-color="#8e3220"/></linearGradient>
    <linearGradient id="lgWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d79c58"/><stop offset="1" stop-color="#a86b30"/></linearGradient>
    <linearGradient id="lgParch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf0d2"/><stop offset="1" stop-color="#ead39b"/></linearGradient>
  </defs></svg>`;
  const addDefs = () => { if (!document.getElementById("rgCrystal")) document.body.insertAdjacentHTML("afterbegin", DEFS); };
  if (document.body) addDefs(); else document.addEventListener("DOMContentLoaded", addDefs);

  // ---------------- Fantasy Kingdom ----------------
  const tower = (x, flag) => `<rect x="${x}" y="40" width="22" height="50" fill="url(#lgStone)" ${O}/>
    <path d="M${x - 4} 42 L${x + 11} 12 L${x + 26} 42 Z" fill="url(#lgRoof)" ${O}/>
    <path d="M${x + 7} 64 v-6 a4 4 0 0 1 8 0 v6 Z" fill="#2a1f17" ${O} stroke-width="2"/>
    <path d="M${x + 11} 12 V2" ${O}/><path d="M${x + 11} 2 L${x + 23} 5.5 L${x + 11} 9 Z" fill="${flag}" ${O} stroke-width="2"/>`;
  const K = {
    start: svg(`<ellipse cx="50" cy="92" rx="44" ry="5" fill="#000" opacity=".15"/>
      <rect x="32" y="50" width="36" height="40" fill="url(#lgStone)" ${O}/>
      <path d="M32 50 v-7 h7 v7 M46 50 v-7 h8 v7 M61 50 v-7 h7 v7" fill="#c9c1b0" ${O}/>
      <path d="M41 90 V72 a9 9 0 0 1 18 0 V90 Z" fill="#2a1f17" ${O}/>
      <path d="M45 66 V90 M50 63 V90 M55 66 V90 M41.5 75 H58.5 M41.5 82 H58.5" stroke="#d9b45a" stroke-width="1.8"/>
      ${tower(12, "#e0b23e")}${tower(66, "#e0b23e")}`),
    jail: svg(`<rect x="10" y="12" width="80" height="78" rx="6" fill="#8f897d" ${O}/>
      <path d="M10 31 H90 M10 50 H90 M10 69 H90 M30 12 V31 M62 12 V31 M20 31 V50 M78 31 V50 M30 50 V69 M66 50 V69 M22 69 V90 M58 69 V90" stroke="#5f594f" stroke-width="2"/>
      <path d="M30 76 V44 a20 20 0 0 1 40 0 V76 Z" fill="#1d1612" ${O}/>
      <path d="M40 30 V76 M50 26 V76 M60 30 V76" stroke="#aab0b8" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 30 V76 M50 26 V76 M60 30 V76" stroke="#e6e9ee" stroke-width="1.2" stroke-linecap="round" transform="translate(-1 0)"/>
      <path d="M31 52 H69" stroke="#aab0b8" stroke-width="4"/>
      <path d="M12 90 q6 -8 12 0 q5 -7 10 0 M70 90 q6 -9 12 0 q4 -6 6 0" fill="#5e8f45" stroke="#2f5a2a" stroke-width="2"/>`),
    free: svg(`<ellipse cx="50" cy="91" rx="42" ry="5" fill="#000" opacity=".15"/>
      ${Array.from({ length: 8 }, (_, i) => `<path d="M50 30 L${16 + 8.5 * i} 88 L${16 + 8.5 * (i + 1)} 88 Z" fill="${i % 2 ? "#f4e6c8" : "#c0392b"}"/>`).join("")}
      <path d="M50 30 L16 88 H84 Z" fill="none" ${O}/>
      <path d="M50 64 L42 88 H58 Z" fill="#3a2a1a" ${O} stroke-width="2"/>
      <path d="M50 30 V12" ${O}/><path d="M50 12 L65 16 L50 20 Z" fill="#e0b23e" ${O} stroke-width="2"/>
      <path d="M6 30 Q28 42 50 32 Q72 42 94 30" fill="none" stroke="#7a4a25" stroke-width="1.6"/>
      ${[[12, 33, "#2f80c1"], [22, 36.5, "#e0b23e"], [32, 37.5, "#3e9b4f"], [68, 37.5, "#3e9b4f"], [78, 36.5, "#e0b23e"], [88, 33, "#2f80c1"]].map(([x, y, c]) => `<path d="M${x - 3} ${y} L${x + 3} ${y} L${x} ${y + 7} Z" fill="${c}" stroke="#2b1d0e" stroke-width="1.2"/>`).join("")}`),
    gojail: svg(`<g transform="rotate(-32 50 50)">
      <circle cx="28" cy="50" r="17" fill="url(#lgGold)" ${O}/><circle cx="28" cy="50" r="8" fill="#f1e4c0" ${O} stroke-width="2.5"/>
      <rect x="44" y="46" width="44" height="8" rx="3" fill="url(#lgGold)" ${O}/>
      <path d="M72 54 v12 h6 v-12 M82 54 v9 h5 v-9" fill="#d4a23a" ${O} stroke-width="2.5"/>
      <circle cx="47" cy="50" r="5" fill="url(#lgGold)" ${O} stroke-width="2.5"/></g>
      <path d="M78 16 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3 Z" fill="#fff6c8" stroke="#c9962e" stroke-width="1.2"/>`),
    chance: svg(`<path d="M30 88 L36 72 H64 L70 88 Z" fill="url(#lgGold)" ${O}/>
      <ellipse cx="50" cy="88" rx="24" ry="4" fill="#9a6a18" ${O} stroke-width="2"/>
      <circle cx="50" cy="45" r="28" fill="url(#rgCrystal)" ${O}/>
      <path d="M34 54 q10 -16 26 -10 q10 4 8 14" fill="none" stroke="#efe0ff" stroke-width="2.4" opacity=".55" stroke-linecap="round"/>
      <ellipse cx="40" cy="33" rx="8" ry="4.5" fill="#fff" opacity=".85" transform="rotate(-30 40 33)"/>
      <path d="M82 14 l2.5 5 5 2.5 -5 2.5 -2.5 5 -2.5 -5 -5 -2.5 5 -2.5 Z M16 20 l2 4 4 2 -4 2 -2 4 -2 -4 -4 -2 4 -2 Z" fill="#fff6c8" stroke="#c9962e" stroke-width="1.2"/>`),
    quest: svg(`<rect x="22" y="20" width="56" height="58" fill="url(#lgParch)" ${O}/>
      <rect x="15" y="12" width="70" height="13" rx="6.5" fill="#e3c987" ${O}/>
      <rect x="15" y="72" width="70" height="13" rx="6.5" fill="#e3c987" ${O}/>
      <path d="M32 36 H68 M32 44 H68 M32 52 H56" stroke="#a08a5a" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M58 70 l-4 16 6 -4 4 6 3 -16 Z M70 70 l4 16 -6 -4 -4 6 -3 -16 Z" fill="#8e1d17" stroke="#2b1d0e" stroke-width="1.6" stroke-linejoin="round"/>
      <circle cx="64" cy="64" r="10" fill="#b3261e" ${O} stroke-width="2.5"/><circle cx="64" cy="64" r="5" fill="none" stroke="#e35a4d" stroke-width="1.6"/>`),
    station: svg(`<rect x="45" y="18" width="10" height="72" fill="url(#lgWood)" ${O}/>
      <path d="M28 22 H74 L84 31 L74 40 H28 Z" fill="url(#lgWood)" ${O}/>
      <path d="M72 46 H26 L16 55 L26 64 H72 Z" fill="url(#lgWood)" ${O}/>
      <path d="M34 31 H66 M28 55 H62" stroke="#7a4a25" stroke-width="2" stroke-dasharray="5 3"/>
      <path d="M34 92 q6 -10 12 0 q4 -8 8 0 q6 -10 12 0" fill="#5e8f45" stroke="#2f5a2a" stroke-width="2"/>`),
    house: svg(`<rect x="22" y="48" width="56" height="42" fill="#f4e6c8" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <path d="M10 54 L50 14 L90 54 Z" fill="#b8452e" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <rect x="42" y="64" width="16" height="26" fill="#6b3f1d" stroke="#2b1d0e" stroke-width="5"/>`),
    hotel: svg(`<rect x="20" y="38" width="60" height="54" fill="#cfc7b6" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <path d="M20 38 v-12 h14 v12 M43 38 v-12 h14 v12 M66 38 v-12 h14 v12" fill="#cfc7b6" stroke="#2b1d0e" stroke-width="5" stroke-linejoin="round"/>
      <path d="M40 92 V72 a10 10 0 0 1 20 0 V92 Z" fill="#2a1f17"/>
      <path d="M50 26 V4" stroke="#2b1d0e" stroke-width="5"/><path d="M50 4 L72 10 L50 16 Z" fill="#e0b23e" stroke="#2b1d0e" stroke-width="4" stroke-linejoin="round"/>`),
  };

  const kingdomScene = svg(`
    <g opacity=".85"><ellipse cx="62" cy="30" rx="26" ry="8" fill="#fff"/><ellipse cx="80" cy="25" rx="18" ry="8" fill="#fff"/>
      <ellipse cx="330" cy="36" rx="28" ry="8" fill="#fff"/><ellipse cx="312" cy="31" rx="16" ry="7" fill="#fff"/></g>
    <path d="M0 108 Q60 80 130 98 Q210 112 300 76 Q350 62 400 84 V160 H0 Z" fill="#b6cba8"/>
    <g fill="#9eaebd" transform="translate(318 78) scale(.78) translate(-200 -84)">
      <rect x="176" y="50" width="12" height="34"/><rect x="212" y="50" width="12" height="34"/><rect x="186" y="40" width="28" height="44"/>
      <path d="M174 51 L182 33 L190 51 Z M210 51 L218 33 L226 51 Z M184 41 L200 16 L216 41 Z" fill="#8c7f9a"/>
      <path d="M200 16 V8 M182 33 V27 M218 33 V27" stroke="#8c7f9a" stroke-width="1.5"/>
      <path d="M200 8 l8 2.5 -8 2.5 Z M182 27 l6 2 -6 2 Z M218 27 l6 2 -6 2 Z" fill="#d9b45a"/>
      <path d="M195 84 v-8 a5 5 0 0 1 10 0 v8 Z M180 64 h4 v6 h-4 Z M216 64 h4 v6 h-4 Z M198 52 h4 v6 h-4 Z" fill="#6f7a88"/>
    </g>
    <path d="M0 124 Q80 96 170 116 T330 110 T400 118 V160 H0 Z" fill="#93c275"/>
    <path d="M150 160 C180 140 250 132 280 116 C300 104 306 92 316 80 L320 80 C314 94 312 106 296 118 C270 136 210 146 196 160 Z" fill="#e8d7a6"/>
    ${[[34, 112, 11], [52, 117, 8], [72, 119, 7], [200, 121, 9], [216, 124, 6], [372, 104, 9], [386, 109, 6]].map(([x, y, r]) => `<rect x="${x - 1.5}" y="${y}" width="3" height="${r * .9}" fill="#6b4a2a"/><circle cx="${x}" cy="${y - r * .3}" r="${r}" fill="#5f9a4b" stroke="#3b6b33" stroke-width="1.5"/><circle cx="${x - r * .3}" cy="${y - r * .65}" r="${r * .35}" fill="#78b562"/>`).join("")}
    <path d="M0 140 Q100 122 190 146 Q210 150 230 146 Q320 124 400 138 V160 H0 Z" fill="#6fa85a"/>
    ${[[30, 148, "#f4d35e"], [60, 144, "#fff"], [120, 150, "#e86a6a"], [280, 147, "#f4d35e"], [340, 143, "#fff"], [372, 150, "#e86a6a"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${c}"/>`).join("")}
  `, "0 0 400 160", "xMidYMax slice");

  const ICONS = { kingdom: K };
  const SCENES = { kingdom: kingdomScene };
  const CARD = { kingdom: { "🔮": K.chance, "📜": K.quest } };

  root.ART = {
    get on() { return on; },
    toggle() { on = !on; try { localStorage.setItem(KEY, JSON.stringify(on)); } catch (e) { } apply(); return on; },
    icon(theme, slot) { return on && ICONS[theme] && ICONS[theme][slot] || null; },
    scene(theme) { return on && SCENES[theme] ? `<div class="scene">${SCENES[theme]}</div>` : ""; },
    card(theme, emoji) { return on && CARD[theme] && CARD[theme][emoji] || null; },
  };
})(window);
