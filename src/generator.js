import puppeteer from 'puppeteer';
import { generateHTML } from './template.js';

export async function generateComicStrip(comicData) {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Calculate dimensions based on content
    const width = comicData.width || 1200;
    const height = comicData.height || 'auto';
    
    await page.setViewport({ 
      width: width, 
      height: 800,
      deviceScaleFactor: 2 // Higher quality output
    });

    const html = generateHTML(comicData);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // If height is auto, calculate based on content
    if (height === 'auto') {
      const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.setViewport({ 
        width: width, 
        height: bodyHeight,
        deviceScaleFactor: 2
      });
    }

    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: true
    });

    return screenshot;
  } finally {
    await browser.close();
  }
}
