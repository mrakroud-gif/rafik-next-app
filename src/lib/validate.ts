import { z } from "zod";

export const chatSchema = z.object({
  text: z.string().min(1).max(1000),
  history: z.array(z.object({
    role: z.enum(["user","assistant"]),
    text: z.string().max(2000).optional(),
    content: z.string().max(2000).optional(),
  })).optional(),
  web: z.boolean().optional(),
});

export function sanitizeInput(s: string): string {
  if (!s) return "";
  const trimmed = s.slice(0, 1000);
  // enlève scripts / balises / caractères nuls
  return trimmed
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\0/g, "")
    .trim();
}
