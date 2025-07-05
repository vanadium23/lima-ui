import { Then } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks";
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
