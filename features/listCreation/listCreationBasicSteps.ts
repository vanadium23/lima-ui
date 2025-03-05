import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  ADD_GROUP_BUTTON,
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
  HEADER,
  ITEM_INPUT,
  ITEM_INPUT_CONTAINER,
  ITEMS_INPUTS,
  PAGE_TITLE,
  PRO_VERSION_BUTTON,
  SEARCH_BUTTON,
  SEARCH_INPUT,
  SIDEBAR,
  TOGGLE_TOOLS_PANEL_BUTTON,
  TOOLS_PANEL,
  USER_BUTTON,
} from "../testIds.ts";
import { LISTS_CREATE } from "../utilities/addresses.ts";
import {
  ID_SUB_ID_SEPARATOR,
  InPlaywrightExtractAllCompleteIds,
  TEST_ID_ATTRIBUTE,
  TEST_SUB_ID_ATTRIBUTE,
} from "../utilities/buildTestableSelector.ts";
import { noVerticalScroll } from "../utilities/checkScroll.ts";
import { type PageAlias, PAGES_TEST_IDS } from "../utilities/testIds.ts";

import {
  ACCORDION_TEST_IDS,
  type AccordionMeaning,
  BUTTON_TEST_IDS,
  type ButtonMeaning,
  INPUT_TEST_IDS,
  type InputMeaning,
} from "./testIds.ts";

When("I open List Creation page", {timeout: 10000}, async function (this: ComplexWorld) {
  await this.navigate(LISTS_CREATE);
});

Then("I expect to see sidebar", async function (this: ComplexWorld) {
  await this.expectLocated(
    this.accounting.registerTestId(SIDEBAR),
  ).toBeInViewport();

  this.accounting.registerTestId(USER_BUTTON);
  this.accounting.registerTestId(ADD_GROUP_BUTTON);
  this.accounting.registerTestId(PRO_VERSION_BUTTON);
});

Then("I expect to see header", async function () {
  await this.expectLocated(
    this.accounting.registerTestId(HEADER),
  ).toBeInViewport();

  this.accounting.registerTestId(SEARCH_INPUT);
  this.accounting.registerTestId(SEARCH_BUTTON);
});

Then("I expect to see tools panel", async function () {
  await this.expectLocated(
    this.accounting.registerTestId(TOGGLE_TOOLS_PANEL_BUTTON),
  ).toBeInViewport();

  await this.expectLocated(
    this.accounting.registerTestId(TOOLS_PANEL),
  ).toBeInViewport();
});

Then(
  "I expect to see the following title: {string}",
  async function (this: ComplexWorld, pageTitleText: string) {
    const expectPageTitle = this.expectLocated(
      this.accounting.registerTestId(PAGE_TITLE),
    );

    await expectPageTitle.toBeInViewport();
    await expectPageTitle.toContainText(pageTitleText);
  },
);

Then(
  "I expect to see {string} input ready for typing with the following placeholder: {string}",
  async function (
    this: ComplexWorld,
    inputMeaning: InputMeaning,
    placeholder: string,
  ) {
    const expectListTitleInput = this.expectLocated(
      this.accounting.registerTestId(INPUT_TEST_IDS[inputMeaning]),
    );

    await expectListTitleInput.toBeInViewport();
    await expectListTitleInput.toBeEnabled();
    await expectListTitleInput.toHaveAttribute("placeholder", placeholder);
  },
);

Then(
  "I expect to see items inputs area without scroll",
  async function (this: ComplexWorld) {
    expect(
      await this.locate(this.accounting.registerTestId(ITEMS_INPUTS)).evaluate(
        noVerticalScroll,
      ),
    ).toBe(true);
  },
);

Then(
  "I expect to see single item input ready for typing",
  async function (this: ComplexWorld) {
    const itemInputTestSubId = await this.locate(ITEM_INPUT).getAttribute(
      TEST_SUB_ID_ATTRIBUTE,
    );
    this.accounting.registerTestIdAndSubId(ITEM_INPUT, itemInputTestSubId);
    this.accounting.registerTestIdAndSubId(
      ITEM_INPUT_CONTAINER,
      itemInputTestSubId,
    );

    const expectItemInput = this.expectLocated(ITEM_INPUT);

    await expectItemInput.toHaveCount(1);
    await expectItemInput.toBeInViewport();
    await expectItemInput.toBeEnabled();
  },
);

