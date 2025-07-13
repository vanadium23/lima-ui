import type {
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";
import type { SeveralTestIds } from "../testIds.ts";
import { buildFullTestId } from "../utilities/buildTestableSelector.ts";

export interface AccountedTesting {
  testIds: SeveralTestIds;
  active: boolean;

  registerTestId(testId: TestId): TestId;

  registerTestIdAndSubId(
    testId: TestId,
    testSubId: TestSubId | null | undefined,
  ): TestId;

  registerSeveralTestIds(severalTestIds: SeveralTestIds): void;

  getTestIds(): SeveralTestIds;

  clearTestIds(): void;
}

export function createAccountedTesting(
  active: boolean = true,
): AccountedTesting {
  return {
    testIds: [],
    active,

    registerTestId(testId) {
      this.active = true;

      this.testIds.push(testId);

      return testId;
    },

    registerTestIdAndSubId(testId, testSubId) {
      return this.registerTestId(buildFullTestId(testId, testSubId ?? ""));
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
}
