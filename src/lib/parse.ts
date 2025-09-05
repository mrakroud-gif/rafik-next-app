export function parse(text: string) {
  const s = (text || "").toLowerCase().normalize("NFKD");
  const money = Array.from(s.matchAll(/(\d[\d\s]{2,})(?:\s?dh|\s?mad)?/g)).map(m =>
    Number(m[1].replace(/\s+/g, ""))
  );
  let budgetMin: number | undefined;
  let budgetMax: number | undefined;
  if (money.length >= 2) { budgetMin = Math.min(money[0], money[1]); budgetMax = Math.max(money[0], money[1]); }
  else if (money.length === 1) { budgetMax = money[0]; }

  const cities = ["casablanca","rabat","marrakech","agadir","mohammedia","tanger","fes","meknes"];
  const city = cities.find(c => s.includes(c));

  // heuristique: produit = texte sans montants ni ville
  let product = s.replace(/(\d[\d\s]{2,})(?:\s?dh|\s?mad)?/g, "")
                 .replace(new RegExp((city ?? ''), 'g'), "")
                 .replace(/entre|à|a|dh|mad|budget|prix|pour|moins|plus|entre|et|de|un|une|le|la|les/gi, " ")
                 .replace(/\s+/g, " ")
                 .trim();

  const missing: string[] = [];
  if (!product) missing.push("produit");
  if (!(budgetMin || budgetMax)) missing.push("budget");
  if (!city) missing.push("ville");

  return { product, budgetMin, budgetMax, city, missing };
}
