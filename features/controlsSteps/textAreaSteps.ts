import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import {
  TEXT_AREA_TEST_IDS,
  type TextAreaMeaning,
} from "../list/listCreation/testIds.ts";

When(
  "I clear the {string} text area",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    await this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]).fill("");
  },
);
