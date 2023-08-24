import puppeteer, { Browser, Page } from 'puppeteer';
import { newInjectedPage } from 'fingerprint-injector';
import { printColoredMessage } from 'consoleUtils';
import { ConsoleColours } from 'const';

let browser: Browser | null = null;

export const getPage = async (htmlUrl: string, waitForSelector: string): Promise<Page> => {
  if (!browser) {
    browser = await puppeteer.launch({ headless: false });
  }

  const page = await newInjectedPage(browser, {
    fingerprintOptions: {
      devices: ['desktop'],
      browsers: [{ name: 'chrome', minVersion: 90 }],
    },
  });

  await page.setJavaScriptEnabled(true);
  await page.goto(htmlUrl);
  await page.waitForSelector(waitForSelector, { timeout: 60000 });
  printColoredMessage(ConsoleColours.YELLOW, 'Element loaded...');
  return page;
};

export const closeBrowser = async (): Promise<void> => {
  if (!browser) return;
  printColoredMessage(ConsoleColours.YELLOW, 'Closing browser...');
  await browser.close();
  browser = null;
};
