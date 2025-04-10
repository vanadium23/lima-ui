import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";
import { INPUT_TEST_IDS, type InputMeaning } from "../listCreation/testIds.ts";

When(
  "I clear the {string} input",
  async function (this: ComplexWorld, inputMeaning: InputMeaning) {
    await this.locateByFullId(INPUT_TEST_IDS[inputMeaning]).fill("");
  },
);
