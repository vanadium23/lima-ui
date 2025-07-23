import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks";
import { SEARCH_TEST_IDS, type SearchPartMeaning } from "../search/testIds.ts";
import {
  OPEN_SEARCH_BUTTON,
  SEARCH_BUTTON,
  SEARCH_INPUT,
  SEARCH_RESULT,
  SEARCH_RESULTS,
} from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";
import { isDesktop, isMobile, isTablet } from "../utilities/discoverDevice.ts";
import { scrollToBottom } from "../utilities/scroll.ts";

Then("I expect to see search", async function (this: ComplexWorld) {
  if (isDesktop() || isTablet()) {
    await this.expectLocated(
      this.accounting.elements.registerTestId(SEARCH_INPUT),
    ).toBeInViewport();

    await this.expectLocated(
      this.accounting.elements.registerTestId(SEARCH_BUTTON),
    ).toBeInViewport();
  }

  if (isMobile()) {
    await this.expectLocated(
      this.accounting.elements.registerTestId(OPEN_SEARCH_BUTTON),
    ).toBeInViewport();
  }
});

Then(
  "I expect to see the search result with the following text: {string}",
  async function (this: ComplexWorld, expectedText: string) {
    const searchResultWithText = this.locateByIdParts(SEARCH_RESULT).filter({
      hasText: new RegExp(`^${expectedText}$`),
    });

    await expect(searchResultWithText).toBeInViewport();
  },
);

Then(
  "I expect to see the search {string}",
  async function (this: ComplexWorld, searchPartMeaning: SearchPartMeaning) {
    await this.expectLocated(
      SEARCH_TEST_IDS[searchPartMeaning],
    ).toBeInViewport();
  },
);

Then(
  "I expect not to see the search {string}",
  async function (this: ComplexWorld, searchPartMeaning: SearchPartMeaning) {
    await this.expectLocated(
      SEARCH_TEST_IDS[searchPartMeaning],
    ).not.toBeInViewport();
  },
);

When("I ensure search is visible", async function (this: ComplexWorld) {
  if (isMobile()) {
    await this.locateByIdParts(OPEN_SEARCH_BUTTON).click();
  }
});

Then(
  "I expect to have the following number of search results: {int}",
  async function (this: ComplexWorld, expectedSearchResultsQuantity: number) {
    await this.expectLocated(SEARCH_RESULT).toHaveCount(
      expectedSearchResultsQuantity,
    );
  },
);

const SEARCH_RESULT_IDS = {
  first: buildFullTestId(SEARCH_RESULT, 0),
  last: SEARCH_RESULT,
};

type SearchResultMeaning = keyof typeof SEARCH_RESULT_IDS;

When(
  "I press the {string} search result",
  async function (
    this: ComplexWorld,
    searchResultMeaning: SearchResultMeaning,
  ) {
    await this.locateByFullId(SEARCH_RESULT_IDS[searchResultMeaning]).click();
  },
);

When(
  "I scroll to the bottom of the search results",
  async function (this: ComplexWorld) {
    await this.locateByIdParts(SEARCH_RESULTS).evaluate(scrollToBottom);
  },
);

Then(
  "I expect to see the {string} search result",
  async function (
    this: ComplexWorld,
    searchResultMeaning: SearchResultMeaning,
  ) {
    if (searchResultMeaning === "last") {
      const lastSearchResult = this.locateByIdParts(SEARCH_RESULT).last();

      await expect(lastSearchResult).toBeInViewport();

      return;
    }

    await this.expectLocated(
      SEARCH_RESULT_IDS[searchResultMeaning],
    ).toBeInViewport();
  },
);
