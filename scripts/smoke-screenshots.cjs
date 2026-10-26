const { chromium } = require("playwright");
const path = require("path");

const media = process.env.MEDIA_DIR;
const base = process.env.BASE_URL || "http://127.0.0.1:3017";

if (!media) {
  console.error("MEDIA_DIR required");
  process.exit(1);
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });
  const page = await context.newPage();

  await page.goto(base + "/lobby", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForSelector('[data-testid="lobby"]', { timeout: 30000 });
  await page.waitForTimeout(900);
  await page.screenshot({
    path: path.join(media, "ishaare-lobby-mobile.png"),
    fullPage: false,
  });
  console.log("lobby_ok");

  const deck = page.locator(".deck-card").first();
  await deck.click();
  await page.waitForTimeout(400);
  await page.locator(".deck-card.is-active button").filter({ hasText: "START" }).click();
  await page.waitForURL(/\/game/, { timeout: 30000 });
  await page.waitForSelector('[data-testid="game-shell"]', { timeout: 30000 });
  await page.waitForSelector('[data-testid="current-word"]', { timeout: 30000 });
  // wait for rotate snack to dismiss
  await page.waitForTimeout(3200);

  await page.locator('[data-testid="correct-zone"]').click();
  await page.waitForTimeout(120);
  await page.screenshot({
    path: path.join(media, "ishaare-game-correct.png"),
    fullPage: false,
  });
  console.log("correct_ok");
  await page.waitForTimeout(600);

  await page.locator('[data-testid="skip-zone"]').click();
  await page.waitForTimeout(120);
  await page.screenshot({
    path: path.join(media, "ishaare-game-wrong.png"),
    fullPage: false,
  });
  console.log("wrong_ok");

  await browser.close();
  console.log("screenshots_ok");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
