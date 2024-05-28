import { Then, When } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  ACCORDION_TEST_IDS,
  type AccordionMeaning,
  TEXT_AREA_TEST_IDS,
  type TextAreaMeaning,
} from "./testIds.ts";
import { buildAccordionButtonTestId } from "../testIds.ts";

When(
  "I press on the {string} accordion",
  async function (this: ComplexWorld, accordionMeaning: AccordionMeaning) {
    await this.locateByFullId(
      buildAccordionButtonTestId(ACCORDION_TEST_IDS[accordionMeaning]),
    ).click();
  },
);

Then(
  "I expect to see the {string} text area ready for typing",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const expectNoteTextArea = this.expectLocated(
      TEXT_AREA_TEST_IDS[textAreaMeaning],
    );

    await expectNoteTextArea.toBeInViewport();
    await expectNoteTextArea.toBeEnabled();
  },
);

Then(
  "I expect not to see the {string} text area",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    await this.expectLocated(
      TEXT_AREA_TEST_IDS[textAreaMeaning],
    ).not.toBeVisible();
  },
);
