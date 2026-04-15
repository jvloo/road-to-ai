import { test, expect } from "@playwright/test";

test("landing page renders Road to AI heading in dark mode", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Road to AI" })).toBeVisible();
  await expect(page.locator("html")).toHaveClass(/dark/);
});
