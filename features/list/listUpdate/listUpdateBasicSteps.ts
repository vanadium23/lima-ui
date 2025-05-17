import { When } from "@cucumber/cucumber";

import { soften } from "../../../src/widgets/editList/utilities/soften.ts";
import type { ComplexWorld } from "../../context/hooks.ts";

When(
  "I wait for the list update to complete",
  async function (this: ComplexWorld) {
    await this.page.waitForLoadState("networkidle");
    // soften также применяется в интерфейсе для более плавного снятия загрузки.
    await soften(() => {}, 1000);
  },
);
