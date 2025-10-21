import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { TEXT_AREA_TEST_IDS, type TextAreaMeaning } from "../list/listCreation/testIds.ts";

When("I clear the {string} text area", async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
  await this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]).fill("");
});

When(
  "I type the following text into the {string} text area: {string}",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning, text: string) {
    await this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]).fill(text);
  },
);

When(
  "I add the following text into the {string} text area: {string}",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning, text: string) {
    const textArea = this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]);

    textArea.press("End");

    for (const char of text) {
      await textArea.press(char);
    }
  },
);
