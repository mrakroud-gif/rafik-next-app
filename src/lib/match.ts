import type { Offer } from "@/lib/types";

type Opts = {
  city?: string;
  product?: string;
  budgetMin?: number;
  budgetMax?: number;
  category?: string;
  sort?: "relevance" | "price_asc" | "price_desc" | "title_asc";
};

export function matchOffers(list: Offer[], o: Opts): Offer[] {
  let L = [...list];
  if (o.city) L = L.filter((x) => x.city.toLowerCase().includes(o.city!.toLowerCase()));
  if (o.product) {
    const kw = o.product.toLowerCase().split(" ")[0];
    L = L.filter((x) => x.title.toLowerCase().includes(kw));
  }
  if (o.category) L = L.filter((x) => (x.category || "").toLowerCase() === o.category!.toLowerCase());
  if (o.budgetMin != null) L = L.filter((x) => x.price >= o.budgetMin!);
  if (o.budgetMax != null) L = L.filter((x) => x.price <= o.budgetMax!);

  switch (o.sort) {
    case "price_asc": L.sort((a, b) => a.price - b.price); break;
    case "price_desc": L.sort((a, b) => b.price - a.price); break;
    case "title_asc": L.sort((a, b) => a.title.localeCompare(b.title)); break;
    default:
      // simple pertinence : proximité de budget
      if (o.budgetMin != null || o.budgetMax != null) {
        const mid = ( (o.budgetMin ?? 0) + (o.budgetMax ?? 0) ) / 2;
        L.sort((a, b) => Math.abs(a.price - mid) - Math.abs(b.price - mid));
      }
  }
  return L.slice(0, 30);
}
