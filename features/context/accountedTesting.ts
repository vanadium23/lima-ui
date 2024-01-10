import type { SeveralTestIds, TestId } from "../testIds.ts";

interface AccountedTesting {
  testIds: SeveralTestIds;
  registerTestId(testId: TestId): TestId;
  registerTestIdAndSubId(testId: TestId, testSubId: TestId | null): void;
  registerSeveralTestIds(severalTestIds: SeveralTestIds): void;
  getTestIds(): SeveralTestIds;
  clearTestIds(): void;
}

export const accountedTesting: AccountedTesting = {
  testIds: [],

  registerTestId(testId) {
    this.testIds.push(testId);

    return testId;
  },

  registerTestIdAndSubId(testId, testSubId) {
    this.registerTestId(testId + (testSubId || ""));
  },

  registerSeveralTestIds(severalTestIds): void {
    severalTestIds.forEach((testId) => this.registerTestId(testId));
  },

  getTestIds() {
    return [...this.testIds].sort();
  },

  clearTestIds() {
    this.testIds = [];
  },
};
