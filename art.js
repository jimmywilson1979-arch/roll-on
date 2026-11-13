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
    <linearGradient id="lgSpiral" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7df9ff"/><stop offset="1" stop-color="#b16cff"/></linearGradient>
    <linearGradient id="lgDisk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ff7a3d"/><stop offset=".5" stop-color="#ffd86b"/><stop offset="1" stop-color="#c64bff"/></linearGradient>
    <linearGradient id="lgFlame" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3a0"/><stop offset=".5" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff5a1f"/></linearGradient>
    <linearGradient id="lgSilver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#dfe4ee"/><stop offset="1" stop-color="#aab3c5"/></linearGradient>
    <linearGradient id="lgPortal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a3cff"/><stop offset="1" stop-color="#1a0b52"/></linearGradient>
    <linearGradient id="lgGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9fbff"/><stop offset="1" stop-color="#55c9e8"/></linearGradient>
    <linearGradient id="lgRed" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8483f"/><stop offset=".6" stop-color="#c4162a"/><stop offset="1" stop-color="#8f0f1f"/></linearGradient>
    <radialGradient id="rgSea" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
    <linearGradient id="lgPine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f9a55"/><stop offset="1" stop-color="#1f6b38"/></linearGradient>
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

  const spark = (x, y, s, c) => `<path d="M${x} ${y - s} l${s * .3} ${s * .7} ${s * .7} ${s * .3} -${s * .7} ${s * .3} -${s * .3} ${s * .7} -${s * .3} -${s * .7} -${s * .7} -${s * .3} ${s * .7} -${s * .3} Z" fill="${c || "#fff6c8"}" stroke="#c9962e" stroke-width="1.1"/>`;
  const star5 = (cx, cy, R, r) => Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R; return (i ? "L" : "M") + (cx + d * Math.cos(a)).toFixed(1) + " " + (cy + d * Math.sin(a)).toFixed(1); }).join(" ") + " Z";

  // ---------------- City Streets ----------------
  const C = {
    start: svg(`<ellipse cx="50" cy="92" rx="30" ry="4" fill="#000" opacity=".15"/>
      <path d="M26 90 V10" stroke="#2b1d0e" stroke-width="6" stroke-linecap="round"/><path d="M26 90 V10" stroke="#c9ced6" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M29 14 Q50 6 66 14 T90 14 V50 Q74 42 58 50 T29 50 Z" fill="#fff" ${O}/>
      <clipPath id="cfl"><path d="M29 14 Q50 6 66 14 T90 14 V50 Q74 42 58 50 T29 50 Z"/></clipPath>
      <g clip-path="url(#cfl)" fill="#222">${[0, 1, 2, 3, 4, 5].map(c => [0, 1, 2, 3].map(r => (c + r) % 2 ? "" : `<rect x="${29 + c * 10.2}" y="${6 + r * 11}" width="10.2" height="11"/>`).join("")).join("")}</g>
      <path d="M29 14 Q50 6 66 14 T90 14 V50 Q74 42 58 50 T29 50 Z" fill="none" ${O}/>`),
    jail: svg(`<rect x="14" y="34" width="72" height="56" fill="#9aa3ad" ${O}/>
      <path d="M14 48 H86 M14 62 H86 M14 76 H86" stroke="#7c858f" stroke-width="1.6"/>
      <rect x="26" y="16" width="48" height="16" rx="3" fill="#2f5fa8" ${O}/>
      <text x="50" y="29" text-anchor="middle" font-family="Fredoka,Arial,sans-serif" font-weight="700" font-size="13" fill="#fff">JAIL</text>
      <rect x="32" y="44" width="36" height="30" fill="#1b2027" ${O}/>
      <path d="M41 44 V74 M50 44 V74 M59 44 V74" stroke="#d6dbe2" stroke-width="3.5"/>
      <circle cx="50" cy="10" r="5" fill="#4aa3ff" stroke="#2b1d0e" stroke-width="2.5"/><path d="M42 6 l-5 -3 M58 6 l5 -3" stroke="#4aa3ff" stroke-width="2.5" stroke-linecap="round"/>`),
    free: svg(`<ellipse cx="50" cy="91" rx="42" ry="5" fill="#000" opacity=".15"/>
      <rect x="64" y="40" width="8" height="48" fill="#7a4a25" ${O} stroke-width="2.5"/>
      <circle cx="68" cy="30" r="24" fill="#5fae4f" ${O}/><circle cx="60" cy="22" r="9" fill="#7fc76a"/>
      <path d="M14 70 H70 M14 62 H70" stroke="#2b1d0e" stroke-width="9" stroke-linecap="round"/><path d="M14 70 H70 M14 62 H70" stroke="#c98a4a" stroke-width="5" stroke-linecap="round"/>
      <path d="M12 78 H72" stroke="#2b1d0e" stroke-width="10" stroke-linecap="round"/><path d="M12 78 H72" stroke="#d99a55" stroke-width="6" stroke-linecap="round"/>
      <path d="M20 80 V90 M64 80 V90" stroke="#2b1d0e" stroke-width="5" stroke-linecap="round"/>`),
    gojail: svg(`<ellipse cx="50" cy="88" rx="36" ry="6" fill="#1d2a4a" ${O}/>
      <path d="M22 84 Q20 40 50 18 Q80 40 78 84 Z" fill="#23325a" ${O}/>
      <path d="M40 30 Q50 22 60 30" fill="none" stroke="#3b4f86" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="14" r="6" fill="#c9ced6" ${O} stroke-width="2.5"/>
      <path d="${star5(50, 56, 14, 6)}" fill="url(#lgSilver)" ${O} stroke-width="2.5"/>
      <path d="M22 78 Q50 70 78 78" fill="none" stroke="#c9ced6" stroke-width="2.5"/>`),
    chance: svg(`<path d="M50 54 Q54 74 64 90" fill="none" stroke="#2b1d0e" stroke-width="7" stroke-linecap="round"/><path d="M50 54 Q54 74 64 90" fill="none" stroke="#3e9b4f" stroke-width="3.5" stroke-linecap="round"/>
      ${[[36, 38], [64, 38], [36, 66], [64, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="#3fae5a" ${O}/>`).join("")}
      ${[[36, 38], [64, 38], [36, 66], [64, 66]].map(([x, y]) => `<path d="M50 52 L${x} ${y}" stroke="#2b7a3e" stroke-width="2"/><circle cx="${x - 5}" cy="${y - 5}" r="4" fill="#9be08a" opacity=".8"/>`).join("")}
      <circle cx="50" cy="52" r="4" fill="#2b7a3e"/>`),
    quest: svg(`<path d="${star5(50, 52, 42, 18)}" fill="url(#lgGold)" ${O}/>
      <path d="${star5(50, 52, 26, 11)}" fill="#ffe58a" opacity=".55"/>${spark(84, 16, 8)}${spark(16, 84, 6)}`),
    station: svg(`<path d="M20 92 L32 80 M80 92 L68 80 M14 86 H86" stroke="#6b7280" stroke-width="4" stroke-linecap="round"/>
      <rect x="22" y="14" width="56" height="64" rx="14" fill="#c4162a" ${O}/>
      <rect x="30" y="22" width="40" height="22" rx="5" fill="#bfe8ff" ${O} stroke-width="2.5"/>
      <path d="M22 52 H78" stroke="#f4d35e" stroke-width="5"/>
      <circle cx="34" cy="66" r="5" fill="#fff6b0" ${O} stroke-width="2.5"/><circle cx="66" cy="66" r="5" fill="#fff6b0" ${O} stroke-width="2.5"/>
      <rect x="44" y="62" width="12" height="8" rx="2" fill="#2b1d0e"/>`),
    house: svg(`<rect x="22" y="48" width="56" height="42" fill="#c9673f" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <path d="M12 54 L50 16 L88 54 Z" fill="#4a5160" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <rect x="42" y="62" width="16" height="28" fill="#f4f4f4" stroke="#2b1d0e" stroke-width="5"/>`),
    hotel: svg(`<rect x="22" y="14" width="56" height="78" fill="#e0574a" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      ${[0, 1, 2].map(r => [0, 1].map(c => `<rect x="${32 + c * 22}" y="${24 + r * 18}" width="14" height="10" fill="#ffe27a"/>`).join("")).join("")}
      <rect x="42" y="76" width="16" height="16" fill="#2b1d0e"/>`),
  };
  const cityScene = svg(`
    <circle cx="340" cy="34" r="16" fill="#ffe08a" opacity=".9"/>
    <g opacity=".8"><ellipse cx="70" cy="28" rx="26" ry="8" fill="#fff"/><ellipse cx="90" cy="23" rx="16" ry="7" fill="#fff"/></g>
    <g fill="#c9d4df">${[[0, 70, 26], [24, 54, 22], [44, 78, 30], [72, 46, 18], [88, 66, 24], [300, 60, 22], [320, 44, 20], [338, 72, 26], [362, 52, 22], [382, 68, 20]].map(([x, h, w]) => `<rect x="${x}" y="${120 - h}" width="${w}" height="${h + 40}"/>`).join("")}<path d="M330 44 V26 M334 44 V30" stroke="#c9d4df" stroke-width="2"/></g>
    ${[[6, 56, 34, "#8fa4b8"], [40, 40, 28, "#c97b5a"], [66, 62, 24, "#a7b8c8"], [306, 50, 26, "#a7b8c8"], [330, 66, 30, "#8fa4b8"], [358, 44, 30, "#c97b5a"]].map(([x, h, w, c]) => `<rect x="${x}" y="${132 - h}" width="${w}" height="${h + 28}" fill="${c}" stroke="#55606c" stroke-width="1.2"/>` + Array.from({ length: Math.floor(h / 12) }, (_, r) => Array.from({ length: Math.floor((w - 6) / 8) }, (_, k) => `<rect x="${x + 5 + k * 8}" y="${132 - h + 6 + r * 12}" width="4" height="6" fill="${(r + k + x) % 3 ? "#ffe27a" : "#5d6b7a"}"/>`).join("")).join("")).join("")}
    <path d="M0 132 Q100 124 200 130 T400 128 V160 H0 Z" fill="#8cc474"/>
    ${[[120, 124, 10], [140, 128, 7], [262, 126, 9], [280, 129, 6]].map(([x, y, r]) => `<rect x="${x - 1.5}" y="${y}" width="3" height="${r}" fill="#6b4a2a"/><circle cx="${x}" cy="${y - r * .3}" r="${r}" fill="#5f9a4b" stroke="#3b6b33" stroke-width="1.2"/>`).join("")}
    <rect x="0" y="142" width="400" height="18" fill="#6b7480"/><path d="M0 151 H400" stroke="#fff" stroke-width="1.6" stroke-dasharray="12 10"/>
    <g transform="translate(232 120)"><rect width="46" height="26" rx="4" fill="#c4162a" stroke="#2b1d0e" stroke-width="1.5"/><path d="M0 13 H46" stroke="#8f0f1f" stroke-width="1.2"/>
      ${[0, 1, 2, 3].map(k => `<rect x="${4 + k * 10}" y="3" width="7" height="7" fill="#bfe8ff"/><rect x="${4 + k * 10}" y="15" width="7" height="6" fill="#bfe8ff"/>`).join("")}
      <circle cx="10" cy="26" r="4" fill="#222"/><circle cx="36" cy="26" r="4" fill="#222"/></g>
    <g transform="translate(96 128)"><rect width="30" height="13" rx="3" fill="#ffcf3f" stroke="#2b1d0e" stroke-width="1.3"/><rect x="5" y="-6" width="18" height="7" rx="2" fill="#ffcf3f" stroke="#2b1d0e" stroke-width="1.3"/><circle cx="7" cy="13" r="3" fill="#222"/><circle cx="23" cy="13" r="3" fill="#222"/></g>
  `, "0 0 400 160", "xMidYMax slice");

  // ---------------- Space Colony ----------------
  const OS = `stroke="#0b0e2a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const SP = {
    start: svg(`<path d="M40 74 Q50 100 60 74 Z" fill="url(#lgFlame)" ${OS} stroke-width="2"/>
      <path d="M50 8 Q70 28 66 70 H34 Q30 28 50 8 Z" fill="url(#lgSilver)" ${OS}/>
      <path d="M50 8 Q60 16 63 28 H37 Q40 16 50 8 Z" fill="#e8483f" ${OS} stroke-width="2.5"/>
      <circle cx="50" cy="42" r="8" fill="url(#lgGlass)" ${OS} stroke-width="2.5"/>
      <path d="M34 54 L20 74 L35 70 Z M66 54 L80 74 L65 70 Z" fill="#e8483f" ${OS} stroke-width="2.5"/>
      ${spark(18, 20, 6, "#fff")}${spark(84, 34, 5, "#fff")}`),
    jail: svg(`<ellipse cx="50" cy="52" rx="44" ry="16" fill="url(#lgDisk)" ${OS}/>
      <circle cx="50" cy="48" r="20" fill="#000" stroke="#ffb35c" stroke-width="3"/>
      <path d="M8 54 Q50 76 92 54 Q50 66 8 54 Z" fill="url(#lgDisk)" ${OS} stroke-width="2"/>
      <circle cx="50" cy="48" r="26" fill="none" stroke="#c64bff" stroke-width="1.5" opacity=".6"/>`),
    free: svg(`<path d="M24 40 H70 L64 86 H30 Z" fill="#fff" ${OS}/>
      <path d="M70 48 q16 2 12 16 q-3 10 -16 8" fill="none" ${OS} stroke-width="5"/><path d="M70 48 q16 2 12 16 q-3 10 -16 8" fill="none" stroke="#fff" stroke-width="2"/>
      <ellipse cx="47" cy="40" rx="23" ry="6" fill="#6b3f1d" ${OS} stroke-width="2.5"/>
      <path d="M27 62 H67" stroke="#7df9ff" stroke-width="6"/>
      <path d="M38 30 q-6 -8 0 -14 q6 -6 0 -12 M54 30 q-6 -8 0 -14 q6 -6 0 -12" fill="none" stroke="#eef0ff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      <circle cx="80" cy="18" r="7" fill="#ffb35c" ${OS} stroke-width="2"/><ellipse cx="80" cy="18" rx="13" ry="4" fill="none" stroke="#ffe08a" stroke-width="2"/>`),
    gojail: svg(`<path d="M50 50 A4 4 0 0 1 58 50 A8 8 0 0 1 42 50 A12 12 0 0 1 66 50 A16 16 0 0 1 34 50 A20 20 0 0 1 74 50 A24 24 0 0 1 26 50 A28 28 0 0 1 82 50 A32 32 0 0 1 18 50" fill="none" stroke="#0b0e2a" stroke-width="9" stroke-linecap="round"/>
      <path d="M50 50 A4 4 0 0 1 58 50 A8 8 0 0 1 42 50 A12 12 0 0 1 66 50 A16 16 0 0 1 34 50 A20 20 0 0 1 74 50 A24 24 0 0 1 26 50 A28 28 0 0 1 82 50 A32 32 0 0 1 18 50" fill="none" stroke="url(#lgSpiral)" stroke-width="5" stroke-linecap="round"/>`),
    chance: svg(`<path d="M14 86 L48 52" stroke="#7df9ff" stroke-width="10" stroke-linecap="round" opacity=".35"/>
      <path d="M22 88 L52 58 M10 76 L42 46" stroke="#ffe08a" stroke-width="4" stroke-linecap="round" opacity=".7"/>
      <path d="${star5(62, 38, 28, 12)}" fill="url(#lgGold)" ${OS}/>${spark(88, 76, 6, "#fff")}${spark(20, 20, 5, "#fff")}`),
    quest: svg(`<rect x="6" y="38" width="28" height="24" fill="#2f5fd0" ${OS} stroke-width="2.5"/><rect x="66" y="38" width="28" height="24" fill="#2f5fd0" ${OS} stroke-width="2.5"/>
      <path d="M15 38 V62 M25 38 V62 M6 50 H34 M75 38 V62 M85 38 V62 M66 50 H94" stroke="#7df9ff" stroke-width="1.4"/>
      <path d="M34 50 H40 M60 50 H66" ${OS}/>
      <rect x="38" y="34" width="24" height="32" rx="4" fill="url(#lgGold)" ${OS}/>
      <path d="M44 34 Q50 14 64 18" fill="none" ${OS} stroke-width="2.5"/><circle cx="64" cy="18" r="4" fill="#e8483f" ${OS} stroke-width="2"/>`),
    station: svg(`<ellipse cx="50" cy="88" rx="34" ry="6" fill="#55607a" ${OS}/>
      <circle cx="50" cy="48" r="32" fill="url(#lgPortal)" ${OS}/>
      <circle cx="50" cy="48" r="32" fill="none" stroke="#7df9ff" stroke-width="5"/>
      <path d="M50 30 A18 18 0 1 1 32 48 A12 12 0 1 0 50 36" fill="none" stroke="#b16cff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
      ${[0, 1, 2, 3, 4, 5].map(k => { const a = k * Math.PI / 3; return `<circle cx="${(50 + 32 * Math.cos(a)).toFixed(1)}" cy="${(48 + 32 * Math.sin(a)).toFixed(1)}" r="3.5" fill="#fff6b0" ${OS} stroke-width="1.5"/>`; }).join("")}`),
    house: svg(`<path d="M16 72 A34 34 0 0 1 84 72 Z" fill="url(#lgGlass)" stroke="#0b0e2a" stroke-width="6" stroke-linejoin="round"/>
      <rect x="10" y="70" width="80" height="20" rx="4" fill="#aab3c5" stroke="#0b0e2a" stroke-width="6"/>
      <path d="M32 50 A20 20 0 0 1 50 40" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".8"/>`),
    hotel: svg(`<path d="M30 52 A20 18 0 0 1 70 52 Z" fill="url(#lgGlass)" stroke="#0b0e2a" stroke-width="6" stroke-linejoin="round"/>
      <ellipse cx="50" cy="60" rx="44" ry="14" fill="#aab3c5" stroke="#0b0e2a" stroke-width="6"/>
      ${[20, 35, 50, 65, 80].map(x => `<circle cx="${x}" cy="62" r="4" fill="#ffe08a"/>`).join("")}
      <path d="M38 74 L30 92 M62 74 L70 92" stroke="#7df9ff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`),
  };
  const spaceScene = svg(`
    ${Array.from({ length: 40 }, (_, k) => `<circle cx="${(k * 97) % 400}" cy="${(k * 53) % 110}" r="${k % 5 ? .9 : 1.6}" fill="#fff" opacity="${.4 + (k % 3) * .2}"/>`).join("")}
    <circle cx="56" cy="40" r="14" fill="#c9cfe6"/><circle cx="51" cy="36" r="3" fill="#a9b0cf"/><circle cx="62" cy="45" r="2.5" fill="#a9b0cf"/>
    <g transform="translate(336 46) rotate(-18)"><ellipse rx="40" ry="9" fill="none" stroke="#ffd86b" stroke-width="3" opacity=".8"/><circle r="20" fill="#ff9d5c"/><path d="M-19 -5 Q0 -9 19 -5 M-20 4 Q0 0 20 4" stroke="#e8713a" stroke-width="3" fill="none"/><path d="M-40 0 A40 9 0 0 0 40 0" fill="none" stroke="#ffd86b" stroke-width="3"/></g>
    <path d="M0 132 Q200 92 400 132 V160 H0 Z" fill="#5b3fa0"/>
    <path d="M0 132 Q200 92 400 132" fill="none" stroke="#b16cff" stroke-width="2" opacity=".8"/>
    ${[[80, 136, 9], [150, 124, 6], [300, 134, 8], [220, 146, 5], [40, 150, 6]].map(([x, y, r]) => `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .4}" fill="#43307a" stroke="#7a5cc4" stroke-width="1"/>`).join("")}
    <g transform="translate(316 92)"><path d="M-10 26 H10 L6 34 H-6 Z" fill="#aab3c5"/><path d="M0 -12 Q9 -2 8 18 H-8 Q-9 -2 0 -12 Z" fill="#eef0ff"/><path d="M0 -12 Q5 -7 6 -2 H-6 Q-5 -7 0 -12 Z" fill="#e8483f"/><circle cy="4" r="3.2" fill="#7df9ff"/><path d="M-8 12 L-14 22 L-7 20 Z M8 12 L14 22 L7 20 Z" fill="#e8483f"/></g>
    <g transform="translate(110 110)"><path d="M-14 8 A14 14 0 0 1 14 8 Z" fill="#7df9ff" opacity=".7"/><rect x="-16" y="7" width="32" height="5" rx="2" fill="#aab3c5"/></g>
  `, "0 0 400 160", "xMidYMax slice");

  // ---------------- North Pole ----------------
  const N = {
    start: svg(`<rect x="44" y="76" width="12" height="12" fill="#7a4a25" ${O} stroke-width="2.5"/>
      <path d="M50 14 L74 46 H62 L80 70 H64 L84 84 H16 L36 70 H20 L38 46 H26 Z" fill="url(#lgPine)" ${O}/>
      <path d="M32 58 Q52 64 68 54 M26 76 Q50 82 74 72" fill="none" stroke="#ffd34d" stroke-width="2.4"/>
      ${[[44, 40, "#e8483f"], [58, 62, "#3b82f6"], [38, 68, "#ffd34d"], [64, 78, "#e8483f"], [48, 52, "#ffd34d"]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3.6" fill="${c}" stroke="#2b1d0e" stroke-width="1.2"/>`).join("")}
      <path d="${star5(50, 13, 10, 4.2)}" fill="url(#lgGold)" ${O} stroke-width="2"/>
      <rect x="14" y="80" width="16" height="12" fill="#e8483f" ${O} stroke-width="2"/><path d="M22 80 V92" stroke="#ffd34d" stroke-width="2.5"/>
      <rect x="72" y="82" width="14" height="10" fill="#3b82f6" ${O} stroke-width="2"/><path d="M79 82 V92" stroke="#fff" stroke-width="2.5"/>`),
    jail: svg(`<path d="M34 10 H66 V54 Q66 62 72 68 L84 80 Q90 88 82 92 Q76 96 68 90 L44 70 Q34 62 34 50 Z" fill="url(#lgRed)" ${O}/>
      <rect x="30" y="8" width="40" height="14" rx="4" fill="#fff" ${O} stroke-width="2.5"/>
      ${[[40, 6], [52, 3], [62, 7]].map(([x, y]) => `<path d="M${x - 7} ${y + 4} l5 -7 8 1 3 7 -6 5 -9 -1 Z" fill="#2a2a2a" ${O} stroke-width="1.8"/>`).join("")}
      <path d="M40 40 H60 M40 50 H58" stroke="#fff" stroke-width="3" stroke-dasharray="4 4" opacity=".6"/>`),
    free: svg(`<rect x="10" y="22" width="80" height="70" fill="#b5523b" ${O}/>
      <path d="M10 36 H90 M10 50 H90 M10 64 H90 M10 78 H90 M30 22 V36 M60 22 V36 M20 36 V50 M76 36 V50" stroke="#8a3a28" stroke-width="1.6"/>
      <rect x="4" y="14" width="92" height="10" rx="2" fill="#e8d7b8" ${O} stroke-width="2.5"/>
      <path d="M26 92 V64 A24 24 0 0 1 74 64 V92 Z" fill="#2a1712" ${O}/>
      <path d="M50 88 Q30 80 38 62 Q42 72 46 68 Q44 56 52 48 Q54 62 60 64 Q64 58 62 54 Q72 72 50 88 Z" fill="url(#lgFlame)" stroke="#c2410c" stroke-width="1.5"/>
      <path d="M34 90 H66" stroke="#6b3f1d" stroke-width="5" stroke-linecap="round"/>`),
    gojail: svg(`<rect x="22" y="14" width="56" height="74" rx="4" fill="url(#lgParch)" ${O}/>
      <text x="50" y="30" text-anchor="middle" font-family="Fredoka,Arial,sans-serif" font-weight="700" font-size="11" fill="#c4162a">NAUGHTY</text>
      ${[42, 56, 70].map(y => `<path d="M30 ${y} H58" stroke="#a08a5a" stroke-width="3" stroke-linecap="round"/><path d="M63 ${y - 5} l8 8 M71 ${y - 5} l-8 8" stroke="#c4162a" stroke-width="3" stroke-linecap="round"/>`).join("")}
      <path d="M84 8 L60 70" stroke="#2b1d0e" stroke-width="2"/><path d="M84 8 Q98 22 70 48 Q78 26 84 8 Z" fill="#fff" stroke="#2b1d0e" stroke-width="2"/>`),
    chance: svg(`<g transform="rotate(-20 50 50)">
      <path d="M8 40 L22 46 V54 L8 60 Z M92 40 L78 46 V54 L92 60 Z" fill="url(#lgRed)" ${O} stroke-width="2.5"/>
      <rect x="22" y="38" width="56" height="24" rx="5" fill="url(#lgRed)" ${O}/>
      <path d="M32 38 V62 M68 38 V62" stroke="#ffd34d" stroke-width="4"/>
      <path d="${star5(50, 50, 7, 3)}" fill="#ffd34d"/></g>
      ${spark(78, 16, 8)}${spark(20, 82, 6)}<path d="M66 22 l-6 -6 M86 34 l7 -3 M70 34 l4 6" stroke="#ffd34d" stroke-width="2.5" stroke-linecap="round"/>`),
    quest: svg(`<path d="M18 74 Q30 30 56 18 Q74 12 84 26 Q74 22 66 30 L76 74 Z" fill="#2e9b4f" ${O}/>
      <path d="M84 26 Q92 36 86 46" fill="none" ${O} stroke-width="2.5"/><circle cx="86" cy="50" r="6" fill="url(#lgGold)" ${O} stroke-width="2.5"/>
      <rect x="12" y="70" width="70" height="16" rx="8" fill="#fff" ${O}/>
      ${[22, 36, 50, 64].map(x => `<path d="M${x} 72 l6 12" stroke="#e8483f" stroke-width="4"/>`).join("")}`),
    station: svg(`<path d="M10 80 Q6 92 20 90 H86 Q94 90 92 80" fill="none" stroke="#2b1d0e" stroke-width="6" stroke-linecap="round"/>
      <path d="M10 80 Q6 92 20 90 H86 Q94 90 92 80" fill="none" stroke="#ffd34d" stroke-width="3" stroke-linecap="round"/>
      <path d="M24 82 V74 M72 82 V74" ${O}/>
      <path d="M14 40 Q14 70 30 74 H76 Q90 70 88 52 L70 52 Q62 40 48 44 L30 46 Q24 30 14 40 Z" fill="url(#lgRed)" ${O}/>
      <path d="M30 60 H74" stroke="#ffd34d" stroke-width="3"/>
      <rect x="40" y="26" width="18" height="18" fill="#3b82f6" ${O} stroke-width="2.5"/><path d="M49 26 V44" stroke="#ffd34d" stroke-width="2.5"/>`),
    house: svg(`<rect x="22" y="48" width="56" height="42" fill="#a86b30" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <path d="M10 56 L50 16 L90 56 Z" fill="#fff" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <rect x="42" y="64" width="16" height="26" fill="#2e9b4f" stroke="#2b1d0e" stroke-width="5"/>`),
    hotel: svg(`<rect x="18" y="44" width="64" height="48" fill="#b8763c" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <path d="M8 48 L50 10 L92 48 Z" fill="#7a4a25" stroke="#2b1d0e" stroke-width="6" stroke-linejoin="round"/>
      <path d="M8 48 q7 8 14 0 q7 8 14 0 q7 8 14 0 q7 8 14 0 q7 8 14 0 q7 8 14 0" fill="#fff" stroke="#2b1d0e" stroke-width="3"/>
      <path d="M40 92 V72 a10 10 0 0 1 20 0 V92 Z" fill="#e8483f"/>
      <circle cx="30" cy="66" r="5" fill="#ffd34d"/><circle cx="70" cy="66" r="5" fill="#2e9b4f"/>`),
  };
  const pine = (x, y, h) => `<path d="M${x} ${y - h} L${x + h * .4} ${y - h * .4} H${x + h * .2} L${x + h * .5} ${y} H${x - h * .5} L${x - h * .2} ${y - h * .4} H${x - h * .4} Z" fill="#2e7d46" stroke="#1d5530" stroke-width="1.2"/><path d="M${x - h * .2} ${y - h * .55} L${x} ${y - h} L${x + h * .2} ${y - h * .55} Q${x} ${y - h * .48} ${x - h * .2} ${y - h * .55} Z" fill="#fff"/>`;
  const northScene = svg(`
    <path d="M0 40 Q100 20 200 36 T400 30" fill="none" stroke="#7fe0b0" stroke-width="10" opacity=".25"/>
    <path d="M0 52 Q120 30 220 46 T400 40" fill="none" stroke="#b9a0ff" stroke-width="8" opacity=".2"/>
    <path d="${star5(70, 32, 7, 3)}" fill="#ffd34d"/>${[[30, 50], [120, 22], [180, 44], [260, 20], [370, 48]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#fff"/>`).join("")}
    <path d="M0 112 Q90 88 190 104 T400 98 V160 H0 Z" fill="#e3f0f8" stroke="#b8d4e6" stroke-width="1.5"/>
    ${[[30, 112, 26], [52, 116, 20], [80, 118, 16], [372, 104, 24], [392, 110, 18]].map(([x, y, h]) => pine(x, y, h)).join("")}
    <g transform="translate(286 70)">
      <rect x="0" y="22" width="56" height="34" fill="#c4162a" stroke="#7a0f1a" stroke-width="1.5"/>
      <path d="M-6 24 L28 0 L62 24 Z" fill="#fff" stroke="#b8d4e6" stroke-width="1.5"/>
      <rect x="40" y="2" width="8" height="14" fill="#8a3a28"/><path d="M44 0 q-6 -8 2 -14 q6 -6 0 -12" fill="none" stroke="#fff" stroke-width="2.5" opacity=".8"/>
      <rect x="8" y="32" width="10" height="10" fill="#ffe27a"/><rect x="38" y="32" width="10" height="10" fill="#ffe27a"/><path d="M23 56 V40 a5 5 0 0 1 10 0 V56 Z" fill="#6b3f1d"/></g>
    <path d="M0 132 Q100 116 200 130 T400 126 V160 H0 Z" fill="#fff" stroke="#c9dfee" stroke-width="1.5"/>
    ${[[150, 128, "#e8483f", "#ffd34d"], [168, 130, "#2e9b4f", "#fff"], [240, 130, "#3b82f6", "#ffd34d"]].map(([x, y, c, r]) => `<rect x="${x}" y="${y - 10}" width="13" height="11" fill="${c}" stroke="#2b1d0e" stroke-width="1"/><path d="M${x + 6.5} ${y - 10} V${y + 1}" stroke="${r}" stroke-width="2"/>`).join("")}
    <g transform="translate(200 104)"><circle cy="14" r="12" fill="#fff" stroke="#b8d4e6" stroke-width="1.5"/><circle r="8" fill="#fff" stroke="#b8d4e6" stroke-width="1.5"/><circle cx="-3" cy="-2" r="1.2" fill="#222"/><circle cx="3" cy="-2" r="1.2" fill="#222"/><path d="M0 1 l5 2 -5 1 Z" fill="#ff8a3d"/><path d="M-7 5 H7" stroke="#c4162a" stroke-width="2.5"/></g>
  `, "0 0 400 160", "xMidYMax slice");

  // =================== Adventure: Treasure Island ===================
  const I = {
    camp: svg(`<ellipse cx="50" cy="89" rx="42" ry="5" fill="#000" opacity=".15"/>
      <path d="M10 86 L2 92 M90 86 L98 92" stroke="#7a4a25" stroke-width="2.5"/>
      <path d="M10 86 L48 20 L90 86 Z" fill="#efdcae" ${O}/>
      <path d="M48 20 L66 86 H90 Z" fill="#d8bf86" ${O} stroke-width="2.5"/>
      <path d="M48 20 L37 86 H58 Z" fill="#3a2a1a" ${O}/>
      <path d="M48 20 V6" ${O}/><path d="M48 6 L62 10 L48 14 Z" fill="#e8483f" ${O} stroke-width="2"/>`),
    calm: svg(`<ellipse cx="50" cy="90" rx="32" ry="6" fill="#e7c77a" ${O} stroke-width="2"/>
      <path d="M50 90 Q44 62 54 30" fill="none" stroke="#2b1d0e" stroke-width="12" stroke-linecap="round"/>
      <path d="M50 90 Q44 62 54 30" fill="none" stroke="#b07a3e" stroke-width="7.5" stroke-linecap="round"/>
      <path d="M46 80 h7 M45 70 h7 M46 60 h7 M48 50 h7 M51 40 h6" stroke="#7a4a25" stroke-width="2"/>
      ${["M54 30 Q32 14 8 30 Q30 22 54 32 Z", "M54 30 Q40 6 18 8 Q38 14 52 32 Z", "M54 30 Q62 4 84 8 Q64 14 56 32 Z", "M54 30 Q78 16 96 32 Q76 24 56 33 Z", "M54 31 Q74 34 82 54 Q66 40 54 34 Z", "M54 31 Q36 36 28 56 Q42 42 54 34 Z"].map(d => `<path d="${d}" fill="#3fae5a" ${O} stroke-width="2.5"/>`).join("")}
      <circle cx="49" cy="35" r="5" fill="#7a4a25" ${O} stroke-width="2"/><circle cx="58" cy="36" r="5" fill="#8a5a2b" ${O} stroke-width="2"/>`),
    item: svg(`<ellipse cx="50" cy="89" rx="40" ry="5" fill="#000" opacity=".15"/>
      <rect x="14" y="46" width="72" height="40" fill="url(#lgWood)" ${O}/>
      <path d="M14 46 V36 Q14 20 50 20 Q86 20 86 36 V46 Z" fill="url(#lgWood)" ${O}/>
      <path d="M14 46 H86" ${O}/>
      <path d="M26 21 V86 M74 21 V86" stroke="#2b1d0e" stroke-width="10"/><path d="M26 21 V86 M74 21 V86" stroke="#e0b23e" stroke-width="6"/>
      <rect x="42" y="40" width="16" height="16" rx="2" fill="url(#lgGold)" ${O} stroke-width="2.5"/><path d="M50 45 v6" stroke="#2b1d0e" stroke-width="3" stroke-linecap="round"/>
      ${[[12, 88], [20, 91], [86, 89]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3" fill="url(#lgGold)" stroke="#2b1d0e" stroke-width="1.5"/>`).join("")}`),
    chal: svg(`<path d="M6 82 H94" stroke="#2b1d0e" stroke-width="8" stroke-linecap="round"/><path d="M6 82 H94" stroke="#8a5a2b" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M42 70 L34 97 L46 90 L52 97 L56 70 Z" fill="#2f80c1" ${O} stroke-width="2.5"/>
      <ellipse cx="52" cy="56" rx="18" ry="24" fill="#e2382f" ${O}/>
      <path d="M42 46 Q32 66 46 82 Q60 70 56 48 Z" fill="#f4c430" ${O} stroke-width="2.5"/>
      <path d="M44 62 Q42 72 47 79" fill="none" stroke="#2f80c1" stroke-width="4" stroke-linecap="round"/>
      <circle cx="56" cy="29" r="14" fill="#e2382f" ${O}/>
      <circle cx="60" cy="26" r="5.5" fill="#fff" stroke="#2b1d0e" stroke-width="1.5"/><circle cx="61" cy="26" r="2.4" fill="#111"/>
      <path d="M68 26 Q82 28 76 44 Q72 37 65 35 Z" fill="#f1e2b8" ${O} stroke-width="2.5"/>
      <path d="M46 80 v3 M58 80 v3" stroke="#2b1d0e" stroke-width="3" stroke-linecap="round"/>`),
    map: svg(`<path d="M14 20 L58 14 L62 22 L70 18 L86 22 L84 46 L90 54 L84 62 L86 84 L44 88 L40 80 L30 86 L16 82 L18 60 L12 50 L18 40 Z" fill="url(#lgParch)" ${O}/>
      <path d="M22 44 L30 32 L38 44 Z M32 44 L38 36 L44 44 Z" fill="#c9b88a" stroke="#8a7650" stroke-width="1.5"/>
      <path d="M24 72 Q36 50 52 58 T72 34" fill="none" stroke="#b3261e" stroke-width="3" stroke-dasharray="5 4" stroke-linecap="round"/>
      <path d="M68 26 l9 9 M77 26 l-9 9" stroke="#b3261e" stroke-width="4" stroke-linecap="round"/>
      <circle cx="72" cy="70" r="7" fill="none" stroke="#8a7650" stroke-width="1.5"/><path d="M72 62 V78 M64 70 H80" stroke="#8a7650" stroke-width="1.5"/>`),
    quick: svg(`<ellipse cx="50" cy="64" rx="44" ry="24" fill="#c49a58" ${O}/>
      <ellipse cx="50" cy="64" rx="32" ry="16" fill="#a57a3c"/>
      <path d="M26 64 Q50 46 74 64 Q52 78 40 66 Q50 58 60 64" fill="none" stroke="#7a5527" stroke-width="3" stroke-linecap="round"/>
      ${[[32, 38, 5], [66, 32, 4], [56, 44, 3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e2c08a" stroke="#7a5527" stroke-width="2"/>`).join("")}`),
    snake: svg(`<ellipse cx="46" cy="76" rx="34" ry="13" fill="#4caf50" ${O}/>
      <ellipse cx="46" cy="76" rx="20" ry="6.5" fill="#3b8f3f" ${O} stroke-width="2"/>
      <path d="M68 72 Q86 54 66 40 Q54 32 60 22" fill="none" stroke="#2b1d0e" stroke-width="15" stroke-linecap="round"/>
      <path d="M68 72 Q86 54 66 40 Q54 32 60 22" fill="none" stroke="#4caf50" stroke-width="10" stroke-linecap="round"/>
      ${[[30, 72], [44, 68], [60, 72], [76, 58], [70, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#2e7d32"/>`).join("")}
      <ellipse cx="62" cy="20" rx="14" ry="9.5" fill="#4caf50" ${O}/>
      <circle cx="66" cy="16" r="3.4" fill="#ffe066" stroke="#2b1d0e" stroke-width="1.2"/><path d="M66 13.5 v5" stroke="#111" stroke-width="1.6"/>
      <path d="M75 22 l9 2 M84 24 l4 -3 M84 24 l3 4" stroke="#e2382f" stroke-width="2.4" stroke-linecap="round"/>`),
    cave: svg(`<path d="M6 88 Q10 40 40 24 Q60 14 78 30 Q96 48 94 88 Z" fill="#a39d92" ${O}/>
      <path d="M62 20 Q90 40 92 86 H74 Q80 52 62 20 Z" fill="#8a847a"/>
      <path d="M6 88 Q10 40 40 24 Q60 14 78 30 Q96 48 94 88 Z" fill="none" ${O}/>
      <path d="M30 88 V66 Q30 44 50 44 Q70 44 70 66 V88 Z" fill="#1a1410" ${O}/>
      <path d="M40 54 q4 -3 8 0 q4 -3 8 0" fill="none" stroke="#fff" stroke-width="1.6" opacity=".25"/>
      <path d="M4 88 q6 -8 12 0 q5 -7 10 0 M74 88 q6 -9 12 0 q4 -6 8 0" fill="#5e8f45" stroke="#2f5a2a" stroke-width="2"/>`),
    rock: svg(`<path d="M10 88 Q8 66 28 60 Q46 56 50 72 Q54 88 10 88 Z" fill="#a39c90" ${O}/>
      <path d="M44 88 Q42 62 62 58 Q86 56 90 76 Q92 88 44 88 Z" fill="#b5aea2" ${O}/>
      <path d="M30 62 Q28 44 44 42 Q58 42 58 56 Q54 64 30 62 Z" fill="#8f897d" ${O}/>
      <path d="M20 70 q6 -4 12 0 M62 70 q8 -4 16 0" stroke="#7d776c" stroke-width="2" fill="none"/>
      ${[[64, 24, 6], [80, 36, 4.5], [46, 22, 4]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#a39c90" ${O} stroke-width="2"/><path d="M${x} ${y - r - 10} v6" stroke="#6b655c" stroke-width="2" stroke-linecap="round"/>`).join("")}`),
    look: svg(`<path d="M30 94 L40 40 M70 94 L60 40" stroke="#2b1d0e" stroke-width="9" stroke-linecap="round"/><path d="M30 94 L40 40 M70 94 L60 40" stroke="#b07a3e" stroke-width="5" stroke-linecap="round"/>
      <path d="M35 76 L65 56 M65 76 L35 56" stroke="#8a5a2b" stroke-width="3.5"/>
      <rect x="26" y="32" width="48" height="10" fill="url(#lgWood)" ${O}/>
      <rect x="34" y="18" width="32" height="14" fill="#c58c4a" ${O}/><rect x="42" y="21" width="16" height="7" fill="#3a2a1a"/>
      <path d="M26 18 L50 4 L74 18 Z" fill="#c9b062" ${O}/><path d="M34 16 L40 8 M50 16 V6 M66 16 L60 8" stroke="#9c8640" stroke-width="1.8"/>`),
    x: svg(`<path d="M22 20 Q48 48 80 82 M80 18 Q52 48 20 82" stroke="#2b1d0e" stroke-width="17" stroke-linecap="round" fill="none"/>
      <path d="M22 20 Q48 48 80 82 M80 18 Q52 48 20 82" stroke="#c92a2a" stroke-width="11" stroke-linecap="round" fill="none"/>
      <path d="M26 24 Q46 44 60 58 M76 24 Q60 40 52 46" stroke="#ef6b5b" stroke-width="3" stroke-linecap="round" fill="none"/>`),
    danger: svg(`<path d="M30 66 L24 84 M46 66 L40 84 M70 66 L64 84" stroke="#9fd0f0" stroke-width="3" stroke-linecap="round"/>
      <path d="M20 60 Q6 58 8 44 Q10 30 26 33 Q30 16 50 18 Q64 10 74 26 Q92 24 92 42 Q94 60 78 60 Z" fill="#6b7686" ${O}/>
      <path d="M52 52 L42 72 H52 L46 92 L66 64 H56 L62 52 Z" fill="#ffd34d" ${O} stroke-width="2.5"/>`),
  };
  I.xknown = I.x;

  // shared bits for the next two adventures
  const pineT = (x, b, h, snow) => { const w = h * .55; return `<rect x="${x - 3.5}" y="${b - h * .16}" width="7" height="${h * .16}" fill="#7a4a25" ${O} stroke-width="2"/>
    <path d="M${x} ${b - h} L${x + w * .5} ${b - h * .55} H${x + w * .28} L${x + w * .72} ${b - h * .14} H${x - w * .72} L${x - w * .28} ${b - h * .55} H${x - w * .5} Z" fill="url(#lgPine)" ${O} stroke-width="2.5"/>
    ${snow ? `<path d="M${x - w * .18} ${b - h * .8} L${x} ${b - h} L${x + w * .18} ${b - h * .8} Q${x} ${b - h * .74} ${x - w * .18} ${b - h * .8} Z M${x - w * .42} ${b - h * .5} Q${x} ${b - h * .44} ${x + w * .42} ${b - h * .5} L${x + w * .3} ${b - h * .56} Q${x} ${b - h * .5} ${x - w * .3} ${b - h * .56} Z" fill="#fff"/>` : ""}`; };
  const flake = (x, y, r, c) => `<path d="${[0, 60, 120].map(a => { const dx = r * Math.cos(a * Math.PI / 180), dy = r * Math.sin(a * Math.PI / 180); return `M${(x - dx).toFixed(1)} ${(y - dy).toFixed(1)} L${(x + dx).toFixed(1)} ${(y + dy).toFixed(1)}`; }).join(" ")}" stroke="${c || "#6fb3e0"}" stroke-width="2.5" stroke-linecap="round"/>`;
  const caveBody = (rock, dark, shade) => `<path d="M6 88 Q10 40 40 24 Q60 14 78 30 Q96 48 94 88 Z" fill="${rock}" ${O}/>
    <path d="M62 20 Q90 40 92 86 H74 Q80 52 62 20 Z" fill="${shade}"/>
    <path d="M6 88 Q10 40 40 24 Q60 14 78 30 Q96 48 94 88 Z" fill="none" ${O}/>
    <path d="M30 88 V66 Q30 44 50 44 Q70 44 70 66 V88 Z" fill="${dark}" ${O}/>`;
  const dragonHead = svg(`<path d="M14 94 Q16 62 34 48 Q28 32 44 24 L58 22 Q76 24 88 36 Q95 44 86 50 L70 52 Q64 58 56 58 Q50 72 56 94 Z" fill="#c0392b" ${O}/>
    <path d="M26 64 Q34 78 34 94 M22 76 L34 76 M20 86 L34 86" stroke="#2b1d0e" stroke-width="2" fill="none"/><path d="M24 62 Q34 76 35 94 H52 Q46 74 54 58 Q40 60 24 62 Z" fill="#f0b46a" opacity=".85"/>
    <path d="M44 25 L32 4 L52 20 Z M55 22 L54 2 L64 20 Z" fill="#f4e6c8" ${O} stroke-width="2.2"/>
    <path d="M34 48 L22 44 L30 54 M28 58 L16 58 L26 64" fill="#a52a20" ${O} stroke-width="2"/>
    <ellipse cx="63" cy="34" rx="6" ry="4.5" fill="#ffd34d" stroke="#2b1d0e" stroke-width="1.6"/><path d="M63 30.5 V37.5" stroke="#111" stroke-width="2"/>
    <circle cx="84" cy="40" r="1.8" fill="#2b1d0e"/>
    <path d="M70 51 l3 5 3 -5 M78 50 l2.5 4 2.5 -4" fill="#fff" stroke="#2b1d0e" stroke-width="1.2"/>
    <circle cx="94" cy="30" r="4" fill="#9aa0a8" opacity=".7"/><circle cx="96" cy="22" r="3" fill="#9aa0a8" opacity=".5"/>`);

  // =================== Adventure: Dragon's Mountain ===================
  const D = {
    camp: svg(`<ellipse cx="50" cy="90" rx="46" ry="5" fill="#000" opacity=".15"/>
      <rect x="52" y="46" width="40" height="42" fill="#e9d8b0" ${O}/><path d="M46 50 L72 20 L98 50 Z" fill="#8e5a2b" ${O}/>
      <rect x="64" y="58" width="14" height="11" fill="#ffe27a" ${O} stroke-width="2"/>
      <rect x="10" y="54" width="38" height="34" fill="#f4e6c8" ${O}/><path d="M4 58 L29 30 L54 58 Z" fill="url(#lgRoof)" ${O}/>
      <rect x="23" y="70" width="11" height="18" fill="#6b3f1d" ${O} stroke-width="2"/>`),
    calm: svg(`<ellipse cx="50" cy="91" rx="40" ry="5" fill="#6fa85a" ${O} stroke-width="2"/>${pineT(36, 90, 74)}${pineT(70, 91, 52)}`),
    item: svg(`<rect x="16" y="14" width="68" height="15" rx="7.5" fill="#4f7d9e" ${O}/><path d="M30 14 V29 M70 14 V29" stroke="#2b1d0e" stroke-width="3"/>
      <rect x="22" y="28" width="56" height="60" rx="13" fill="#a86b30" ${O}/>
      <path d="M22 46 Q22 28 50 28 Q78 28 78 46 V54 H22 Z" fill="#8a5222" ${O}/>
      <rect x="44" y="47" width="12" height="12" rx="2" fill="url(#lgGold)" ${O} stroke-width="2"/>
      <rect x="32" y="64" width="36" height="18" rx="5" fill="#8a5222" ${O} stroke-width="2.5"/>`),
    chal: svg(`<path d="M24 90 L28 30 Q30 12 50 12 Q70 12 72 30 L76 90 Z" fill="#9a948a" ${O}/>
      <path d="M58 14 Q70 16 72 30 L76 88 H64 Z" fill="#847e74"/>
      <path d="M24 90 L28 30 Q30 12 50 12 Q70 12 72 30 L76 90 Z" fill="none" ${O}/>
      <path d="M41 38 Q41 27 51 27 Q61 27 61 36 Q61 43 51 46 V53" fill="none" stroke="#7df9ff" stroke-width="11" stroke-linecap="round" opacity=".3"/>
      <path d="M41 38 Q41 27 51 27 Q61 27 61 36 Q61 43 51 46 V53" fill="none" stroke="#bff9ff" stroke-width="5" stroke-linecap="round"/>
      <circle cx="51" cy="63" r="3.5" fill="#bff9ff"/>
      <path d="M18 92 q6 -8 12 0 q5 -7 10 0 M62 92 q6 -9 12 0 q4 -6 8 0" fill="#5e8f45" stroke="#2f5a2a" stroke-width="2"/>`),
    map: svg(`<path d="M50 8 L82 27 V69 L50 90 L18 69 V27 Z" fill="#3b82f6" ${O}/>
      <path d="M50 8 L82 27 L50 42 L18 27 Z" fill="#7cb5ff"/><path d="M50 42 V90 M18 27 L50 42 L82 27" stroke="#1e4fa8" stroke-width="1.6" fill="none"/>
      <path d="M50 8 L82 27 V69 L50 90 L18 69 V27 Z" fill="none" ${O}/>
      <path d="M42 50 L54 62 L42 74 M56 50 V74" stroke="#bfe3ff" stroke-width="8" stroke-linecap="round" opacity=".35" fill="none"/>
      <path d="M42 50 L54 62 L42 74 M56 50 V74" stroke="#eef8ff" stroke-width="3.5" stroke-linecap="round" fill="none"/>
      ${spark(86, 12, 7)}${spark(14, 86, 5)}`),
    quick: svg(`${[0, 1, 2, 3, 4, 5, 6, 7].map(k => { const a = k * Math.PI / 4; return `<path d="M50 48 L${(50 + 44 * Math.cos(a)).toFixed(1)} ${(48 + 44 * Math.sin(a)).toFixed(1)}" stroke="#4b5160" stroke-width="2"/>`; }).join("")}
      ${[12, 22, 32, 42].map(r => `<path d="${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k, j) => { const a = k * Math.PI / 4; return (j ? "L" : "M") + (50 + r * Math.cos(a)).toFixed(1) + " " + (48 + r * Math.sin(a)).toFixed(1); }).join(" ")}" fill="none" stroke="#4b5160" stroke-width="1.8"/>`).join("")}
      <path d="M70 4 V22" stroke="#4b5160" stroke-width="1.5"/>
      <path d="M62 22 l-8 -6 M62 26 l-9 0 M62 30 l-8 5 M78 22 l8 -6 M78 26 l9 0 M78 30 l8 5" stroke="#111" stroke-width="2.2" stroke-linecap="round"/>
      <ellipse cx="70" cy="28" rx="8" ry="9" fill="#222" ${O} stroke-width="2"/><circle cx="70" cy="18" r="5" fill="#222"/><circle cx="68" cy="17" r="1.4" fill="#ff5d5d"/><circle cx="72" cy="17" r="1.4" fill="#ff5d5d"/>`),
    snake: svg(`<path d="M50 90 Q30 88 26 66 L18 28 L37 43 Q50 37 63 43 L82 28 L74 66 Q70 88 50 90 Z" fill="#8d939e" ${O}/>
      <path d="M22 36 L32 46 L26 52 Z M78 36 L68 46 L74 52 Z" fill="#e6b8b8"/>
      <path d="M38 66 Q50 56 62 66 Q62 86 50 88 Q38 86 38 66 Z" fill="#e5e7eb" ${O} stroke-width="2"/>
      <path d="M32 58 Q38 52 45 57 Q38 62 32 58 Z M68 58 Q62 52 55 57 Q62 62 68 58 Z" fill="#ffd34d" stroke="#2b1d0e" stroke-width="1.6"/><circle cx="39" cy="57" r="1.8" fill="#111"/><circle cx="61" cy="57" r="1.8" fill="#111"/>
      <path d="M31 51 L44 54 M69 51 L56 54" stroke="#2b1d0e" stroke-width="2.4" stroke-linecap="round"/>
      <ellipse cx="50" cy="70" rx="5.5" ry="3.8" fill="#222"/><path d="M50 74 V79 M44 80 Q50 84 56 80" stroke="#222" stroke-width="2" fill="none"/>`),
    cave: svg(`${caveBody("#8a8478", "#120e0c", "#736d62")}<circle cx="43" cy="70" r="3.4" fill="#b6ff4a"/><circle cx="56" cy="70" r="3.4" fill="#b6ff4a"/>
      <circle cx="43" cy="70" r="7" fill="#b6ff4a" opacity=".2"/><circle cx="56" cy="70" r="7" fill="#b6ff4a" opacity=".2"/>
      <path d="M4 88 q6 -8 12 0 q5 -7 10 0 M74 88 q6 -9 12 0 q4 -6 8 0" fill="#5e8f45" stroke="#2f5a2a" stroke-width="2"/>`),
    rock: I.rock,
    look: svg(`<path d="M4 90 L38 26 L52 46 L64 34 L96 90 Z" fill="#8f97a8" ${O}/>
      <path d="M38 26 L66 90 H96 L64 34 L52 46 Z" fill="#7a8295" opacity=".7"/>
      <path d="M38 26 L48 44 L42 40 L36 48 L30 40 Z M64 34 L74 52 L68 48 L62 54 L58 46 Z" fill="#fff" ${O} stroke-width="2"/>
      <path d="M38 26 V6" ${O}/><path d="M38 6 L52 10 L38 14 Z" fill="#e8483f" ${O} stroke-width="2"/>`),
    x: svg(`<path d="M8 90 Q8 70 26 66 Q40 64 44 76 Q48 90 8 90 Z" fill="#4a4440" ${O}/><path d="M50 90 Q50 66 68 64 Q88 64 92 80 V90 Z" fill="#5a524c" ${O}/>
      <path d="M50 72 Q34 60 44 40 Q46 50 52 50 Q48 32 58 18 Q60 38 68 44 Q72 36 70 30 Q86 50 70 66 Q62 76 50 72 Z" fill="url(#lgFlame)" stroke="#c2410c" stroke-width="2"/>
      <path d="M54 66 Q46 58 52 48 Q56 56 60 54 Q66 62 54 66 Z" fill="#fff3a0"/>
      ${[[30, 40], [80, 34], [24, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.4" fill="#ffb02e"/>`).join("")}`),
    xknown: dragonHead,
    danger: dragonHead,
  };

  // =================== Adventure: Save Christmas ===================
  const sleigh = N.station;
  const X = {
    camp: svg(`<ellipse cx="50" cy="90" rx="44" ry="5" fill="#9fbcd3" opacity=".5"/>
      <rect x="66" y="16" width="11" height="22" fill="#8a3a28" ${O} stroke-width="2.5"/>
      <rect x="16" y="44" width="68" height="44" fill="url(#lgRed)" ${O}/>
      <path d="M8 48 L50 14 L92 48 Z" fill="#fff" ${O}/>
      <path d="M8 48 q7 7 14 0 q7 7 14 0 q7 7 14 0 q7 7 14 0 q7 7 14 0 q7 7 14 0" fill="#fff" stroke="#2b1d0e" stroke-width="2.5"/>
      <rect x="23" y="58" width="13" height="11" fill="#ffe27a" ${O} stroke-width="2"/><rect x="64" y="58" width="13" height="11" fill="#ffe27a" ${O} stroke-width="2"/>
      <rect x="43" y="64" width="14" height="24" fill="#2e9b4f" ${O} stroke-width="2.5"/><circle cx="50" cy="72" r="4" fill="none" stroke="#1f6b38" stroke-width="2.5"/><circle cx="50" cy="69" r="1.3" fill="#e8483f"/>`),
    calm: svg(`<ellipse cx="50" cy="91" rx="42" ry="5" fill="#fff" ${O} stroke-width="2"/>${pineT(36, 90, 74, 1)}${pineT(70, 91, 52, 1)}${flake(84, 16, 5, "#9fd0f0")}${flake(14, 30, 4, "#9fd0f0")}`),
    item: svg(`<rect x="10" y="50" width="44" height="38" fill="url(#lgRed)" ${O}/><path d="M32 50 V88 M10 66 H54" stroke="#ffd34d" stroke-width="5"/>
      <rect x="56" y="58" width="34" height="30" fill="#2e9b4f" ${O}/><path d="M73 58 V88" stroke="#fff" stroke-width="4.5"/>
      <rect x="28" y="22" width="36" height="28" fill="#3b82f6" ${O}/><path d="M46 22 V50 M28 36 H64" stroke="#fff" stroke-width="4"/>
      <path d="M46 22 Q36 10 40 18 Q42 22 46 22 Q50 10 56 16 Q54 22 46 22 Z" fill="#ffd34d" ${O} stroke-width="2"/>`),
    chal: svg(`<path d="M24 34 H42 A9 9 0 1 1 58 34 H76 V48 A9 9 0 1 1 76 62 V80 H58 A9 9 0 1 0 42 80 H24 V62 A9 9 0 1 0 24 48 Z" fill="#2e9b4f" ${O}/>
      <path d="M30 40 H40 M30 40 V50" stroke="#7fd39a" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="50" cy="57" r="4" fill="#e8483f" stroke="#2b1d0e" stroke-width="1.5"/>`),
    map: svg(`<rect x="34" y="8" width="16" height="16" fill="#e8483f" ${O} stroke-width="2"/><path d="M42 8 V24" stroke="#ffd34d" stroke-width="3"/>
      <rect x="52" y="12" width="14" height="14" fill="#2e9b4f" ${O} stroke-width="2"/><path d="M59 12 V26" stroke="#fff" stroke-width="3"/>
      <path d="M26 90 Q12 72 22 50 Q28 36 40 33 H60 Q72 36 78 50 Q88 72 74 90 Z" fill="#b07a3e" ${O}/>
      <path d="M36 32 Q50 24 64 32 L62 38 Q50 34 38 38 Z" fill="#9c6a30" ${O} stroke-width="2"/>
      <path d="M36 36 Q50 30 64 36" stroke="#e8483f" stroke-width="5" fill="none" stroke-linecap="round"/>
      <rect x="54" y="60" width="13" height="13" fill="#8a5a2b" stroke="#2b1d0e" stroke-width="1.6" stroke-dasharray="3 2"/>
      <path d="M32 56 Q34 70 30 80" stroke="#8a5a2b" stroke-width="2" fill="none"/>`),
    quick: svg(`<path d="M4 90 Q18 54 42 62 Q60 42 80 56 Q96 62 96 90 Z" fill="#fff" ${O}/>
      <path d="M8 90 Q30 76 52 82 Q74 74 94 86 V90 Z" fill="#dcecf6"/>
      <path d="M58 64 h10 v-14 h8 v18 q0 6 -6 6 h-12 Z" fill="#e8483f" ${O} stroke-width="2"/><path d="M68 50 h8" stroke="#fff" stroke-width="4"/>
      ${flake(26, 26, 10)}${flake(60, 18, 7)}${flake(84, 34, 5)}`),
    snake: svg(`<circle cx="26" cy="30" r="11" fill="#fff" ${O}/><circle cx="74" cy="30" r="11" fill="#fff" ${O}/><circle cx="26" cy="30" r="5" fill="#f3d6d6"/><circle cx="74" cy="30" r="5" fill="#f3d6d6"/>
      <ellipse cx="50" cy="56" rx="34" ry="30" fill="#fff" ${O}/>
      <ellipse cx="50" cy="68" rx="15" ry="11" fill="#eef4f8" ${O} stroke-width="2"/>
      <ellipse cx="50" cy="62" rx="6.5" ry="4.5" fill="#222"/><circle cx="38" cy="50" r="3.6" fill="#222"/><circle cx="62" cy="50" r="3.6" fill="#222"/>
      <path d="M50 66 V71 M44 74 Q50 78 56 74" stroke="#222" stroke-width="2" fill="none"/>
      <path d="M20 80 Q50 94 80 80 L80 88 Q50 100 20 88 Z" fill="#e8483f" ${O} stroke-width="2.5"/><path d="M30 86 v6 M42 89 v6 M58 89 v6 M70 86 v6" stroke="#fff" stroke-width="2.5"/>`),
    cave: svg(`${caveBody("#cfe8f7", "#1e3a5f", "#a9d2ee")}${[36, 44, 52, 60].map((x, k) => `<path d="M${x - 3} ${48 + (k % 2) * 2} L${x} ${58 + (k % 2) * 4} L${x + 3} ${48 + (k % 2) * 2} Z" fill="#fff" stroke="#2b1d0e" stroke-width="1.2"/>`).join("")}${flake(80, 18, 6, "#6fb3e0")}`),
    rock: svg(`<path d="M4 90 L44 22 L96 90 Z" fill="#dcecf6" ${O}/><path d="M44 22 L56 42 L48 38 L40 46 L33 40 Z" fill="#fff" ${O} stroke-width="2"/>
      ${[[60, 58, 9], [74, 70, 7], [46, 74, 6], [84, 82, 5]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${O} stroke-width="2"/>`).join("")}
      <path d="M50 50 l-6 -3 M66 62 l-6 -3 M80 76 l-6 -3" stroke="#6fb3e0" stroke-width="2.4" stroke-linecap="round"/>`),
    look: svg(`<path d="M50 24 L6 10 V38 Z M50 24 L94 10 V38 Z" fill="#ffe27a" opacity=".45"/>
      <rect x="30" y="86" width="40" height="7" fill="#8f97a8" ${O} stroke-width="2"/>
      <path d="M38 88 L42 32 H58 L62 88 Z" fill="#fff" ${O}/>
      <path d="M40.7 50 H59.3 L60.2 62 H39.8 Z M39.1 74 H60.9 L61.9 88 H38.1 Z" fill="#e8483f"/>
      <path d="M38 88 L42 32 H58 L62 88 Z" fill="none" ${O}/>
      <rect x="40" y="20" width="20" height="12" fill="#ffe27a" ${O} stroke-width="2.5"/><path d="M36 20 L50 8 L64 20 Z" fill="#e8483f" ${O} stroke-width="2.5"/>`),
    x: svg(`<path d="M22 94 Q42 62 32 34 Q28 20 38 6 M44 94 Q64 62 54 34 Q50 20 60 6" fill="none" stroke="#7fa6c4" stroke-width="5" stroke-linecap="round"/>
      ${[[38, 82], [44, 64], [42, 46], [46, 28]].map(([x, y]) => `<ellipse cx="${x - 4}" cy="${y}" rx="3" ry="4" fill="#a9c4d8"/><ellipse cx="${x + 6}" cy="${y - 6}" rx="3" ry="4" fill="#a9c4d8"/>`).join("")}
      ${spark(80, 20, 7)}`),
    xknown: sleigh,
    danger: svg(`<circle cx="50" cy="54" r="38" fill="url(#lgGold)" ${O}/><circle cx="50" cy="54" r="31" fill="#fff8e6" ${O} stroke-width="2.5"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(k => { const a = k * Math.PI / 6, r1 = k % 3 ? 27 : 23; return `<path d="M${(50 + r1 * Math.sin(a)).toFixed(1)} ${(54 - r1 * Math.cos(a)).toFixed(1)} L${(50 + 29 * Math.sin(a)).toFixed(1)} ${(54 - 29 * Math.cos(a)).toFixed(1)}" stroke="#2b1d0e" stroke-width="${k % 3 ? 1.5 : 3}"/>`; }).join("")}
      <path d="M50 54 L50 36" stroke="#2b1d0e" stroke-width="5" stroke-linecap="round"/><path d="M50 54 L45 28" stroke="#c4162a" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="54" r="3.5" fill="#2b1d0e"/>
      <path d="M50 14 Q38 2 28 12 Q38 12 40 20 Q46 14 50 14 Z M50 14 Q62 2 72 12 Q62 12 60 20 Q54 14 50 14 Z" fill="#2e9b4f" ${O} stroke-width="2"/>
      <circle cx="46" cy="16" r="3.4" fill="#e8483f" stroke="#2b1d0e" stroke-width="1.2"/><circle cx="54" cy="16" r="3.4" fill="#e8483f" stroke="#2b1d0e" stroke-width="1.2"/>`),
  };

  // sea around the island map: shore, surf and sea life (water squares are fixed)
  const SHORE = {
    island: { shallow: "#7fd3e6", foam: "#f4fbff", rim: "#d9b56a" },
    dragon: { shallow: "rgba(170,160,220,.25)", foam: "#8b8fa8", rim: "#6e6a5c" },
    xmas: { shallow: "#8fc3e6", foam: "#ffffff", rim: "#cfe3f1" },
  };
  const ship = `<g transform="translate(92 54)">
      <path d="M-56 8 H56 L44 34 H-44 Z" fill="#8a5a2b" ${O}/><path d="M-50 18 H50" stroke="#5e3a18" stroke-width="2"/>
      <path d="M0 8 V-46" ${O} stroke-width="4"/>
      <path d="M2 -42 Q30 -30 2 -8 Z M-2 -40 Q-34 -26 -2 -6 Z" fill="#f4e6c8" ${O} stroke-width="2.5"/>
      <path d="M0 -46 L-20 -52 L-20 -40 Z" fill="#222" ${O} stroke-width="2"/><circle cx="-11" cy="-46" r="2.6" fill="#fff"/></g>`;
  const serpent = `<g transform="translate(640 74) scale(.82)">
      <path d="M-70 10 Q-60 -18 -46 10" fill="#3e9b6f" ${O}/><path d="M-36 10 Q-24 -24 -10 10" fill="#3e9b6f" ${O}/>
      <path d="M2 10 Q8 -30 30 -36 Q46 -38 46 -24 Q40 -18 30 -22 Q18 -18 20 10 Z" fill="#3e9b6f" ${O}/>
      <circle cx="36" cy="-29" r="3" fill="#ffe066" stroke="#2b1d0e" stroke-width="1.2"/>
      <path d="M-76 12 Q-30 4 26 12" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/></g>`;
  const compass = `<g transform="translate(650 620)">
      <circle r="40" fill="#f4e6c8" opacity=".9" ${O}/><circle r="32" fill="none" stroke="#8a7650" stroke-width="1.5"/>
      <path d="M0 -36 L7 0 L0 36 L-7 0 Z" fill="#b3261e" ${O} stroke-width="2"/><path d="M-36 0 L0 -7 L36 0 L0 7 Z" fill="#2b1d0e" stroke="#2b1d0e" stroke-width="2" stroke-linejoin="round"/>
      <circle r="4" fill="#e0b23e" stroke="#2b1d0e" stroke-width="1.5"/>
      <circle cy="-47" r="9" fill="#f4e6c8" stroke="#2b1d0e" stroke-width="2"/><text y="-42.5" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="13" fill="#b3261e">N</text></g>`;
  const barrel = `<g transform="translate(52 610)"><path d="M-30 30 Q-34 10 -18 6 Q-6 2 -2 16 Q2 30 -30 30 Z M4 34 Q4 18 18 18 Q30 20 30 34 Z" fill="#8f897d" ${O} stroke-width="2.5"/>
      <g transform="rotate(-18)"><rect x="-14" y="-36" width="28" height="34" rx="9" fill="url(#lgWood)" ${O} stroke-width="2.5"/><path d="M-14 -26 H14 M-14 -12 H14" stroke="#5e3a18" stroke-width="2.5"/></g>
      <path d="M-40 36 Q0 28 40 36" fill="none" stroke="#fff" stroke-width="2.4" opacity=".7"/></g>`;
  const moon = (x, y) => `<circle cx="${x}" cy="${y}" r="26" fill="#fff2c4"/><circle cx="${x + 12}" cy="${y - 8}" r="24" style="fill:var(--sea)"/>`;
  const dragonSea = `<g transform="translate(96 58)">
      <path d="M-4 0 L6 -40 L16 -16 L32 -32 L28 2 Z" fill="#7a2020" ${O} stroke-width="2.5"/>
      <path d="M-44 8 Q-12 -6 20 2 Q34 6 44 -2 L52 2 Q42 14 22 13 Q-10 18 -44 8 Z" fill="#a52a20" ${O} stroke-width="2.5"/>
      <path d="M-44 8 Q-58 10 -66 22 L-58 18" fill="none" ${O} stroke-width="2.5"/><path d="M-66 22 l-4 -8 8 2 Z" fill="#a52a20" ${O} stroke-width="1.5"/>
      <path d="M-12 2 L-34 -32 L-22 -10 L-46 -20 L-28 6 Z" fill="#8e2a2a" ${O} stroke-width="2.5"/>
      <circle cx="44" cy="2" r="1.6" fill="#ffd34d"/><path d="M52 4 q8 0 12 -6" stroke="#ffb02e" stroke-width="3" fill="none" stroke-linecap="round"/></g>
    ${moon(640, 58)}
    ${[[600, 40], [676, 100], [560, 26]].map(([x, y]) => `<path d="M${x - 6} ${y} q3 -4 6 0 q3 -4 6 0" stroke="#2b1d0e" stroke-width="2" fill="none"/>`).join("")}
    <g transform="translate(52 620)"><path d="M-34 34 L-24 -10 L-14 34 Z M-12 34 L0 -28 L12 34 Z M14 34 L24 0 L34 34 Z" fill="#7c5cc4" ${O} stroke-width="2.5"/><path d="M0 -28 L4 34 H12 Z M-24 -10 L-20 34 H-14 Z" fill="#a98ae6" opacity=".7"/></g>
    ${compass}`;
  const xmasSea = `<g transform="translate(100 60)">
      ${[-58, -46, -34].map((x, k) => `<circle cx="${x}" cy="${-4 + k * 3}" r="1.6" fill="#ffe27a"/>`).join("")}
      <g transform="translate(-14 -6) scale(.42)">${sleigh.replace(/<\/?svg[^>]*>/g, "")}</g>
      <path d="M22 4 H40" stroke="#c9a06a" stroke-width="1.6"/>
      <g transform="translate(52 0)"><ellipse rx="13" ry="6" fill="#9c6a30" ${O} stroke-width="2"/><circle cx="14" cy="-8" r="5.5" fill="#9c6a30" ${O} stroke-width="2"/><circle cx="19" cy="-8" r="2" fill="#e8483f"/>
        <path d="M12 -13 l-3 -9 M12 -18 l-6 -2 M15 -13 l3 -9 M17 -19 l5 -2" stroke="#6b3f1d" stroke-width="2" stroke-linecap="round"/>
        <path d="M-8 5 l-5 7 M-2 5 l-2 8 M6 5 l3 8 M10 4 l6 6" stroke="#2b1d0e" stroke-width="2" stroke-linecap="round"/></g></g>
    ${moon(640, 58)}${[[580, 30], [690, 120], [540, 70]].map(([x, y]) => `<path d="${star5(x, y, 6, 2.5)}" fill="#ffe27a"/>`).join("")}
    <g transform="translate(54 628)"><path d="M-40 34 L-28 -6 L-10 -18 L8 -4 L22 -22 L40 34 Z" fill="#eaf6ff" ${O} stroke-width="2.5"/><path d="M-10 -18 L0 34 H-14 Z M22 -22 L26 34 H16 Z" fill="#bcdcf2"/>
      <g transform="translate(-4 4)"><ellipse rx="7" ry="10" fill="#222"/><ellipse cy="2" rx="4.5" ry="7" fill="#fff"/><circle cy="-10" r="5" fill="#222"/><path d="M3 -10 l5 1.5 -5 1.5 Z" fill="#ffb02e"/><circle cx="1.5" cy="-11" r="1" fill="#fff"/></g></g>
    ${compass}`;
  function sea(theme, water) {
    const sh = SHORE[theme]; if (!on || !sh) return "";
    const land = Array.from({ length: 49 }, (_, i) => i).filter(i => !water.includes(i));
    const blob = (pad, rx, fill, op) => `<g fill="${fill}"${op ? ` opacity="${op}"` : ""}>${land.map(i => { const r = i / 7 | 0, c = i % 7; return `<rect x="${c * 100 - pad}" y="${r * 100 - pad}" width="${100 + pad * 2}" height="${100 + pad * 2}" rx="${rx}"/>`; }).join("")}</g>`;
    const waves = Array.from({ length: 70 }, (_, k) => { const x = (k * 137) % 700, y = (k * 89) % 700; return `<path d="M${x} ${y} q8 -7 16 0 q8 -7 16 0" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2.2" stroke-linecap="round"/>`; }).join("");
    const deco = theme === "island" ? ship + serpent + compass + barrel : theme === "dragon" ? dragonSea : theme === "xmas" ? xmasSea : "";
    return `<svg class="sea" viewBox="-9 -9 718 718" preserveAspectRatio="none" aria-hidden="true">
      <rect x="-9" y="-9" width="718" height="718" style="fill:var(--sea)"/>
      <rect x="-9" y="-9" width="718" height="718" fill="url(#rgSea)"/>${waves}
      ${blob(30, 56, sh.shallow, theme === "island" ? ".45" : "")}${blob(13, 38, sh.foam, ".95")}${blob(6, 28, sh.rim)}${deco}</svg>`;
  }

  const ICONS = { kingdom: K, city: C, space: SP, northpole: N, island: I, dragon: D, xmas: X };
  const SCENES = { kingdom: kingdomScene, city: cityScene, space: spaceScene, northpole: northScene };
  const CARD = { kingdom: { "🔮": K.chance, "📜": K.quest }, city: { "🍀": C.chance, "⭐": C.quest }, space: { "🌠": SP.chance, "🛰️": SP.quest }, northpole: { "🎉": N.chance, "🧝": N.quest } };

  root.ART = {
    get on() { return on; },
    toggle() { on = !on; try { localStorage.setItem(KEY, JSON.stringify(on)); } catch (e) { } apply(); return on; },
    icon(theme, slot) { return on && ICONS[theme] && ICONS[theme][slot] || null; },
    sea,
    scene(theme) { return on && SCENES[theme] ? `<div class="scene">${SCENES[theme]}</div>` : ""; },
    card(theme, emoji) { return on && CARD[theme] && CARD[theme][emoji] || null; },
  };
})(window);
