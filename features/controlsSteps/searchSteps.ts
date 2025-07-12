import { Then, When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks";
import { SEARCH_TEST_IDS, type SearchPartMeaning } from "../search/testIds.ts";
import { OPEN_SEARCH_BUTTON, SEARCH_BUTTON, SEARCH_INPUT } from "../testIds.ts";
import { isDesktop, isMobile, isTablet } from "../utilities/discoverDevice.ts";

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
