/**
 * Browser test script to check for console errors and page load issues
 * Run with: node test-browser.js
 */

import puppeteer from 'puppeteer';

(async () => {
  console.log('🚀 Launching browser...\n');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleMessages.push({ type, text });
    
    // Print in real-time with color coding
    const isWarn = type === 'warning' || type === 'warn';
    const prefix = type === 'error' ? '❌ ERROR:' : 
                   isWarn ? '⚠️  WARN:' : 
                   type === 'log' ? '📝 LOG:' : 
                   `[${type}]`;
    console.log(`${prefix} ${text}`);
  });

  // Uncaught exceptions / runtime errors on the page
  const pageErrors = [];
  page.on('pageerror', (err) => {
    pageErrors.push({
      message: err?.message || String(err),
      stack: err?.stack || '',
    });
    console.log(`❌ PAGEERROR: ${err?.message || String(err)}`);
    if (err?.stack) console.log(err.stack);
  });
  page.on('error', (err) => {
    pageErrors.push({
      message: err?.message || String(err),
      stack: err?.stack || '',
    });
    console.log(`❌ BROWSERERROR: ${err?.message || String(err)}`);
    if (err?.stack) console.log(err.stack);
  });
  
  // Collect network errors
  const networkErrors = [];
  page.on('requestfailed', request => {
    networkErrors.push({
      url: request.url(),
      failure: request.failure().errorText
    });
    console.log(`🔴 NETWORK FAIL: ${request.url()} - ${request.failure().errorText}`);
  });
  
  // Collect 404s and failed responses
  const failedResponses = [];
  page.on('response', response => {
    if (response.status() >= 400) {
      failedResponses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`🔴 HTTP ${response.status()}: ${response.url()}`);
    }
  });
  
  // Navigate to the page
  console.log('\n📍 Navigating to http://localhost:5173/...\n');
  
  try {
    await page.goto('http://localhost:5173/', {
      waitUntil: 'networkidle2',
      timeout: 10000
    });
    
    console.log('\n⏳ Waiting 5 seconds for full page load...\n');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Take a screenshot
    await page.screenshot({ path: '/tmp/localhost-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved to /tmp/localhost-screenshot.png\n');
    
    // Get page title and visible text
    const title = await page.title();
    const bodyText = await page.evaluate(() => {
      return document.body.innerText.substring(0, 500);
    });
    
    // Check for specific elements
    const canvasExists = await page.evaluate(() => {
      return !!document.querySelector('canvas');
    });
    
    const rootHasContent = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });
    
    // Summary Report
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY REPORT');
    console.log('='.repeat(60));
    
    console.log('\n✅ PAGE LOADED SUCCESSFULLY');
    console.log(`   Title: ${title}`);
    console.log(`   Canvas element: ${canvasExists ? 'Found ✓' : 'Missing ✗'}`);
    console.log(`   Root has content: ${rootHasContent ? 'Yes ✓' : 'No ✗'}`);
    
    console.log('\n📝 VISIBLE CONTENT (first 500 chars):');
    console.log(bodyText || '(empty)');
    
    // Console errors summary
    const errors = consoleMessages.filter(m => m.type === 'error');
    const warnings = consoleMessages.filter(m => m.type === 'warning' || m.type === 'warn');
    
    console.log('\n🔍 CONSOLE MESSAGES:');
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log(`   Total messages: ${consoleMessages.length}`);
    
    if (errors.length > 0) {
      console.log('\n❌ CONSOLE ERRORS:');
      errors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.text}`);
      });
    }
    
    if (warnings.length > 0) {
      console.log('\n⚠️  CONSOLE WARNINGS:');
      warnings.forEach((warn, i) => {
        console.log(`   ${i + 1}. ${warn.text}`);
      });
    }
    
    // Network errors summary
    console.log('\n🌐 NETWORK STATUS:');
    console.log(`   Failed requests: ${networkErrors.length}`);
    console.log(`   HTTP errors (4xx/5xx): ${failedResponses.length}`);
    console.log(`   Page errors: ${pageErrors.length}`);
    
    if (networkErrors.length > 0) {
      console.log('\n🔴 NETWORK FAILURES:');
      networkErrors.forEach((err, i) => {
        console.log(`   ${i + 1}. ${err.url}`);
        console.log(`      Error: ${err.failure}`);
      });
    }
    
    if (failedResponses.length > 0) {
      console.log('\n🔴 HTTP ERRORS:');
      failedResponses.forEach((resp, i) => {
        console.log(`   ${i + 1}. [${resp.status}] ${resp.url}`);
      });
    }

    if (pageErrors.length > 0) {
      console.log('\n💥 PAGE ERRORS:');
      pageErrors.forEach((pe, i) => {
        console.log(`   ${i + 1}. ${pe.message}`);
        if (pe.stack) console.log(pe.stack);
      });
    }
    
    if (errors.length === 0 && warnings.length === 0 && networkErrors.length === 0 && failedResponses.length === 0 && pageErrors.length === 0) {
      console.log('\n✨ NO ERRORS DETECTED! Page loaded successfully.');
    }
    
    console.log('\n' + '='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
  } finally {
    await browser.close();
    console.log('🏁 Browser closed.\n');
  }
})();
