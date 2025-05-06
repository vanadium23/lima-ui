import { Then, When } from "@cucumber/cucumber";

import {
  EDIT_LIST_INPUT_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
  LISTS_LIMIT,
} from "../../configuration.ts";
import { createList } from "../../src/widgets/editList/services/createList.ts";
import {
  LISTS_CREATE,
  LISTS_WITH_NETWORK_ERROR,
  SOME_LIST,
} from "../../utilities/addresses.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  BUTTON_TEST_IDS,
  INPUT_TEST_IDS,
} from "../list/listCreation/testIds.ts";
import {
  DEFAULT_TEST_ID,
  LIST_STRIPE,
  LIST_STRIPE_LINK_TO_VIEW,
  LISTS_LIMIT_REACHED_WARNING,
} from "../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../utilities/buildTestableSelector.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";

When("I add a list", { timeout: 20000 }, async function (this: ComplexWorld) {
  await this.navigate(LISTS_CREATE);

  const inputs: [keyof typeof INPUT_TEST_IDS, number][] = [
    ["list title", LIST_TITLE_INPUT_LIMIT],
    ["list purpose", LIST_PURPOSE_INPUT_LIMIT],
    ["first item", EDIT_LIST_INPUT_LIMIT],
  ];

  for (const [input, limit] of inputs) {
    const inputText = getStringUpToLimit(limit);
    this.data[input] = inputText;
    await this.locateByFullId(INPUT_TEST_IDS[input]).fill(inputText);
  }

  await this.locateByFullId(BUTTON_TEST_IDS.save).click();
  await this.page.waitForURL(`**${SOME_LIST}`);

  this.listIds.unshift(
    (await this.page.evaluate(() =>
      window.location.pathname.split("/").pop(),
    )) || "",
  );
});

Then("I expect to see created list", async function (this: ComplexWorld) {
  const createdListId = this.listIds[0] || DEFAULT_TEST_ID;

  await this.expectLocated(
    this.accounting.elements.registerTestIdAndSubId(LIST_STRIPE, createdListId),
  ).toBeInViewport();

  this.accounting.elements.registerTestIdAndSubId(
    LIST_STRIPE_LINK_TO_VIEW,
    createdListId,
  );
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
    const listStripes = this.locate(LIST_STRIPE);

    const listsIds = (await listStripes.all()).map((listStripe) =>
      listStripe.getAttribute(TEST_SUB_ID_ATTRIBUTE),
    );

    for (const listId of listsIds) {
      this.accounting.elements.registerTestIdAndSubId(
        LIST_STRIPE,
        await listId,
      );
      this.accounting.elements.registerTestIdAndSubId(
        LIST_STRIPE_LINK_TO_VIEW,
        await listId,
      );
    }

    await this.expectLocated(LIST_STRIPE).toHaveCount(listStripesQuantity);
  },
);

When(
  "I add lists to their limit",
  { timeout: 10000 },
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

When(
  "I open Lists page with failed lists loading",
  async function (this: ComplexWorld) {
    await this.navigate(LISTS_WITH_NETWORK_ERROR);
  },
);
