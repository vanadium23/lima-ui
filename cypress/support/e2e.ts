// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import "./commands";
import type { SeveralTestIds, TestId } from "../../features/testIds.ts";

interface AccountedTestingMethods {
  registerTestId(testId: TestId): TestId;
  registerTestIdAndSubId(testId: TestId, testSubId?: TestId): void;
  registerSeveralTestIds(severalTestIds: SeveralTestIds): void;
  getTestIds(): SeveralTestIds;
}
export interface AccountedTesting
  extends Mocha.Context,
    AccountedTestingMethods {}

beforeEach(function () {
  const testIds: SeveralTestIds = [];

  const accountedTesting: AccountedTestingMethods = {
    registerTestId(testId) {
      testIds.push(testId);

      return testId;
    },

    registerTestIdAndSubId(testId: TestId, testSubId: TestId = "") {
      this.registerTestId(testId + testSubId);
    },

    registerSeveralTestIds(severalTestIds: SeveralTestIds): void {
      severalTestIds.forEach((testId) => this.registerTestId(testId));
    },

    getTestIds(): SeveralTestIds {
      return testIds.sort();
    },
  };

  Object.assign(this, accountedTesting);
});
