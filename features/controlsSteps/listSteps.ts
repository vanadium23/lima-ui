import { When } from "@cucumber/cucumber";

import { EDIT_LIST_INPUT_LIMIT, LIST_PURPOSE_INPUT_LIMIT, LIST_TITLE_INPUT_LIMIT } from "../../configuration.ts";
import { TESTS_URL_SOME_LIST, URL_CREATE_LIST } from "../../utilities/addresses.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import { BUTTON_TEST_IDS, INPUT_TEST_IDS } from "../list/listCreation/testIds.ts";
import { LIST_TITLE_INPUT } from "../testIds.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";

When("I add a list", { timeout: getTimeoutOrCancelItIfDebugging(20000) }, async function (this: ComplexWorld) {
  await fillListFields(this);
  await saveList(this);
});

When(
  "I add a list with the following title: {string}",
  { timeout: getTimeoutOrCancelItIfDebugging(20000) },
  async function (this: ComplexWorld, title: string) {
    await fillListFields(this);

    await this.locateByFullId(LIST_TITLE_INPUT).fill(title);

    await saveList(this);
  },
);

async function fillListFields(complexWorld: ComplexWorld) {
  await complexWorld.navigate(URL_CREATE_LIST);

  const inputs: [keyof typeof INPUT_TEST_IDS, number][] = [
    ["list title", LIST_TITLE_INPUT_LIMIT],
    ["list purpose", LIST_PURPOSE_INPUT_LIMIT],
    ["automatic item", EDIT_LIST_INPUT_LIMIT],
  ];

  for (const [input, limit] of inputs) {
    const inputText = getStringUpToLimit(limit);
    complexWorld.data[input] = inputText;
    await complexWorld.locateByFullId(INPUT_TEST_IDS[input]).fill(inputText);
  }
}

async function saveList(complexWorld: ComplexWorld) {
  await complexWorld.locateByFullId(BUTTON_TEST_IDS.save).click();
  await complexWorld.page.waitForURL(`**${TESTS_URL_SOME_LIST}`);
}
