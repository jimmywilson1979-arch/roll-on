// =====================================================================
// Roll On · Mystery: storybook art (hand-drawn SVG, same style as art.js).
// Uses art.js for the shared gradients and the 🎨 Storybook / Classic switch.
// MART.icon(id) → svg for suspects (s0..), rooms (r0..), things (i0..),
// hiding spots ("r:k"), and "key", "mag", "dust", "cake", "env".
// =====================================================================
(function (root) {
  const O = `stroke="#2b1d0e" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const T = `stroke="#2b1d0e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
  const svg = b => `<svg class="art" viewBox="0 0 100 100" aria-hidden="true">${b}</svg>`;
  const shadow = (w = 36) => `<ellipse cx="50" cy="92" rx="${w}" ry="4.5" fill="#000" opacity=".15"/>`;

  // ---------- suspects: portrait busts ----------
  const eyes = (y = 50, g) => g ? `<circle cx="41" cy="${y}" r="7" fill="#fff" fill-opacity=".5" ${T}/><circle cx="59" cy="${y}" r="7" fill="#fff" fill-opacity=".5" ${T}/><path d="M48 ${y} h4" ${T}/><circle cx="41" cy="${y}" r="2.2" fill="#2b1d0e"/><circle cx="59" cy="${y}" r="2.2" fill="#2b1d0e"/>` : `<circle cx="41" cy="${y}" r="2.6" fill="#2b1d0e"/><circle cx="59" cy="${y}" r="2.6" fill="#2b1d0e"/><circle cx="42" cy="${y - 1}" r=".9" fill="#fff"/><circle cx="60" cy="${y - 1}" r=".9" fill="#fff"/>`;
  const cheeks = `<circle cx="35" cy="60" r="4" fill="#ff8f8f" opacity=".45"/><circle cx="65" cy="60" r="4" fill="#ff8f8f" opacity=".45"/>`;
  const body = (c) => `<path d="M18 100 Q18 76 50 74 Q82 76 82 100 Z" fill="${c}" ${O}/>`;
  const head = (skin = "#f6cfa6") => `<ellipse cx="50" cy="52" rx="21" ry="23" fill="${skin}" ${O}/>`;
  const S = {
    s0: svg(`${body("#e07aa8")}<path d="M40 76 L50 88 L60 76" fill="none" ${T}/>${head()}
      <path d="M29 50 Q28 28 50 27 Q72 28 71 50 Q66 36 50 36 Q34 36 29 50 Z" fill="#e9e6e0" ${O}/><circle cx="50" cy="22" r="9" fill="#e9e6e0" ${O}/>
      ${eyes(51, 1)}${cheeks}<path d="M43 63 Q50 68 57 63" fill="none" ${T}/>`),
    s1: svg(`${body("#3f8f5a")}<path d="M38 77 h24" ${T}/>${head("#f2c39a")}
      <path d="M29 48 Q27 40 31 38 M71 48 Q73 40 69 38" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>
      <ellipse cx="44" cy="34" rx="7" ry="3" fill="#fff" opacity=".45"/>${eyes(50)}${cheeks}
      <path d="M36 61 Q43 55 50 60 Q57 55 64 61 Q57 65 50 62 Q43 65 36 61 Z" fill="#6b4a2a" ${T}/>`),
    s2: svg(`<path d="M26 54 Q22 84 30 92 L70 92 Q78 84 74 54 Z" fill="#8a4b22" ${O}/>${body("#8a5cc7")}${head()}
      <path d="M28 54 Q26 26 50 26 Q74 26 72 54 Q66 34 52 36 Q40 40 28 54 Z" fill="#8a4b22" ${O}/>
      <circle cx="29" cy="60" r="3" fill="url(#lgGold)" ${T}/><circle cx="71" cy="60" r="3" fill="url(#lgGold)" ${T}/>
      ${eyes(51)}<path d="M37 46 l4 -2 M63 46 l-4 -2" ${T}/>${cheeks}<path d="M44 62 Q50 67 56 62 Q50 64 44 62 Z" fill="#d6304a" ${T}/>`),
    s3: svg(`${body("#2f80c1")}<path d="M43 80 h14" stroke="#fff" stroke-width="3"/>${head()}
      <path d="M29 46 L33 28 L39 38 L44 24 L50 36 L56 23 L61 37 L67 27 L71 46 Q60 38 50 39 Q40 38 29 46 Z" fill="#e8742a" ${O}/>
      ${eyes(52)}${[[38, 58], [42, 60], [58, 60], [62, 58]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="#b0603a"/>`).join("")}<path d="M42 63 Q50 71 58 63 Z" fill="#fff" ${T}/>`),
    s4: svg(`${body("#c0392b")}<circle cx="50" cy="80" r="4" fill="url(#lgGold)" ${T}/>
      <ellipse cx="50" cy="54" rx="22" ry="21" fill="#c48a4a" ${O}/><path d="M28 40 Q16 52 22 70 Q32 62 32 48 Z M72 40 Q84 52 78 70 Q68 62 68 48 Z" fill="#7a4a22" ${O}/>
      <ellipse cx="50" cy="64" rx="12" ry="9" fill="#f1dcc0" ${O} stroke-width="2.5"/><ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#2b1d0e"/>
      ${eyes(48)}<path d="M46 70 Q50 82 54 70 Z" fill="#ff7a8a" ${T}/>`),
    s5: svg(`${body("#f4c430")}
      <path d="M30 40 L32 18 L46 32 Z M70 40 L68 18 L54 32 Z" fill="#9aa0a8" ${O}/><path d="M34 34 L35 24 L42 31 Z M66 34 L65 24 L58 31 Z" fill="#ffb3c1"/>
      <ellipse cx="50" cy="52" rx="23" ry="21" fill="#9aa0a8" ${O}/><path d="M42 36 l2 6 M50 34 v7 M58 36 l-2 6" stroke="#5f656e" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="41" cy="50" rx="4" ry="5" fill="#9be15d" ${T}/><ellipse cx="59" cy="50" rx="4" ry="5" fill="#9be15d" ${T}/><path d="M41 47 v6 M59 47 v6" stroke="#2b1d0e" stroke-width="2"/>
      <path d="M47 58 L53 58 L50 61 Z" fill="#ff8fa3" ${T}/><path d="M50 61 Q46 66 43 63 M50 61 Q54 66 57 63" fill="none" ${T}/>
      <path d="M24 56 L40 59 M24 63 L40 62 M76 56 L60 59 M76 63 L60 62" stroke="#2b1d0e" stroke-width="1.5"/>`),
  };

  // ---------- things ----------
  const Ic = {
    i0: svg(`${shadow(30)}<path d="M28 86 L60 46" stroke="#2b1d0e" stroke-width="11" stroke-linecap="round"/><path d="M28 86 L60 46" stroke="url(#lgSilver)" stroke-width="7" stroke-linecap="round"/>
      <ellipse cx="68" cy="34" rx="15" ry="21" transform="rotate(38 68 34)" fill="url(#lgSilver)" ${O}/><ellipse cx="66" cy="31" rx="6" ry="10" transform="rotate(38 66 31)" fill="#fff" opacity=".7"/>
      <path d="M58 40 q6 -2 10 4" fill="none" stroke="#6b3a1e" stroke-width="3" stroke-linecap="round"/>`),
    i1: svg(`${shadow(28)}<path d="M30 90 Q26 66 30 52 L28 30 Q28 24 34 24 Q39 24 39 30 L40 48 L41 20 Q41 14 47 14 Q53 14 53 20 L53 46 L55 22 Q55 16 61 16 Q67 16 67 22 L66 48 L69 32 Q70 26 76 27 Q81 28 80 34 L76 64 Q74 82 62 90 Z" fill="#f6cfa6" ${O}/>
      ${[[34, 30], [47, 20], [61, 22], [75, 33]].map(([x, y]) => `<path d="M${x - 3} ${y} q3 -3 6 0" fill="none" stroke="#6b3a1e" stroke-width="3" stroke-linecap="round"/>`).join("")}`),
    i2: svg(`${shadow(28)}<path d="M30 88 L56 50" stroke="#2b1d0e" stroke-width="11" stroke-linecap="round"/><path d="M30 88 L56 50" stroke="url(#lgSilver)" stroke-width="7" stroke-linecap="round"/>
      <path d="M50 54 L60 40 Q64 34 72 38 L80 44 Q84 50 78 54 L66 62 Z" fill="url(#lgSilver)" ${O}/>
      ${[[64, 36, 70, 18], [70, 39, 78, 22], [75, 43, 85, 28], [79, 47, 90, 34]].map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="#2b1d0e" stroke-width="6" stroke-linecap="round"/><path d="M${a} ${b} L${c} ${d}" stroke="#eef1f6" stroke-width="2.5" stroke-linecap="round"/>`).join("")}`),
    i3: svg(`${shadow(28)}<path d="M26 88 L52 58" stroke="#2b1d0e" stroke-width="14" stroke-linecap="round"/><path d="M26 88 L52 58" stroke="#d6304a" stroke-width="9" stroke-linecap="round"/>
      <path d="M52 58 L58 52" stroke="#2b1d0e" stroke-width="6"/><circle cx="66" cy="40" r="16" fill="url(#lgSilver)" ${O}/>
      <circle cx="68" cy="36" r="13" fill="#ffb3c8" ${O}/><circle cx="64" cy="31" r="4" fill="#fff" opacity=".7"/><circle cx="72" cy="38" r="1.5" fill="#7a3b1e"/><circle cx="66" cy="42" r="1.5" fill="#7a3b1e"/>`),
    i4: svg(`${shadow(26)}${[[26, 88, 70, 14], [38, 90, 82, 20]].map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}" stroke="#2b1d0e" stroke-width="10" stroke-linecap="round"/><path d="M${a} ${b} L${c} ${d}" stroke="#d9a35e" stroke-width="6" stroke-linecap="round"/><path d="M${a} ${b} L${a + (c - a) * .28} ${b + (d - b) * .28}" stroke="#c4162a" stroke-width="6" stroke-linecap="round"/>`).join("")}`),
    i5: svg(`${shadow(40)}<rect x="14" y="62" width="56" height="16" rx="8" fill="#555" ${O}/>${[24, 42, 60].map(x => `<circle cx="${x}" cy="76" r="9" fill="#333" ${O}/><circle cx="${x}" cy="76" r="3" fill="#bbb"/>`).join("")}
      <rect x="18" y="40" width="34" height="24" rx="3" fill="#f4c430" ${O}/><rect x="24" y="44" width="14" height="12" rx="2" fill="url(#lgGlass)" ${T}/>
      <path d="M52 50 L74 30 L80 36 L60 56 Z" fill="#f4c430" ${O}/><path d="M74 30 L90 44 L82 58 Q70 58 70 46 Z" fill="#e2a52a" ${O}/><path d="M76 44 q4 6 10 4" fill="none" stroke="#6b3a1e" stroke-width="3"/>`),
  };

  // ---------- rooms ----------
  const R = {
    r0: svg(`${shadow(38)}<rect x="16" y="34" width="68" height="56" rx="4" fill="#f4f1ea" ${O}/><rect x="16" y="34" width="68" height="14" rx="4" fill="#d9d4c8" ${O}/>
      ${[30, 44, 58, 72].map(x => `<circle cx="${x}" cy="41" r="3.2" fill="#2b1d0e"/>`).join("")}<rect x="24" y="56" width="52" height="26" rx="3" fill="#3a3a3a" ${O}/><rect x="28" y="60" width="44" height="16" rx="2" fill="#ffb02e" opacity=".55"/>
      <path d="M30 34 V24 H50 V34" fill="#9aa0a8" ${O}/><path d="M50 26 h10" ${O}/><path d="M34 18 q2 -6 0 -10 M42 18 q2 -6 0 -10" fill="none" stroke="#aaa" stroke-width="2.5" stroke-linecap="round"/>`),
    r1: svg(`${shadow(42)}<rect x="12" y="36" width="76" height="30" rx="10" fill="#3f7fc4" ${O}/><rect x="8" y="52" width="18" height="30" rx="7" fill="#346aa6" ${O}/><rect x="74" y="52" width="18" height="30" rx="7" fill="#346aa6" ${O}/>
      <rect x="22" y="58" width="56" height="20" rx="5" fill="#4a90d9" ${O}/><path d="M50 58 v20" ${T}/><path d="M16 82 v8 M84 82 v8" ${O}/>
      <rect x="24" y="40" width="14" height="14" rx="4" fill="#f4c430" transform="rotate(-10 31 47)" ${T}/>`),
    r2: svg(`<path d="M0 78 Q50 70 100 78 V100 H0 Z" fill="#5fb05a" ${O}/>${[8, 22, 36, 64, 78, 92].map(x => `<rect x="${x - 4}" y="56" width="8" height="26" fill="#f1e2b8" ${T}/><path d="M${x - 4} 56 l4 -6 l4 6" fill="#f1e2b8" ${T}/>`).join("")}<path d="M0 64 H100 M0 74 H100" ${T}/>
      <rect x="45" y="46" width="10" height="34" fill="url(#lgWood)" ${O}/><circle cx="50" cy="32" r="22" fill="url(#lgPine)" ${O}/><circle cx="40" cy="26" r="4" fill="#e2382f" ${T}/><circle cx="58" cy="36" r="4" fill="#e2382f" ${T}/><circle cx="52" cy="20" r="4" fill="#e2382f" ${T}/>`),
    r3: svg(`${shadow(42)}<rect x="10" y="26" width="16" height="64" rx="4" fill="url(#lgWood)" ${O}/><rect x="10" y="56" width="80" height="22" rx="4" fill="#fff" ${O}/>
      <rect x="40" y="50" width="52" height="30" rx="6" fill="#e07aa8" ${O}/>${[52, 64, 76].map(x => `<circle cx="${x}" cy="62" r="2.5" fill="#fff"/>`).join("")}
      <rect x="24" y="46" width="18" height="12" rx="5" fill="#fff" ${O}/><path d="M86 78 v12" ${O}/>`),
    r4: svg(`${shadow(30)}<rect x="28" y="12" width="44" height="80" rx="3" fill="url(#lgWood)" ${O}/><rect x="34" y="18" width="32" height="30" rx="2" fill="none" ${T}/><rect x="34" y="54" width="32" height="32" rx="2" fill="none" ${T}/>
      <circle cx="64" cy="54" r="3.5" fill="url(#lgGold)" ${T}/><rect x="44" y="8" width="12" height="6" rx="2" fill="url(#lgGold)" ${T}/><rect x="16" y="88" width="68" height="6" rx="2" fill="#c0392b" ${T}/>`),
    r5: svg(`${shadow(40)}<rect x="10" y="56" width="80" height="10" fill="url(#lgWood)" ${O}/><path d="M16 66 V92 M84 66 V92" ${O}/>
      ${[[18, "#c0392b", 30], [26, "#2f80c1", 34], [34, "#3f8f5a", 28], [42, "#f4c430", 32]].map(([x, c, h]) => `<rect x="${x}" y="${56 - h}" width="8" height="${h}" rx="1" fill="${c}" ${T}/>`).join("")}
      <path d="M70 56 L66 34 L58 30" fill="none" ${O}/><path d="M52 30 L66 22 L72 32 Z" fill="#3f8f5a" ${O}/><path d="M56 32 L66 50" stroke="#ffe08a" stroke-width="8" opacity=".55" stroke-linecap="round"/><rect x="62" y="52" width="16" height="4" fill="#2b1d0e"/>`),
  };

  // ---------- hiding spots ----------
  const P = {
    "0:0": svg(`${shadow(28)}<rect x="24" y="8" width="52" height="84" rx="6" fill="#eef4f7" ${O}/><path d="M24 40 H76" ${O}/><path d="M66 18 v14 M66 50 v20" stroke="#9aa0a8" stroke-width="4" stroke-linecap="round"/><rect x="34" y="50" width="12" height="9" fill="#f4c430" transform="rotate(-8 40 54)" ${T}/><circle cx="40" cy="24" r="4" fill="#e2382f" ${T}/>`),
    "0:1": svg(`${shadow(36)}<rect x="16" y="14" width="68" height="78" rx="5" fill="#d9d4c8" ${O}/><rect x="22" y="36" width="56" height="44" rx="4" fill="#3a3a3a" ${O}/><path d="M26 44 h48 M26 62 h48" stroke="#ffb02e" stroke-width="2.5"/><path d="M28 72 q22 -10 44 0" fill="none" stroke="#ff5a1f" stroke-width="3"/>${[28, 42, 58, 72].map(x => `<circle cx="${x}" cy="25" r="3.5" fill="#2b1d0e"/>`).join("")}`),
    "0:2": svg(`${shadow(26)}<path d="M28 34 L34 92 H66 L72 34 Z" fill="#7d8a96" ${O}/><rect x="24" y="24" width="52" height="12" rx="3" fill="#9aa5b1" ${O}/><path d="M44 24 q6 -8 12 0" fill="none" ${O}/><path d="M42 46 V82 M50 46 V82 M58 46 V82" stroke="#5c6670" stroke-width="2.5"/><path d="M60 24 q8 -14 18 -6" fill="none" stroke="#6b3a1e" stroke-width="3"/>`),
    "1:0": R.r1,
    "1:1": svg(`${shadow(34)}<rect x="18" y="8" width="64" height="84" rx="3" fill="url(#lgWood)" ${O}/>${[30, 56].map(y => `<path d="M22 ${y} H78" ${O}/>`).join("")}${[[24, "#c0392b"], [32, "#2f80c1"], [40, "#3f8f5a"], [50, "#f4c430"], [58, "#8a5cc7"]].map(([x, c], k) => `<rect x="${x}" y="${12 + (k % 2) * 2}" width="7" height="${16 - (k % 2) * 2}" fill="${c}" ${T}/><rect x="${x + 4}" y="${36 + (k % 3)}" width="7" height="${18 - (k % 3)}" fill="${c}" ${T}/><rect x="${x}" y="${62}" width="7" height="${26}" fill="${c}" ${T}/>`).join("")}`),
    "1:2": svg(`${shadow(24)}<path d="M30 60 L36 92 H64 L70 60 Z" fill="#c8693a" ${O}/><rect x="26" y="54" width="48" height="10" rx="3" fill="#b4582c" ${O}/>${["M50 54 Q30 40 22 20 Q42 26 50 54", "M50 54 Q70 36 82 22 Q62 26 50 54", "M50 54 Q46 30 52 8 Q60 30 50 54"].map(d => `<path d="${d}" fill="#3fae5a" ${O} stroke-width="2.5"/>`).join("")}`),
    "2:0": svg(`${shadow(40)}<path d="M14 46 L50 18 L86 46 Z" fill="url(#lgRoof)" ${O}/><rect x="20" y="44" width="60" height="48" fill="url(#lgWood)" ${O}/><path d="M28 44 V92 M40 44 V92 M60 44 V92 M72 44 V92" stroke="#7a4a22" stroke-width="2"/><rect x="42" y="58" width="16" height="34" fill="#5a3a1e" ${O}/><circle cx="55" cy="76" r="2" fill="url(#lgGold)"/>`),
    "2:1": svg(`<path d="M6 78 Q50 66 94 78 V94 H6 Z" fill="#7a4a22" ${O}/>${[[20, "#e2382f"], [38, "#f4c430"], [56, "#e07aa8"], [74, "#8a5cc7"]].map(([x, c]) => `<path d="M${x} 78 V50" stroke="#2f7a3a" stroke-width="4"/><path d="M${x} 66 q-8 -4 -8 -10 q6 2 8 8" fill="#3fae5a" ${T}/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${42}" rx="5" ry="8" transform="rotate(${a} ${x} 50)" fill="${c}" ${T}/>`).join("")}<circle cx="${x}" cy="50" r="4" fill="#f4c430" ${T}/>`).join("")}`),
    "2:2": svg(`${shadow(38)}<path d="M14 50 L50 18 L86 50 Z" fill="#c0392b" ${O}/><rect x="20" y="48" width="60" height="44" fill="url(#lgWood)" ${O}/><path d="M38 92 V70 Q50 56 62 70 V92 Z" fill="#2b1d0e"/><rect x="38" y="36" width="24" height="9" rx="2" fill="#f1e2b8" ${T}/><path d="M42 41 h16" stroke="#2b1d0e" stroke-width="2"/><ellipse cx="72" cy="88" rx="10" ry="4" fill="#d6304a" ${T}/>`),
    "3:0": R.r3,
    "3:1": svg(`${shadow(34)}<rect x="20" y="6" width="60" height="86" rx="4" fill="url(#lgWood)" ${O}/><path d="M50 6 V92" ${O}/><circle cx="45" cy="50" r="3" fill="url(#lgGold)" ${T}/><circle cx="55" cy="50" r="3" fill="url(#lgGold)" ${T}/><path d="M24 92 v4 M76 92 v4" ${O}/><path d="M80 30 l8 4 l-8 4" fill="#2f80c1" ${T}/>`),
    "3:2": svg(`${shadow(38)}<rect x="14" y="44" width="72" height="46" rx="4" fill="#e2382f" ${O}/><path d="M14 58 H86" ${O}/>${[[26, "#f4c430"], [50, "#2f80c1"], [74, "#3fae5a"]].map(([x, c]) => `<circle cx="${x}" cy="74" r="6" fill="${c}" ${T}/>`).join("")}<path d="M12 46 L22 24 L88 26 L86 46" fill="#c4162a" ${O}/><circle cx="62" cy="38" r="9" fill="#c48a4a" ${O}/><circle cx="56" cy="31" r="4" fill="#c48a4a" ${T}/><circle cx="68" cy="31" r="4" fill="#c48a4a" ${T}/><circle cx="59" cy="38" r="1.5" fill="#2b1d0e"/><circle cx="65" cy="38" r="1.5" fill="#2b1d0e"/>`),
    "4:0": svg(`${shadow(24)}<path d="M50 14 V90" stroke="#2b1d0e" stroke-width="9" stroke-linecap="round"/><path d="M50 14 V90" stroke="#a86b30" stroke-width="5" stroke-linecap="round"/><path d="M36 92 H64" ${O}/><path d="M50 22 L34 30 M50 22 L66 30" ${O}/>
      <path d="M32 30 Q22 46 26 70 L40 70 Q44 46 36 30 Z" fill="#2f80c1" ${O}/><path d="M66 30 Q78 40 76 58 L64 58 Q60 42 64 30 Z" fill="#c0392b" ${O}/><path d="M44 12 Q50 2 56 12 Z" fill="#f4c430" ${T}/>`),
    "4:1": svg(`${shadow(42)}<path d="M8 80 Q8 64 22 64 L40 70 Q46 74 46 82 L46 88 H8 Z" fill="#e2382f" ${O}/><path d="M8 84 H46" stroke="#fff" stroke-width="3"/><path d="M52 76 Q52 58 66 60 L86 70 Q92 74 92 82 L92 88 H52 Z" fill="#2f80c1" ${O}/><path d="M52 84 H92" stroke="#fff" stroke-width="3"/><path d="M60 64 l6 4 M66 62 l6 4" ${T}/>`),
    "4:2": svg(`<rect x="10" y="58" width="80" height="28" rx="4" fill="#a86b30" ${O}/><rect x="16" y="63" width="68" height="18" rx="2" fill="none" stroke="#7a4a22" stroke-width="2" stroke-dasharray="4 3"/><text x="50" y="77" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="12" fill="#5a3a1e">WELCOME</text><path d="M30 56 q4 -6 10 -2 q6 -6 12 0" fill="none" stroke="#6b4a2a" stroke-width="3" stroke-linecap="round"/>`),
    "5:0": R.r5,
    "5:1": svg(`${shadow(28)}<rect x="24" y="8" width="52" height="84" rx="3" fill="url(#lgStone)" ${O}/>${[10, 38, 66].map(y => `<rect x="30" y="${y + 4}" width="40" height="22" rx="2" fill="#d6cfbf" ${O}/><rect x="42" y="${y + 12}" width="16" height="5" rx="2" fill="url(#lgGold)" ${T}/>`).join("")}<path d="M66 40 l6 -8 l4 4" fill="#fff" ${T}/>`),
    "5:2": svg(`${shadow(26)}<path d="M50 74 V88 M36 92 H64" ${O}/><path d="M24 50 A28 28 0 0 0 76 50" fill="none" stroke="url(#lgGold)" stroke-width="6"/><circle cx="50" cy="44" r="24" fill="#4aa3df" ${O}/>
      <path d="M36 32 Q44 26 50 34 Q46 42 40 40 Z M54 48 Q64 44 66 54 Q58 62 52 56 Z M40 52 q4 4 2 8" fill="#3fae5a" ${T}/>`),
  };
  const X = {
    key: svg(`${shadow(30)}<circle cx="30" cy="50" r="16" fill="url(#lgGold)" ${O}/><circle cx="30" cy="50" r="6" fill="#fbf3e0" ${T}/><path d="M46 50 H88 V62 M76 50 V60" fill="none" stroke="#2b1d0e" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M46 50 H88 V62 M76 50 V60" fill="none" stroke="#e0b23e" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`),
    mag: svg(`${shadow(30)}<path d="M60 60 L86 86" stroke="#2b1d0e" stroke-width="14" stroke-linecap="round"/><path d="M60 60 L86 86" stroke="url(#lgWood)" stroke-width="9" stroke-linecap="round"/><circle cx="42" cy="42" r="26" fill="url(#lgGlass)" fill-opacity=".7" stroke="#2b1d0e" stroke-width="9"/><circle cx="42" cy="42" r="26" fill="none" stroke="url(#lgGold)" stroke-width="5"/><path d="M28 32 Q34 22 46 22" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),
    dust: svg(`<g fill="none" stroke="#6b5a4a" stroke-width="2">${[0, 30, 60, 90, 120, 150].map(a => `<path d="M50 50 L${50 + 44 * Math.cos(a * Math.PI / 90)} ${50 + 44 * Math.sin(a * Math.PI / 90)}"/>`).join("")}${[14, 26, 38].map(r => `<circle cx="50" cy="50" r="${r}" stroke-dasharray="3 3"/>`).join("")}</g><circle cx="62" cy="62" r="6" fill="#2b1d0e"/><path d="M56 58 l-6 -4 M56 64 l-7 2 M68 58 l6 -4 M68 64 l7 2" stroke="#2b1d0e" stroke-width="2" stroke-linecap="round"/>`),
    cake: svg(`${shadow(40)}<rect x="16" y="54" width="68" height="34" rx="6" fill="#8a4b22" ${O}/><path d="M16 64 Q26 72 34 64 T50 64 T66 64 T84 64 V58 H16 Z" fill="#fff3e0" ${T}/><rect x="16" y="40" width="68" height="18" rx="6" fill="#ffb3c8" ${O}/>
      ${[30, 50, 70].map(x => `<rect x="${x - 3}" y="22" width="6" height="18" fill="#7df9ff" ${T}/><path d="M${x} 20 q-4 -6 0 -12 q4 6 0 12 Z" fill="url(#lgFlame)" ${T}/>`).join("")}
      <path d="M70 40 L84 54 L84 40 Z" fill="#fbf3e0" ${T}/><circle cx="40" cy="48" r="2" fill="#e2382f"/><circle cx="60" cy="46" r="2" fill="#2f80c1"/>`),
    env: svg(`${shadow(40)}<rect x="12" y="26" width="76" height="52" rx="4" fill="#f1dca6" ${O}/><path d="M12 30 L50 58 L88 30" fill="none" ${O}/><circle cx="50" cy="58" r="9" fill="#c4162a" ${O}/><text x="50" y="62" text-anchor="middle" font-family="Georgia,serif" font-size="11" font-weight="700" fill="#fff">?</text>`),
  };
  const ALL = Object.assign({}, S, Ic, R, X, Object.fromEntries(Object.entries(P).map(([k, v]) => ["spot" + k, v])));
  // Painted artwork (made with Gemini) for "Who ate the cake?". Falls back to the drawings above.
  const D = "img/mystery/";
  const IMG = {
    r0: "room-kitchen.jpg", r1: "room-lounge.jpg", r2: "room-garden.jpg", r3: "room-bedroom.jpg", r4: "room-hallway.jpg", r5: "room-study.jpg",
    s0: "suspect-grandma.jpg", s1: "suspect-bob.jpg", s2: "suspect-sue.jpg", s3: "suspect-max.jpg", s4: "suspect-rex.jpg", s5: "suspect-whiskers.jpg",
    i0: "item-spoon.png", i1: "item-hand.png", i2: "item-fork.png", i3: "item-scoop.png", i4: "item-chopsticks.png", i5: "item-digger.png",
    key: "extra-key.png", mag: "extra-mag.png", cake: "extra-cake.png", back: "extra-cardback.jpg", table: "background.jpg",
  };
  // where each hiding spot is on its room picture (% across, % down)
  const SPOTS = {
    r0: [[49, 17], [15, 46], [17, 80]], r1: [[47, 22], [87, 52], [17, 76]], r2: [[78, 24], [24, 74], [25, 30]],
    r3: [[37, 24], [85, 52], [22, 74]], r4: [[16, 52], [30, 74], [50, 40]], r5: [[52, 24], [76, 26], [18, 77]],
  };
  // warm the cache so pictures appear straight away
  if (typeof Image !== "undefined") setTimeout(() => Object.values(IMG).forEach(f => { const i = new Image(); i.src = D + f; }), 300);
  root.MART = {
    get on() { return !!(root.ART && root.ART.on); },
    img(id) { return this.on && IMG[id] ? D + IMG[id] : null; },
    spots(r) { return SPOTS["r" + r]; },
    icon(id) {
      if (!this.on) return null;
      if (IMG[id]) return `<img class="pic pic-${id[0] === "s" ? "s" : id[0] === "r" ? "r" : "i"}" src="${D + IMG[id]}" alt="" draggable="false">`;
      return ALL[id] || null;
    },
  };
})(window);
