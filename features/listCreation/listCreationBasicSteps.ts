import { Then, When } from "@cucumber/cucumber";
import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  ITEMS_INPUTS,
  LIST_TITLE_INPUT,
  PAGE_TITLE,
  SIDEBAR,
} from "../testIds.ts";
import { noVerticalScroll } from "../utilities/checkScroll.ts";
import { expect } from "@playwright/test";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  extractAllCompleteIds,
  TEST_ID_ATTRIBUTE,
  TEST_SUB_ID_ATTRIBUTE,
} from "../utilities/buildTestSelector.ts";
import {
  BUTTON_TEST_IDS,
  type ButtonMeaning,
  type FocusableMeaning,
  FOCUSABLES_TEST_IDS,
} from "./testIds.ts";

When("I open List Creation page", async function (this: ComplexWorld) {
  await this.navigate("create-checklist");
});

Then("I expect to see sidebar", async function (this: ComplexWorld) {
  await this.expectLocated(
    this.accounting.registerTestId(SIDEBAR),
  ).toBeInViewport();
});

Then(
  "I expect to see header with the following title: {string}",
  async function (this: ComplexWorld, pageTitleText: string) {
    const expectPageTitle = this.expectLocated(
      this.accounting.registerTestId(PAGE_TITLE),
    );

    await expectPageTitle.toBeInViewport();
    await expectPageTitle.toContainText(pageTitleText);
  },
);

Then(
  "I expect to see list title input ready for typing with the following placeholder: {string}",
  async function (this: ComplexWorld, placeholder: string) {
    const expectListTitleInput = this.expectLocated(
      this.accounting.registerTestId(LIST_TITLE_INPUT),
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
  "I expect to see single item input ready for typing with the following placeholder: {string}",
  async function (this: ComplexWorld, placeholder: string) {
    const expectItemInput = this.expectLocated(ITEM_INPUT);

    this.accounting.registerTestIdAndSubId(
      ITEM_INPUT,
      await this.locate(ITEM_INPUT).getAttribute(TEST_SUB_ID_ATTRIBUTE),
    );

    await expectItemInput.toHaveCount(1);
    await expectItemInput.toBeInViewport();
    await expectItemInput.toBeEnabled();
    await expectItemInput.toHaveAttribute("placeholder", placeholder);
  },
);

Then(
  "I expect to see the disabled {string} button with the following text: {string}",
  async function (
    this: ComplexWorld,
    buttonMeaning: ButtonMeaning,
    buttonText: string,
  ) {
    const expectButton = this.expectLocated(
      this.accounting.registerTestId(BUTTON_TEST_IDS[buttonMeaning]),
    );

    await expectButton.toBeInViewport();
    await expectButton.toBeDisabled();
    await expectButton.toContainText(buttonText);
  },
);

Then(
  "I expect to see the {string} button ready for clicking with the following text: {string}",
  async function (
    this: ComplexWorld,
    buttonMeaning: ButtonMeaning,
    buttonText: string,
  ) {
    const expectButton = this.expectLocated(
      this.accounting.registerTestId(BUTTON_TEST_IDS[buttonMeaning]),
    );

    await expectButton.toBeInViewport();
    await expectButton.toBeEnabled();
    await expectButton.toContainText(buttonText);
  },
);

Then(
  "All elements expected to be on the List Creation page right after opening are here",
  async function (this: ComplexWorld) {
    const ALL_ITEMS_OF_LIST_CREATION_PAGE_BASIS = [
      ADD_ITEM_BUTTON,
      CREATE_LIST_BUTTON,
      IMPORT_BUTTON,
      ITEMS_INPUTS,
      `${ITEM_INPUT}0`,
      LIST_TITLE_INPUT,
      PAGE_TITLE,
      SIDEBAR,
    ].sort();
    const testIds = this.accounting.getTestIds();

    if (testIds.length) {
      expect(testIds).toEqual(ALL_ITEMS_OF_LIST_CREATION_PAGE_BASIS);
    } else {
      this.accounting.registerSeveralTestIds(
        ALL_ITEMS_OF_LIST_CREATION_PAGE_BASIS,
      );
    }
  },
);

Then("I expect to see no other elements", async function (this: ComplexWorld) {
  expect(
    (
      await this.locateAllTestable().evaluateAll(extractAllCompleteIds, {
        testIdAttribute: TEST_ID_ATTRIBUTE,
        testSubIdAttribute: TEST_SUB_ID_ATTRIBUTE,
      })
    ).sort(),
  ).toEqual(this.accounting.getTestIds());
});

When("I press Tab key", async function (this: ComplexWorld) {
  await this.page.keyboard.press("Tab");
});

Then(
  "I expect the {string} to be focused",
  async function (this: ComplexWorld, focusableMeaning: FocusableMeaning) {
    const focusable = FOCUSABLES_TEST_IDS[focusableMeaning];

    await this.expectLocated(focusable).toBeFocused();
  },
);

Then(
  "I expect the {string} not to be focused",
  async function (this: ComplexWorld, focusableMeaning: FocusableMeaning) {
    const focusable = FOCUSABLES_TEST_IDS[focusableMeaning];

    await this.expectLocated(focusable).not.toBeFocused();
  },
);
