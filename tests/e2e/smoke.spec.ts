import { expect, test } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/T\.O\.O\.LS|TOOLS|T\.O\.O\.L\.S/i);
});
