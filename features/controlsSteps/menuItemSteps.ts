import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";
import { MENUITEM_TEST_IDS, type MenuitemMeaning } from "../list/listCreation/testIds.ts";

/* Basic actions */

Then("I press the {string} menu item", async function (this: ComplexWorld, menuItemMeaning: MenuitemMeaning) {
  await this.locateByFullId(MENUITEM_TEST_IDS[menuItemMeaning]).click();
});

/* State checks */

Then(
  "I expect to see the {string} menu item disabled",
  async function (this: ComplexWorld, menuItemMeaning: MenuitemMeaning) {
    const element = this.locateByFullId(this.accounting.itemAdders.registerTestId(MENUITEM_TEST_IDS[menuItemMeaning]));

    await expect(element).toHaveAttribute("aria-disabled", "true");
  },
);

Then(
  "I expect to see the {string} menu item enabled",
  async function (this: ComplexWorld, menuItemMeaning: MenuitemMeaning) {
    const element = this.locateByFullId(this.accounting.itemAdders.registerTestId(MENUITEM_TEST_IDS[menuItemMeaning]));

    await expect(element).toHaveAttribute("aria-disabled", "false");
  },
);
