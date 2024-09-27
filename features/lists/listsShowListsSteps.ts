import { Then, When } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import { LISTS_CREATE, SOME_LIST } from "../utilities/addresses.ts";
import { BUTTON_TEST_IDS, INPUT_TEST_IDS } from "../listCreation/testIds.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";
import {
  EDIT_LIST_INPUT_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
  LISTS_LIMIT,
} from "../../configuration.ts";
import { LIST_STRIPE } from "../testIds.ts";
import { TEST_SUB_ID_ATTRIBUTE } from "../utilities/buildTestableSelector.ts";
import { createList } from "../../src/services/createList.ts";

When("I add a list", async function (this: ComplexWorld) {
  await this.navigate(LISTS_CREATE);

  const inputs: [string, number][] = [
    [INPUT_TEST_IDS["list title"], LIST_TITLE_INPUT_LIMIT],
    [INPUT_TEST_IDS["list purpose"], LIST_PURPOSE_INPUT_LIMIT],
    [INPUT_TEST_IDS["first item"], EDIT_LIST_INPUT_LIMIT],
  ];

  for (const [input, limit] of inputs) {
    const inputText = getStringUpToLimit(limit);
    this.data[input] = inputText;
    await this.locateByFullId(input).fill(inputText);
  }

  await this.locateByFullId(BUTTON_TEST_IDS.create).click();
  await this.page.waitForURL(`**/${SOME_LIST}`);

  this.data.createdListId =
    (await this.page.evaluate(() =>
      window.location.pathname.split("/").pop(),
    )) || "";
});

Then("I expect to see created list", async function (this: ComplexWorld) {
  await this.expectLocated(
    this.accounting.registerTestIdAndSubId(
      LIST_STRIPE,
      this.data.createdListId,
    ),
  ).toBeInViewport();
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
      this.accounting.registerTestIdAndSubId(LIST_STRIPE, await listId);
    }

    await this.expectLocated(LIST_STRIPE).toHaveCount(listStripesQuantity);
  },
);

When("I add lists to their limit", async function (this: ComplexWorld) {
  for (let i = 0; i < LISTS_LIMIT; i++) {
    const listData = {
      name: `Здесь был Максим + ${i}`,
      items: [{ content: getStringUpToLimit(10) }],
    };
    await createList(listData, this.BACKEND_ADDRESS);
  }
});
