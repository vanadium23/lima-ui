import { When } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks";
import {
  INPUT_TEST_IDS,
  type InputMeaning,
} from "../list/listCreation/testIds.ts";

When(
  "I type the following text into the {string}: {string}",
  async function (this: ComplexWorld, inputName: InputMeaning, text: string) {
    await this.locateByFullId(INPUT_TEST_IDS[inputName]).fill(text);
  },
);
