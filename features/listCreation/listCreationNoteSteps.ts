import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { NOTE_TEXT_AREA_LIMIT } from "../../configuration.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
} from "../testIds.ts";
import {
  getStringLongerThanLowerLimit,
  getStringUpToLimit,
} from "../utilities/getStringOfLength.ts";

import {
  ACCORDION_TEST_IDS,
  type AccordionMeaning,
  TEXT_AREA_TEST_IDS,
  type TextAreaMeaning,
} from "./testIds.ts";

When(
  "I press on the {string} accordion",
  async function (this: ComplexWorld, accordionMeaning: AccordionMeaning) {
    await this.locateByFullId(
      buildAccordionButtonTestId(ACCORDION_TEST_IDS[accordionMeaning]),
    ).click();
  },
);

Then(
  "I expect to see the {string} text area enabled",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const expectNoteTextArea = this.expectLocated(
      this.accounting.elements.registerTestId(
        TEXT_AREA_TEST_IDS[textAreaMeaning],
      ),
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

const TEXT_AREA_LIMIT_RELATION = {
  "list note": NOTE_TEXT_AREA_LIMIT,
};

When(
  "I type some text with length less or equal to the one of {string} text area limit",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const textAreaLimit = TEXT_AREA_LIMIT_RELATION[textAreaMeaning];

    const text = getStringUpToLimit(textAreaLimit);

    this.data[textAreaMeaning] = text;

    await this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]).fill(text);
  },
);

When(
  "I remember the text typed in the {string} text area",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    this.data.noteValue = await this.locateByFullId(
      TEXT_AREA_TEST_IDS[textAreaMeaning],
    ).inputValue();
  },
);

Then(
  "I expect to see the remembered text in the {string} text area",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    await this.expectLocated(TEXT_AREA_TEST_IDS[textAreaMeaning]).toHaveValue(
      this.data.noteValue || "",
    );
  },
);

Then(
  "I expect to fully see the expanded {string} accordion ready for collapsing",
  async function (this: ComplexWorld, accordionMeaning: AccordionMeaning) {
    const accordionTestId = ACCORDION_TEST_IDS[accordionMeaning];

    const expectAccordion = this.expectLocated(
      this.accounting.elements.registerTestId(accordionTestId),
    );
    await expectAccordion.toBeInViewport({ ratio: 1 });

    const expectAccordionButton = this.expectLocated(
      this.accounting.elements.registerTestId(
        buildAccordionButtonTestId(accordionTestId),
      ),
    );
    await expectAccordionButton.toBeEnabled();

    const expectAccordionContent = this.expectLocated(
      this.accounting.elements.registerTestId(
        buildAccordionContentTestId(accordionTestId),
      ),
    );
    await expectAccordionContent.toBeInViewport();
  },
);

When(
  "I focus {string} text area",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    await this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]).focus();
  },
);

When(
  "I type some text with length more than of {string} text area limit",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const textAreaLimit = TEXT_AREA_LIMIT_RELATION[textAreaMeaning];

    await this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]).fill(
      getStringLongerThanLowerLimit(textAreaLimit),
    );
  },
);

Then(
  "I expect {string} text area content length to be equal to its limit",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const textAreaValueLength = (
      await this.locateByFullId(
        TEXT_AREA_TEST_IDS[textAreaMeaning],
      ).inputValue()
    ).length;

    const textAreaLimit = TEXT_AREA_LIMIT_RELATION[textAreaMeaning];

    expect(textAreaValueLength).toBe(textAreaLimit);
  },
);
