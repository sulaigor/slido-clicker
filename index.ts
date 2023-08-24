import { ElementHandle } from 'puppeteer';
import { ConsoleColours } from 'const';
import { printColoredMessage } from 'consoleUtils';
import { getEnvVariables } from 'envVariablesUtils';
import { closeBrowser, getPage } from 'htmlUtils';

(async () => {
  const { SLIDO_URL, SLIDO_QUESTION, CLICK_COUNT } = getEnvVariables();

  for (let i = 0; i < Number(CLICK_COUNT); i++) {
    printColoredMessage(ConsoleColours.YELLOW, `Run click number ${i + 1}...`);
    const page = await getPage(SLIDO_URL, '.question-list__item');

    const questionItems = await page.$$('.question-list__item');
    const questionItemIndex = (
      await Promise.all(
        questionItems.map(async (item) => {
          const body = await item.$('.question-item__body');
          const question = await (await body?.getProperty('textContent'))?.jsonValue();
          return Boolean(question?.includes(SLIDO_QUESTION));
        }),
      )
    ).findIndex((item) => item);

    const questionItem: ElementHandle<Element> | undefined = questionItems[questionItemIndex];
    if (questionItem) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const questionLikeBtn = await questionItem.$('button');
      await questionLikeBtn?.click();
      printColoredMessage(ConsoleColours.GREEN, 'Question liked!');
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    await closeBrowser();
  }
})();
