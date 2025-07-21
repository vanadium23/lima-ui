import { Then, When } from "@cucumber/cucumber";

import { LISTS_LIMIT } from "../../configuration.ts";
import { createList } from "../../src/widgets/editList/services/createList.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  LIST_STRIPE,
  LIST_STRIPE_LINK_TO_VIEW,
  LISTS_LIMIT_REACHED_WARNING,
  OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
} from "../testIds.ts";
import {
  buildTestableSelector,
  TEST_SUB_ID_ATTRIBUTE,
} from "../utilities/buildTestableSelector.ts";
import { isMobile, isTablet } from "../utilities/discoverDevice.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";

Then("I expect to see created list", async function (this: ComplexWorld) {
  await this.expectLocated(
    this.accounting.elements.registerTestIdAndSubId(LIST_STRIPE, "0"),
  ).toBeInViewport();

  this.accounting.elements.registerTestIdAndSubId(
    LIST_STRIPE_LINK_TO_VIEW,
    "0",
  );

  if (isTablet() || isMobile()) {
    this.accounting.elements.registerTestIdAndSubId(
      OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
      "0",
    );
  }
});

Then(
  "I hover away from anything actionable",
  async function (this: ComplexWorld) {
    await this.page.locator("body").hover({
      position: { x: 0, y: 0 },
    });
  },
);

Then(
  "I expect to see the following number of list stripes: {int}",
  async function (this: ComplexWorld, listStripesQuantity: number) {
    if (listStripesQuantity > 0) {
      await this.page.waitForSelector(buildTestableSelector(LIST_STRIPE));
    }

    const listsPositions = (await this.locateByIdParts(LIST_STRIPE).all()).map(
      (listStripe) => listStripe.getAttribute(TEST_SUB_ID_ATTRIBUTE),
    );

    for (const listPosition of listsPositions) {
      this.accounting.elements.registerTestIdAndSubId(
        LIST_STRIPE,
        await listPosition,
      );
      this.accounting.elements.registerTestIdAndSubId(
        LIST_STRIPE_LINK_TO_VIEW,
        await listPosition,
      );

      if (isTablet() || isMobile()) {
        this.accounting.elements.registerTestIdAndSubId(
          OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
          await listPosition,
        );
      }
    }

    await this.expectLocated(LIST_STRIPE).toHaveCount(listStripesQuantity);
  },
);

When(
  "I add lists to their limit",
  { timeout: getTimeoutOrCancelItIfDebugging(10000) },
  async function (this: ComplexWorld) {
    for (let i = 0; i < LISTS_LIMIT; i++) {
      const listData = {
        name: `Здесь был Максим + ${i + 1}`,
        purpose: "",
        note: "",
        items: [{ content: getStringUpToLimit(10) }],
      };

      await createList(listData, this.BACKEND_ADDRESS);
    }
  },
);

Then(
  "I expect to see the warning about lists limit reached",
  async function (this: ComplexWorld) {
    await this.expectLocated(LISTS_LIMIT_REACHED_WARNING).toBeInViewport();
  },
);
