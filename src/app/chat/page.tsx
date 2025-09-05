"use client";
import { useEffect, useRef, useState } from "react";
import { useAppStore } from "@/lib/store";
import { chatStream } from "@/lib/ai";

export default function ChatPage(){
  const chat = useAppStore(s => s.chat);
  const push = useAppStore(s => s.pushMessage);
  const patch = useAppStore(s => s.updateMessage);
  const clear = useAppStore(s => s.clearChat);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [useWeb, setUseWeb] = useState(true);
  const welcomed = useRef(false);

  useEffect(()=>{
    if (!welcomed.current && chat.length === 0) {
      push({ id: crypto.randomUUID(), role: "assistant",
        text: "Salut, je suis Rafik 👋. Dis-moi le PRODUIT, ton BUDGET (DH) et ta VILLE – je te propose 2–4 options.",
        ts: new Date().toISOString()
      });
      welcomed.current = true;
    }
  }, [chat.length, push]);

  async function send(){
    const t = text.trim(); if (!t || busy) return;
    setBusy(true);
    const userId = crypto.randomUUID();
    const asstId = crypto.randomUUID();
    push({ id: userId, role: "user", text: t, ts: new Date().toISOString() });
    push({ id: asstId, role: "assistant", text: "", ts: new Date().toISOString() });
    setText("");
    const history = chat.map(m => ({ role: m.role, text: m.text }));
    try {
      await chatStream(t, history, (delta) => {
        patch(asstId, (prev)=> (prev||"") + delta);
      }, useWeb);
    } catch (e:any) {
      patch(asstId, (prev)=> (prev||"") + "\n[Erreur stream] " + (e?.message||String(e)));
    } finally {
      setBusy(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement|HTMLTextAreaElement>){
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <main className="container py-6">
      <h1 className="text-2xl font-bold mb-2">Chat Rafik</h1>

      <div className="text-sm text-gray-300 mb-3">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={useWeb} onChange={e=>setUseWeb(e.target.checked)} />
          <span>🌐 Utiliser la recherche web</span>
        </label>
      </div>

      <div className="card p-4 h-[60vh] overflow-y-auto space-y-3">
        {chat.length===0 && <div className="text-gray-500">Chargement…</div>}
        {chat.map(m => (
          <div key={m.id} className={m.role==="user" ? "text-right" : "text-left"}>
            <div className={"inline-block whitespace-pre-wrap max-w-[80%] " + (m.role==="user" ? "bubble-user" : "bubble-ai")}>
              {m.text}
            </div>
            <div className="text-[10px] text-gray-500">{new Date(m.ts).toLocaleTimeString()}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          data-testid="chat-input"
          value={text}
          onChange={e=>setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={busy}
          className="flex-1 input"
          placeholder="Ex: TV 55&quot; 5000 dh Agadir"
        />
        <button
          data-testid="send-btn"
          onClick={send}
          disabled={busy}
          className="btn btn-primary"
          aria-label="Envoyer"
          title="Envoyer"
        >
          ➤
        </button>
      </div>
    </main>
  );
}
