import { test, expect } from "@playwright/test";

test("chat: saisir un message et l'envoyer", async ({ page }) => {
  await page.goto("/chat");

  // Sélecteurs robustes (data-testid si présent, sinon placeholder)
  const input = page.locator('[data-testid="chat-input"], input[placeholder*="message"], textarea[placeholder*="message"]');
  await expect(input).toBeVisible();

  // 5.a Envoi avec Entrée
  await input.fill("salut test");
  const stream = page.waitForResponse(r => r.url().includes("/api/chat/stream")).catch(() => null);
  await input.press("Enter");
  await stream.catch(()=>null);
  // On doit au moins revoir le texte utilisateur dans l'historique
  await expect(page.locator("main")).toContainText("salut test");

  // 5.b Envoi avec bouton
  await input.fill("deuxième test");
  const sendBtn = page.locator(
    '[data-testid="send-btn"], button:has-text("Envoyer"), button[aria-label*="Envoyer"]'
  );
  await expect(sendBtn).toBeVisible();
  const stream2 = page.waitForResponse(r => r.url().includes("/api/chat/stream")).catch(() => null);
  await sendBtn.click();
  await stream2.catch(()=>null);
  await expect(page.locator("main")).toContainText("deuxième test");
});