Then(
  "I expect to see the {string} button {string} with the following text: {string}",
  async function (
    this: ComplexWorld,
    buttonMeaning: ButtonMeaning,
    buttonState: string,
    buttonText: string,
  ) {
    // Находим локатор по тестовому ID
    const buttonLocator = this.locate(
      this.accounting.registerTestId(BUTTON_TEST_IDS[buttonMeaning]),
    );

    await expect(buttonLocator).toBeInViewport();

    // Проверить, что текст внутри элемента соответствует ожидаемому
    await expect(buttonLocator).toContainText(buttonText);

    // Получить имя тега элемента
    const tagName = await buttonLocator.evaluate((el: HTMLElement) =>
      el.tagName.toLowerCase(),
    );

    let buttonDisable = null;

    if (buttonState === "enabled") {
      buttonDisable = "false";
    } else if (buttonState === "disabled") {
      buttonDisable = "true";
    } else {
      throw new Error("Ожидалось состояние disabled или enabled");
    }

    if (tagName === "button") {
      // Если это тег <button>, проверить, что он отключен или включен
      if (buttonState === "enabled") {
        await expect(buttonLocator).toBeEnabled();
      } else {
        await expect(buttonLocator).toBeDisabled();
      }
    } else if (tagName === "a") {
      // Если это тег <a>, проверить наличие aria-disabled="true" aria-disabled="false"
      await expect(buttonLocator).toHaveAttribute(
        "aria-disabled",
        buttonDisable,
      );
    } else {
      // Обработка неожиданных типов тегов
      throw new Error(
        `Неподдерживаемый тег элемента: <${tagName}>. Ожидался <button> или <a>.`,
      );
    }
  },
);

Then(
  "I expect to see the {string} button ready for clicking",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    const expectButton = this.expectLocated(
      this.accounting.registerTestId(BUTTON_TEST_IDS[buttonMeaning]),
    );

    await expectButton.toBeInViewport();
    await expectButton.toBeEnabled();
  },
);

Then(
  "All elements expected to be on the {string} page",
  async function (this: ComplexWorld, pageAlias: PageAlias) {
    const testIds = this.accounting.getTestIds();
    const expectedPageIds = PAGES_TEST_IDS[pageAlias];

    if (testIds.length) {
      expect(testIds).toEqual(expectedPageIds);
    } else {
      this.accounting.registerSeveralTestIds(expectedPageIds);
    }
  },
);

Then("I expect to see no other elements", async function (this: ComplexWorld) {
  const allCompleteIds = (
    await this.locateAllTestable().evaluateAll(
      InPlaywrightExtractAllCompleteIds,
      {
        testIdAttribute: TEST_ID_ATTRIBUTE,
        testSubIdAttribute: TEST_SUB_ID_ATTRIBUTE,
        idSubIdSeparator: ID_SUB_ID_SEPARATOR,
      },
    )
  ).sort();

  const accountedTestIds = this.accounting.getTestIds();
  const excessiveIds = allCompleteIds.filter(
    (id) => !accountedTestIds.includes(id),
  );

  for (const id of excessiveIds) {
    await this.expectLocated(id).not.toBeVisible();
  }
});
Then(
  "I expect to fully see the collapsed {string} accordion ready for expanding",
  async function (this: ComplexWorld, accordionMeaning: AccordionMeaning) {
    const accordionTestId = ACCORDION_TEST_IDS[accordionMeaning];

    const expectAccordion = this.expectLocated(
      this.accounting.registerTestId(accordionTestId),
    );
    await expectAccordion.toBeInViewport({ ratio: 1 });

    const expectAccordionButton = this.expectLocated(
      this.accounting.registerTestId(
        buildAccordionButtonTestId(accordionTestId),
      ),
    );
    await expectAccordionButton.toBeEnabled();

    const expectAccordionContent = this.expectLocated(
      buildAccordionContentTestId(accordionTestId),
    );
    await expectAccordionContent.not.toBeVisible();
  },
);
