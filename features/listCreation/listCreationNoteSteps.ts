import { Then, When } from "@cucumber/cucumber";
import type { ComplexWorld } from "../context/hooks.ts";
import {
  ACCORDION_TEST_IDS,
  type AccordionMeaning,
  TEXT_AREA_TEST_IDS,
  type TextAreaMeaning,
} from "./testIds.ts";
import {
  buildAccordionButtonTestId,
  buildAccordionContentTestId,
} from "../testIds.ts";
import { NOTE_TEXT_AREA_LIMIT } from "../../configuration.ts";
import { getStringUpToLimit } from "../utilities/getStringOfLength.ts";

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

const TEXT_AREA_LIMIT_RELATION = {
  note: NOTE_TEXT_AREA_LIMIT,
};

When(
  "I type some text with length less or equal to the one of {string} text area limit",
  async function (this: ComplexWorld, textAreaMeaning: TextAreaMeaning) {
    const textAreaLimit = TEXT_AREA_LIMIT_RELATION[textAreaMeaning];

    await this.locateByFullId(TEXT_AREA_TEST_IDS[textAreaMeaning]).fill(
      getStringUpToLimit(textAreaLimit),
    );
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
      this.accounting.registerTestId(accordionTestId),
    );
    await expectAccordion.toBeInViewport({ ratio: 1 });

    const expectAccordionButton = this.expectLocated(
      this.accounting.registerTestId(
        buildAccordionButtonTestId(accordionTestId),
      ),
    );
    await expectAccordionButton.toBeEnabled();

    const expectAccordionContent = this.expectLocated(
      buildAccordionContentTestId(accordionTestId),
    );
    await expectAccordionContent.toBeInViewport();
  },
);
