import { Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import {
  TESTS_URL_LISTS_WITH_NETWORK_ERROR,
  TESTS_URL_SOME_LIST,
  URL_CREATE_LIST,
  URL_MY_LISTS,
} from "../../utilities/addresses.ts";
import { createAccountedTesting } from "../context/createAccountedTesting.ts";
import { type ComplexWorld, pagesAccounting } from "../context/hooks.ts";
import { LIST_STRIPE } from "../testIds.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";

export const PAGES_MEANINGS = {
  "List Creation": URL_CREATE_LIST,
  "My Lists": `${URL_MY_LISTS}/`,
  "My Lists without trailing /": URL_MY_LISTS,
  "My Lists with failed lists loading": TESTS_URL_LISTS_WITH_NETWORK_ERROR,
  "Latest List": TESTS_URL_SOME_LIST,
  "Some List": TESTS_URL_SOME_LIST,
};

type PageMeaning = keyof typeof PAGES_MEANINGS;

When(
  "I open {string} page",
  { timeout: getTimeoutOrCancelItIfDebugging(10000) },
  async function (this: ComplexWorld, pageMeaning: PageMeaning) {
    await navigate(this, pageMeaning);
  },
);

When(
  "I open {string} page with {string} accounting",
  { timeout: getTimeoutOrCancelItIfDebugging(10000) },
  async function (this: ComplexWorld, pageMeaning: PageMeaning, accounting: string) {
    let accountedTesting = pagesAccounting[accounting];

    if (!accountedTesting) {
      accountedTesting = createAccountedTesting();

      pagesAccounting[accounting] = accountedTesting;
    }

    accountedTesting.registerTestId(PAGES_MEANINGS[pageMeaning]);

    await navigate(this, pageMeaning);
  },
);

Then("I expect to be on the {string} page", async function (this: ComplexWorld, pageMeaning: PageMeaning) {
  throwIfUnknownPageMeaning(pageMeaning);

  await expect(this.page).toHaveURL(new RegExp(PAGES_MEANINGS[pageMeaning]));
});

async function navigate(complexWorld: ComplexWorld, pageMeaning: PageMeaning) {
  if (pageMeaning === "Latest List") {
    await complexWorld.navigate(URL_MY_LISTS);

    await complexWorld.locateByIdParts(LIST_STRIPE).nth(0).click();

    return;
  }

  throwIfUnknownPageMeaning(pageMeaning);

  await complexWorld.navigate(PAGES_MEANINGS[pageMeaning]);
  await complexWorld.page.waitForLoadState("networkidle");
}

function throwIfUnknownPageMeaning(pageMeaning: PageMeaning): never | void {
  const address = PAGES_MEANINGS[pageMeaning];

  if (!address) throw new Error(`Unknown page meaning: ${pageMeaning}`);
}
