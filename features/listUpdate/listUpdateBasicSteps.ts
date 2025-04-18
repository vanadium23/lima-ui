import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks.ts";

When(
  "I wait for the list update to complete",
  async function (this: ComplexWorld) {
    await this.page.waitForLoadState("networkidle");
  },
);
