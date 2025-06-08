import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { LISTS_CREATE } from "../../../utilities/addresses.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import {
  ADD_GROUP_BUTTON,
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
  HEADER,
  LIST_ITEMS,
  PAGE_TITLE,
  PRO_VERSION_BUTTON,
  SEARCH_BUTTON,
  SEARCH_INPUT,
  SIDEBAR,
  TOGGLE_SIDEBAR_BUTTON,
  TOGGLE_TOOLS_PANEL_BUTTON,
  TOOLS_PANEL,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  USER_BUTTON,
} from "../../testIds.ts";
import {
  ID_SUB_ID_SEPARATOR,
  InPlaywrightExtractAllCompleteIds,
  TEST_ID_ATTRIBUTE,
  TEST_SUB_ID_ATTRIBUTE,
} from "../../utilities/buildTestableSelector.ts";
import { noVerticalScroll } from "../../utilities/checkScroll.ts";
import {
  isDesktop,
  isMobile,
  isTablet,
} from "../../utilities/discoverDevice.ts";
import { getTimeoutOrCancelItIfDebugging } from "../../utilities/getTimeoutOrCancelItIfDebugging.ts";
import { type PageAlias, PAGES_TEST_IDS } from "../../utilities/testIds.ts";
import {
  ACCORDION_TEST_IDS,
  type AccordionMeaning,
  BUTTON_TEST_IDS,
  type ButtonMeaning,
} from "./testIds.ts";

When(
  "I open List Creation page",
  { timeout: getTimeoutOrCancelItIfDebugging(10000) },
  async function (this: ComplexWorld) {
    await this.navigate(LISTS_CREATE);
    await this.page.waitForLoadState("networkidle");
  },
);

Then(
  "I expect to see sidebar or its button",
  async function (this: ComplexWorld) {
    if (isDesktop()) {
      await this.expectLocated(
        this.accounting.elements.registerTestId(SIDEBAR),
      ).toBeInViewport();
    }

    if (isTablet() || isMobile()) {
      await this.expectLocated(
        this.accounting.elements.registerTestId(TOGGLE_SIDEBAR_BUTTON),
      ).toBeInViewport();
    }

    this.accounting.elements.registerTestId(USER_BUTTON);
    this.accounting.elements.registerTestId(ADD_GROUP_BUTTON);
    this.accounting.elements.registerTestId(PRO_VERSION_BUTTON);
  },
);

Then("I expect to see header", async function (this: ComplexWorld) {
  await this.expectLocated(
    this.accounting.elements.registerTestId(HEADER),
  ).toBeInViewport();

  this.accounting.elements.registerTestId(SEARCH_INPUT);
  this.accounting.elements.registerTestId(SEARCH_BUTTON);
});

Then(
  "I expect to see tools panel or its button",
  async function (this: ComplexWorld) {
    if (isDesktop() || isTablet()) {
      await this.expectLocated(
        this.accounting.elements.registerTestId(TOOLS_PANEL),
      ).toBeInViewport();
    }

    if (isMobile()) {
      await this.expectLocated(
        this.accounting.elements.registerTestId(TOGGLE_TOOLS_PANEL_BUTTON),
      ).toBeInViewport();
    }
  },
);

Then("I expect not to see tools panel", async function (this: ComplexWorld) {
  await this.expectLocated(TOGGLE_TOOLS_PANEL_BUTTON).not.toBeInViewport();

  await this.expectLocated(TOOLS_PANEL).not.toBeInViewport();
});

Then(
  "I expect to see the following title: {string}",
  async function (this: ComplexWorld, pageTitleText: string) {
    const expectPageTitle = this.expectLocated(
      this.accounting.elements.registerTestId(PAGE_TITLE),
    );

    await expectPageTitle.toBeInViewport();
    await expectPageTitle.toContainText(pageTitleText);
  },
);

Then(
  "I expect to see items inputs area without scroll",
  async function (this: ComplexWorld) {
    expect(
      await this.locateByIdParts(
        this.accounting.elements.registerTestId(LIST_ITEMS),
      ).evaluate(noVerticalScroll),
    ).toBe(true);
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
    const buttonFullTestId = BUTTON_TEST_IDS[buttonMeaning];
    const buttonLocator = this.locateByIdParts(
      this.accounting.elements.registerTestId(buttonFullTestId),
    );

    if (buttonFullTestId === TOOLS_PANEL_ADD_ITEM_BUTTON) {
      this.accounting.itemAdders.registerTestId(buttonFullTestId);
    }

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
  "I expect to see the {string} button enabled",
  async function (this: ComplexWorld, buttonMeaning: ButtonMeaning) {
    const expectButton = this.expectLocated(
      this.accounting.elements.registerTestId(BUTTON_TEST_IDS[buttonMeaning]),
    );

    await expectButton.toBeInViewport();
    await expectButton.toBeEnabled();
  },
);

Then(
  "All necessary elements are on the {string} page",
  async function (this: ComplexWorld, pageAlias: PageAlias) {
    const pageTestIds = this.accounting.elements.getTestIds();
    const expectedPageTestIds = PAGES_TEST_IDS[pageAlias];

    if (pageTestIds.length) {
      expect(pageTestIds).toEqual(expectedPageTestIds);
    } else {
      this.accounting.elements.registerSeveralTestIds(expectedPageTestIds);
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

  const accountedTestIds = this.accounting.elements.getTestIds();
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
      this.accounting.elements.registerTestId(accordionTestId),
    );
    await expectAccordion.toBeInViewport({ ratio: 1 });

    const expectAccordionButton = this.expectLocated(
      this.accounting.elements.registerTestId(
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
