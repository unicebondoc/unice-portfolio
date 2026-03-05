/**
 * Hard reload localhost:5173, capture console, verify loader flow and no ReferenceError.
 * Run: node check-loader-console.js
 */
import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  const consoleLogs = [];
  const errors = [];

  await page.evaluateOnNewDocument(() => {
    const orig = console.log;
    console.log = function (...args) {
      if (args[0] === '[loader]' && args[1] && typeof args[1] === 'object') {
        window.__lastLoaderSnapshot = args[1];
      }
      orig.apply(console, args);
    };
  });

  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });
    if (text.includes('ReferenceError')) errors.push({ type, text });
  });
  page.on('pageerror', (err) => {
    errors.push({ type: 'pageerror', text: err.message });
  });

  await page.setCacheEnabled(false);
  await page.goto('http://localhost:5173/', {
    waitUntil: 'networkidle0',
    timeout: 15000,
  });

  await new Promise((r) => setTimeout(r, 9500));

  const lastLoader = await page.evaluate(() => window.__lastLoaderSnapshot || null);
  const hasReferenceError = errors.some(
    (e) => e.text && (e.text.includes('ReferenceError') || (e.text.message && String(e.text.message).includes('ReferenceError')))
  );

  const loaderVisible = await page.evaluate(() => {
    const loader = document.querySelector('[data-loading-screen], .loading-screen, [class*="LoadingScreen"]');
    return !!loader;
  });
  const mainUiVisible = await page.evaluate(() => {
    const title = document.querySelector('[data-entrance="title"]');
    return title && title.offsetParent !== null && parseFloat(getComputedStyle(title).opacity) > 0;
  });

  console.log('=== LOADER CONSOLE CHECK ===\n');
  console.log('ReferenceError in console:', hasReferenceError ? 'YES (FAIL)' : 'NO (OK)');
  console.log('[loader] last snapshot:', lastLoader ? 'captured' : 'none');
  if (lastLoader) {
    console.log('Last [loader] snapshot:', JSON.stringify(lastLoader, null, 2));
    const ok =
      lastLoader.fontsReady === true &&
      lastLoader.imagesReady === true &&
      lastLoader.three?.threeReady === true &&
      lastLoader.sceneReady === true &&
      lastLoader.showLoader === false;
    console.log('All flags true & showLoader false:', ok ? 'YES' : 'NO');
  }
  console.log('Loader element still in DOM:', loaderVisible ? 'YES' : 'NO');
  console.log('Main UI (title) visible:', mainUiVisible ? 'YES' : 'NO');
  if (errors.length) {
    console.log('\nErrors captured:', errors.length);
    errors.forEach((e) => console.log(' ', e.type, e.text));
  }
  console.log('\n=== END ===');

  await browser.close();
})();
