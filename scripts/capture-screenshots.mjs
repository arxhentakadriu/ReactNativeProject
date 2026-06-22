import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputDir = path.join(rootDir, 'docs', 'screenshots');
const baseUrl = process.env.EXPO_WEB_URL ?? 'http://localhost:8081';

async function waitForApp(page) {
  await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 120_000 });
  await page.waitForFunction(
    () => document.body?.innerText?.includes('Personal task manager'),
    { timeout: 120_000 },
  );
}

async function capture(page, name, setup) {
  if (setup) {
    await setup(page);
  }

  await new Promise((resolve) => setTimeout(resolve, 800));
  await page.screenshot({
    path: path.join(outputDir, name),
    fullPage: true,
  });
  console.log(`Saved ${name}`);
}

async function main() {
  await mkdir(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  await page.evaluateOnNewDocument(() => {
    localStorage.clear();
  });

  await waitForApp(page);
  await capture(page, '01-task-list.png');

  await page.goto(`${baseUrl}/task/api-1`, { waitUntil: 'networkidle2', timeout: 60_000 });
  await page.waitForFunction(
    () => document.body?.innerText?.includes('Task Details') || document.body?.innerText?.includes('Sample task'),
    { timeout: 60_000 },
  );
  await capture(page, '02-task-details.png');

  await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 60_000 });
  await waitForApp(page);

  const addButton = await page.$('text/Add Task');
  if (addButton) {
    await addButton.click();
  }
  await capture(page, '03-form-validation.png');

  const searchInput = await page.$('input[placeholder="Search by title"]');
  if (searchInput) {
    await searchInput.type('delectus');
  }

  const activeTab = await page.evaluateHandle(() => {
    const buttons = Array.from(document.querySelectorAll('[role="button"]'));
    return buttons.find((button) => button.textContent?.trim() === 'Active') ?? null;
  });
  const activeElement = activeTab.asElement();
  if (activeElement) {
    await activeElement.click();
  }
  await capture(page, '04-search-and-filter.png');

  await page.evaluate(() => {
    localStorage.setItem('taskmanager.tasks', '[]');
  });
  await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 60_000 });
  await page.waitForFunction(
    () =>
      document.body?.innerText?.includes('No tasks yet') ||
      document.body?.innerText?.includes('Add your first task'),
    { timeout: 60_000 },
  );
  await capture(page, '05-empty-state.png');

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
