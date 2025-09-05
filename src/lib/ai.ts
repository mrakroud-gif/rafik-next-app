export type SimpleMsg = { role: "user" | "assistant"; text: string };

export async function chatStream(
  text: string,
  history: SimpleMsg[],
  onChunk: (t: string) => void
): Promise<void> {
  const res = await fetch("/api/chat/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, history }),
  });
  if (!res.ok || !res.body) throw new Error("stream http " + res.status);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    onChunk(dec.decode(value, { stream: true }));
  }
}
