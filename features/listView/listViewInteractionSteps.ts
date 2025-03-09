import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";

import type { ComplexWorld } from "../context/hooks.ts";

Then(
  "I expect clipboard to contain items content",
  async function (this: ComplexWorld) {
    const expectedText = ["first item", "second item", "third item"]
      .map((item) => this.data[item] + "\n" || "")
      .join("");

    const clipboardContent = await this.page.evaluate(() =>
      navigator.clipboard.readText(),
    );

    expect(clipboardContent).toEqual(expectedText);
  },
);
