import { chromium } from "playwright";
import fs from "fs";

const browser = await chromium.launch({ headless: true });

async function shot(vp, paths) {
  const page = await browser.newPage({ viewport: vp });
  await page.addInitScript(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (q) => ({
        matches: true,
        media: q,
        onboardchange: null,
        addListener() {},
        removeListener() {},
        addEventListener() {},
        removeEventListener() {},
        dispatchEvent() {
          return false;
        },
      }),
    });
  });
  await page.goto("http://127.0.0.1:3456/about", {
    waitUntil: "load",
    timeout: 45000,
  });
  await page.waitForSelector("h1");
  await page.waitForTimeout(1800);
  await page.evaluate(() => window.scrollTo(0, 0));
  if (paths.full) await page.screenshot({ path: paths.full, fullPage: true });
  if (paths.hero) {
    await page.screenshot({
      path: paths.hero,
      clip: { x: 0, y: 0, width: vp.width, height: vp.height },
    });
  }
  if (paths.team) {
    const team = page.locator('[aria-label="Studio team"]');
    await team.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    const box = await team.boundingBox();
    if (box) {
      await page.screenshot({
        path: paths.team,
        clip: {
          x: 0,
          y: Math.max(0, box.y - 40),
          width: vp.width,
          height: Math.min(vp.height, box.height + 80),
        },
      });
    }
  }
  await page.close();
}

await shot(
  { width: 390, height: 844 },
  {
    full: ".impeccable/review/mobile.png",
    hero: ".impeccable/review/about-hero-mobile.png",
    team: ".impeccable/review/about-team-mobile.png",
  },
);
await shot(
  { width: 1440, height: 900 },
  {
    full: ".impeccable/review/desktop.png",
    hero: ".impeccable/review/about-hero-desktop.png",
    team: ".impeccable/review/about-team-desktop.png",
  },
);
await browser.close();
console.log(
  "recaptured",
  fs.statSync(".impeccable/review/mobile.png").size,
  fs.statSync(".impeccable/review/about-team-desktop.png").size,
);
