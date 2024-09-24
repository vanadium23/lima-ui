import { Then, When } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import { LISTS_CREATE, SOME_LIST } from "../utilities/addresses.ts";
import { BUTTON_TEST_IDS, INPUT_TEST_IDS } from "../listCreation/testIds.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";
import {
  EDIT_LIST_INPUT_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../configuration.ts";
import { LIST_STRIPE } from "../testIds.ts";

When("I add a list", async function (this: ComplexWorld) {
  await this.navigate(LISTS_CREATE);

  const inputs: [string, number][] = [
    [INPUT_TEST_IDS["list title"], LIST_TITLE_INPUT_LIMIT],
    [INPUT_TEST_IDS["list purpose"], LIST_PURPOSE_INPUT_LIMIT],
    [INPUT_TEST_IDS["first item"], EDIT_LIST_INPUT_LIMIT],
  ];

  for (const [input, limit] of inputs) {
    await this.locateByFullId(input).fill(getStringUpToLimit(limit));
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
