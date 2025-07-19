import { When } from "@cucumber/cucumber";

import {
  MY_LISTS,
  type PageMeaning,
  PAGES_MEANINGS,
} from "../../utilities/addresses.ts";
import { createAccountedTesting } from "../context/createAccountedTesting.ts";
import { type ComplexWorld, pagesAccounting } from "../context/hooks.ts";
import { LIST_STRIPE } from "../testIds.ts";
import { getTimeoutOrCancelItIfDebugging } from "../utilities/getTimeoutOrCancelItIfDebugging.ts";

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
  async function (
    this: ComplexWorld,
    pageMeaning: PageMeaning,
    accounting: string,
  ) {
    let accountedTesting = pagesAccounting[accounting];

    if (!accountedTesting) {
      accountedTesting = createAccountedTesting();

      pagesAccounting[accounting] = accountedTesting;
    }

    accountedTesting.registerTestId(PAGES_MEANINGS[pageMeaning]);

    await navigate(this, pageMeaning);
  },
);

async function navigate(complexWorld: ComplexWorld, pageMeaning: PageMeaning) {
  if (pageMeaning === "Latest List") {
    await complexWorld.navigate(MY_LISTS);

    await complexWorld.locateByIdParts(LIST_STRIPE).nth(0).click();

    return;
  }

  const address = PAGES_MEANINGS[pageMeaning];

  if (!address) throw new Error(`Unknown page meaning: ${pageMeaning}`);

  await complexWorld.navigate(address);
  await complexWorld.page.waitForLoadState("networkidle");
}
