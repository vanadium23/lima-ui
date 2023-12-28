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

export interface AccountedTesting extends Mocha.Context {
  registerTestId(testId: string): string;
  getTestIds(): string[];
}

beforeEach(function () {
  const testIds: string[] = [];

  Object.assign(this, {
    registerTestId(testId: string): string {
      testIds.push(testId);

      return testId;
    },

    getTestIds(): string[] {
      return testIds.sort();
    },
  });
});
