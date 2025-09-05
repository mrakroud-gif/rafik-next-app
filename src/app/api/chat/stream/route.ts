import type { NextRequest } from "next/server";

const SYS_PROMPT = `Tu t'appelles Rafik, assistant shopping marocain (FR/AR/EN).
- Réponds dans la langue de l'utilisateur.
- Si un des 3 manque (produit, budget en DH/MAD, ville), demande-le poliment UNE seule fois.
- Donne 2–4 options concrètes, prix en DH, et un rappel: "prix indicatifs".
- Pas de collecte de carte/CB/CVV/mot de passe.
- Ne promets pas d'achat/livraison; redirige vers vendeurs fiables si on te le demande.
- Ton style est bref, utile, empathique.`;

type Msg = { role: "system"|"user"|"assistant"; content: string };
type HistoryMsg = { role: "user"|"assistant"; text: string };

async function tryOllama(messages: Msg[], ctrl: ReadableStreamDefaultController, enc: TextEncoder){
  const host = process.env.OLLAMA_HOST || "http://127.0.0.1:11434";
  const model = process.env.OLLAMA_MODEL || "llama3.2:3b";

  try{
    const res = await fetch(`${host}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, messages, stream: true, options: { temperature: 0.2 } }),
    });
    if (!res.ok || !res.body) return false;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, nl).trim();
        buf = buf.slice(nl + 1);
        if (!line) continue;
        try {
          const j = JSON.parse(line);
          const chunk = j?.message?.content;
          if (chunk) ctrl.enqueue(enc.encode(chunk));
          if (j?.done) return true;
        } catch {}
      }
    }
    return true;
  } catch { return false; }
}

async function tryOpenAI(messages: Msg[], ctrl: ReadableStreamDefaultController, enc: TextEncoder){
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  if (!key) return false;

  try{
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, temperature: 0.2, stream: true, messages }),
    });
    if (!res.ok || !res.body) return false;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const raw of lines) {
        const line = raw.trim();
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (payload === "[DONE]") return true;
        try {
          const j = JSON.parse(payload);
          const delta = j?.choices?.[0]?.delta?.content;
          if (delta) ctrl.enqueue(enc.encode(delta));
        } catch {}
      }
    }
    return true;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=> ({}));
  const text: string = (body?.text || "").toString();
  const history: HistoryMsg[] = Array.isArray(body?.history) ? body.history : [];

  if (!text.trim()) {
    return new Response("Dis-moi produit + budget (DH) + ville 😊", { status: 200 });
  }

  const msgs: Msg[] = [
    { role: "system", content: SYS_PROMPT },
    ...history.slice(-8).map(m => ({ role: m.role, content: (m.text||"").toString().slice(0,4000) }) as Msg),
    { role: "user", content: text.slice(0,4000) },
  ];

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    start: async (controller) => {
      try {
        if (await tryOllama(msgs, controller, enc)) { controller.close(); return; }
        if (await tryOpenAI(msgs, controller, enc)) { controller.close(); return; }

        // Fallback ultra-simple si aucun modèle dispo
        controller.enqueue(enc.encode(
          "Salut, je suis Rafik. Dis-moi le produit, le budget (DH) et la ville, et je te propose 2–4 options."
        ));
      } catch (e:any) {
        controller.enqueue(enc.encode("[Erreur] " + (e?.message || String(e))));
      } finally {
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
