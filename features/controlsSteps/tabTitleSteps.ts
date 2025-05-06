import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import { DEFAULT_TAB_TITLE, suffixTabTitle } from "../../utilities/tabTitle.ts";
import type { ComplexWorld } from "../context/hooks.ts";
import { PAGE_TAB_TITLE } from "../testIds.ts";

Then(
  "I expect to see the suffixed list title as tab title",
  async function (this: ComplexWorld) {
    await expectSuffixedTabTitle(this, this.data["list title"] || "");
  },
);

Then(
  "I expect to see the previous suffixed list title as tab title",
  async function (this: ComplexWorld) {
    await expectSuffixedTabTitle(this, this.oldData["list title"] || "");
  },
);

Then(
  "I expect to see the default tab title",
  async function (this: ComplexWorld) {
    await expectTabTitle(this, DEFAULT_TAB_TITLE);
  },
);

Then(
  "I expect to see the following suffixed tab title: {string}",
  async function (this: ComplexWorld, tabTitle: string) {
    await expectSuffixedTabTitle(this, tabTitle);
  },
);

async function expectSuffixedTabTitle(
  complexWorld: ComplexWorld,
  tabTitle: string,
) {
  expectTabTitle(complexWorld, suffixTabTitle(tabTitle));
}

async function expectTabTitle(complexWorld: ComplexWorld, tabTitle: string) {
  expect(await complexWorld.page.title()).toBe(tabTitle);

  complexWorld.accounting.elements.registerTestId(PAGE_TAB_TITLE);
}
