import { test, expect } from "@playwright/test";

test("smoke: accueil s'affiche et le logo est visible", async ({ page }) => {
  await page.goto("/");
  // Cherche soit un <img alt="Rafik"> soit le texte "Rafik" dans le header
  const logo = page.locator('img[alt="Rafik"], [data-testid="brand-name"], text=Rafik');
  await expect(logo.first()).toBeVisible();
});
