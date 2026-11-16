// Roll On · "Join QR" pop-up, shared by every game.
// Shows a big QR code and the 4-letter code so anyone who dropped out (or a late
// arrival) can scan back in. On the TV it's the 📱 Join QR button; on the host's
// phone it's in ⚙️ Host controls, so others can scan the host's screen.
window.joinQR = function (code) {
  const old = document.getElementById("joinqr-pop"); if (old) old.remove();
  const local = /[?&]local=1/.test(location.search) ? "&local=1" : "";
  const url = location.origin + location.pathname + "?join=" + code + local;
  const d = document.createElement("div"); d.id = "joinqr-pop";
  d.style.cssText = "position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.72);display:flex;align-items:center;justify-content:center;padding:4vmin";
  d.innerHTML = `<div style="background:#fffaf0;color:#2b1d12;border-radius:24px;padding:4vmin;text-align:center;max-width:92vw;font-family:Nunito,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.5)">
    <div style="font-weight:900;font-size:min(5vmin,1.6rem)">📱 Scan to join or get back in</div>
    <div id="joinqr-box" style="background:#fff;padding:2vmin;border-radius:14px;display:inline-block;margin:2.5vmin 0"></div>
    <div style="font-weight:800;font-size:min(3.6vmin,1.1rem)">Or open the game and type the code <b style="letter-spacing:.15em;font-size:1.4em">${code}</b></div>
    <div style="font-weight:700;opacity:.75;font-size:min(3vmin,.95rem);margin-top:1vmin">Dropped out? Join with the <b>same name</b> to get your place back.</div>
    <button style="margin-top:2.5vmin;font:inherit;font-weight:900;font-size:min(3.6vmin,1.1rem);padding:.7em 2em;border-radius:14px;border:0;background:#ffc94a;color:#2a1b00;cursor:pointer">Close</button></div>`;
  document.body.appendChild(d);
  const size = Math.round(Math.min(innerWidth, innerHeight) * .5);
  try { new QRCode(document.getElementById("joinqr-box"), { text: url, width: 400, height: 400, correctLevel: QRCode.CorrectLevel.M }); const b = document.getElementById("joinqr-box"); b.querySelectorAll("img,canvas").forEach(e => { e.style.width = e.style.height = size + "px"; e.style.display = "block"; }); }
  catch (e) { document.getElementById("joinqr-box").textContent = url; }
  d.onclick = e => { if (e.target === d || e.target.tagName === "BUTTON") d.remove(); };
};
