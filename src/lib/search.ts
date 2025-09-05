export type WebHit = { title: string; url: string; snippet: string };
export type WebSearchResult = { hits: WebHit[] };

const PROVIDER = process.env.SEARCH_PROVIDER ?? "tavily";
const GL = process.env.SEARCH_GL ?? "ma";
const HL = process.env.SEARCH_HL ?? "fr";

async function searchTavily(q: string): Promise<WebSearchResult> {
  const key = process.env.TAVILY_API_KEY;
  if (!key) return { hits: [] };
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      query: q,
      search_depth: "basic",
      max_results: 6,
      include_answer: false,
      include_images: false,
      include_domains: []
    })
  }).catch(() => null);
  if (!res) return { hits: [] };
  const data: any = await res.json().catch(() => ({}));
  const hits: WebHit[] = (data.results || []).map((r: any) => ({
    title: r.title || r.url || "Result",
    url: r.url,
    snippet: r.content || r.snippet || ""
  }));
  return { hits };
}

async function searchSerper(q: string): Promise<WebSearchResult> {
  const key = process.env.SERPER_API_KEY;
  if (!key) return { hits: [] };
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-API-KEY": key },
    body: JSON.stringify({ q, gl: GL, hl: HL, num: 8 })
  }).catch(() => null);
  if (!res) return { hits: [] };
  const data: any = await res.json().catch(() => ({}));
  const organic = data.organic || [];
  const hits: WebHit[] = organic.slice(0, 6).map((r: any) => ({
    title: r.title || "Result",
    url: r.link,
    snippet: r.snippet || r.snipped || ""
  }));
  return { hits };
}

export async function searchWeb(q: string): Promise<WebSearchResult> {
  try {
    if (PROVIDER === "serper") return await searchSerper(q);
    return await searchTavily(q);
  } catch {
    return { hits: [] };
  }
}

export function summarizeHits(hits: WebHit[]): string {
  return hits.slice(0, 6).map((h, i) => {
    const s = (h.snippet || "").replace(/\s+/g, " ").slice(0, 260);
    return `${i + 1}. ${h.title}\n   ${h.url}\n   ${s}`;
  }).join("\n");
}

export function needsWeb(q: string): boolean {
  const t = (q || "").toLowerCase();
  return /prix|price|mad|dh|acheter|buy|meilleur|promo|disponibilit|202\d|maroc|casablanca|agadir|rabat|tanger/.test(t)
    || /\d{3,}\s?(dh|mad)/.test(t)
    || t.split(" ").filter(Boolean).length <= 3;
}
