import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  type PageMeaning,
  PAGES_MEANINGS,
} from "../../../utilities/addresses.ts";
import type { ComplexWorld } from "../../context/hooks.ts";
import {
  ADD_GROUP_BUTTON,
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
  HEADER,
  LIST_ITEMS,
  PAGE_TITLE,
  PRO_VERSION_BUTTON,
  SIDEBAR,
  SIGN_OUT_BUTTON,
  TOGGLE_SIDEBAR_BUTTON,
  TOGGLE_TOOLS_PANEL_BUTTON,
  TOOLS_PANEL,
  USER_BUTTON,
} from "../../testIds.ts";
import {
  ID_SUB_ID_SEPARATOR,
  InPlaywrightExtractAllCompleteIds,
  TEST_ID_ATTRIBUTE,
  TEST_SUB_ID_ATTRIBUTE,
} from "../../utilities/buildTestableSelector.ts";
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
  "I open {string} page",
  { timeout: getTimeoutOrCancelItIfDebugging(10000) },
  async function (this: ComplexWorld, pageMeaning: PageMeaning) {
    const address = PAGES_MEANINGS[pageMeaning];

    if (!address) throw new Error(`Unknown page meaning: ${pageMeaning}`);

    await this.navigate(address);
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

      await this.expectLocated(
        this.accounting.elements.registerTestId(USER_BUTTON),
      ).toBeInViewport();

      await this.expectLocated(
        this.accounting.elements.registerTestId(SIGN_OUT_BUTTON),
      ).toBeInViewport();

      await this.expectLocated(
        this.accounting.elements.registerTestId(ADD_GROUP_BUTTON),
      ).toBeInViewport();

      await this.expectLocated(
        this.accounting.elements.registerTestId(PRO_VERSION_BUTTON),
      ).toBeInViewport();
    }

    if (isTablet() || isMobile()) {
      await this.expectLocated(
        this.accounting.elements.registerTestId(TOGGLE_SIDEBAR_BUTTON),
      ).toBeInViewport();
    }
  },
);

Then("I expect to see header", async function (this: ComplexWorld) {
  await this.expectLocated(
    this.accounting.elements.registerTestId(HEADER),
  ).toBeInViewport();
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

Then("I expect to see list items area", async function (this: ComplexWorld) {
  await this.expectLocated(
    this.accounting.elements.registerTestId(LIST_ITEMS),
  ).toBeInViewport();
});

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
