import { When } from "@cucumber/cucumber";

import type { ComplexWorld } from "../context/hooks";
import {
  closeToolsPanelForMobile,
  openToolsPanelForMobile,
} from "../utilities/handleToolsButton.ts";

When("I ensure the tools panel is open", async function (this: ComplexWorld) {
  await openToolsPanelForMobile(this);
});

When(
  "I ensure the tools panel does not disturb",
  async function (this: ComplexWorld) {
    await closeToolsPanelForMobile(this);
  },
);
