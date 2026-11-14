// Roll On narrator voice: turns a line of text into speech with ElevenLabs.
// The ElevenLabs key stays here as a secret (ELEVENLABS_API_KEY), never in the web page.
// Every line is cached in the "narrator" storage bucket, so a repeated line costs nothing.
import { createClient } from "jsr:@supabase/supabase-js@2";

const KEY = Deno.env.get("ELEVENLABS_API_KEY") || "";
const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const OK_ORIGIN = /^(https:\/\/jimmywilson1979-arch\.github\.io|http:\/\/localhost(:\d+)?|http:\/\/127\.0\.0\.1(:\d+)?)$/;
const MODELS: Record<string, string> = { quick: "eleven_flash_v2_5", best: "eleven_multilingual_v2" };
const MAX_CHARS = 320;

const cors = (o: string) => ({
  "Access-Control-Allow-Origin": OK_ORIGIN.test(o) ? o : "https://jimmywilson1979-arch.github.io",
  "Access-Control-Allow-Headers": "content-type, authorization, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Vary": "Origin",
});
const json = (o: string, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors(o), "Content-Type": "application/json" } });

async function sha(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
}

let voiceCache: { at: number; list: unknown[] } | null = null;

Deno.serve(async (req) => {
  const origin = req.headers.get("origin") || "";
  if (req.method === "OPTIONS") return new Response(null, { headers: cors(origin) });
  if (origin && !OK_ORIGIN.test(origin)) return json(origin, { error: "not allowed" }, 403);
  const url = new URL(req.url);

  // GET ?status — is a key set up, and how much allowance is left
  if (req.method === "GET" && url.searchParams.has("status")) {
    if (!KEY) return json(origin, { ready: false, why: "no-key" });
    const r = await fetch("https://api.elevenlabs.io/v1/user/subscription", { headers: { "xi-api-key": KEY } });
    if (!r.ok) return json(origin, { ready: r.status !== 401, why: r.status === 401 ? "bad-key" : "unknown" });
    const s = await r.json();
    return json(origin, { ready: true, used: s.character_count, limit: s.character_limit, tier: s.tier, resets: s.next_character_count_reset_unix });
  }

  // GET ?voices — the voices on the account (ElevenLabs' ready-made ones plus any you add)
  if (req.method === "GET" && url.searchParams.has("voices")) {
    if (!KEY) return json(origin, { voices: [] });
    if (!voiceCache || Date.now() - voiceCache.at > 3600_000) {
      const r = await fetch("https://api.elevenlabs.io/v1/voices", { headers: { "xi-api-key": KEY } });
      if (!r.ok) return json(origin, { voices: [], error: r.status }, 502);
      const d = await r.json();
      voiceCache = { at: Date.now(), list: (d.voices || []).map((v: any) => ({ id: v.voice_id, name: v.name, accent: v.labels?.accent || "", gender: v.labels?.gender || "", age: v.labels?.age || "", about: v.labels?.description || v.labels?.descriptive || v.labels?.use_case || "", mine: v.category !== "premade" })) };
    }
    return json(origin, { voices: voiceCache.list });
  }

  // POST {text, voice, model} — speak a line (mp3)
  if (req.method === "POST") {
    let b: any; try { b = await req.json(); } catch { return json(origin, { error: "bad request" }, 400); }
    const text = String(b.text || "").trim().slice(0, MAX_CHARS);
    const voice = String(b.voice || "").replace(/[^A-Za-z0-9]/g, "").slice(0, 40);
    const model = MODELS[b.model] || MODELS.quick;
    if (!text || !voice) return json(origin, { error: "need text and voice" }, 400);
    const path = `${voice}/${model}/${await sha(text)}.mp3`;
    const hit = await sb.storage.from("narrator").download(path);
    if (hit.data) return new Response(hit.data, { headers: { ...cors(origin), "Content-Type": "audio/mpeg", "X-Cache": "hit" } });
    if (!KEY) return json(origin, { error: "no-key" }, 503);
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": KEY, "Content-Type": "application/json", "Accept": "audio/mpeg" },
      body: JSON.stringify({ text, model_id: model, voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.35, use_speaker_boost: true } }),
    });
    if (!r.ok) { const e = await r.text(); return json(origin, { error: "elevenlabs", status: r.status, detail: e.slice(0, 300) }, 502); }
    const mp3 = new Uint8Array(await r.arrayBuffer());
    await sb.storage.from("narrator").upload(path, mp3, { contentType: "audio/mpeg", upsert: true });
    return new Response(mp3, { headers: { ...cors(origin), "Content-Type": "audio/mpeg", "X-Cache": "miss" } });
  }
  return json(origin, { error: "not found" }, 404);
});
