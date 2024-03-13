import type { SeveralTestIds } from "../testIds.ts";
import type {
  FullTestId,
  FullTestIdParts,
  TestId,
  TestSubId,
} from "../../src/components/utilities/testable.ts";

export const TEST_ID_ATTRIBUTE = "data-test-id";
export const TEST_SUB_ID_ATTRIBUTE = "data-test-sub-id";
export const ID_SUB_ID_SEPARATOR = "--";

export function buildTestableSelector(testId?: TestId): string {
  if (!testId) {
    return `[${TEST_ID_ATTRIBUTE}]`;
  }

  return `[${TEST_ID_ATTRIBUTE}="${testId}"]`;
}

export function buildTestableSubSelector(testSubId: TestSubId) {
  return `[${TEST_SUB_ID_ATTRIBUTE}="${testSubId}"]`;
}

export function buildFullTestId(testId: TestId, testSubId: TestSubId) {
  return [testId, testSubId]
    .filter((id) => id || id === 0)
    .join(ID_SUB_ID_SEPARATOR);
}

export function destructureFullTestId(fullTestId: FullTestId): FullTestIdParts {
  const [testId = "", testSubId = ""] = fullTestId.split(ID_SUB_ID_SEPARATOR);

  return {
    testId,
    testSubId,
  };
}

export function InPlaywrightExtractAllCompleteIds(
  elements: (HTMLElement | SVGElement)[],
  {
    testIdAttribute,
    testSubIdAttribute,
    idSubIdSeparator,
  }: {
    testIdAttribute: string;
    testSubIdAttribute: string;
    idSubIdSeparator: string;
  },
): SeveralTestIds {
  return elements.map(function extractCompleteId(
    element: HTMLElement | SVGElement,
  ): TestId {
    const testId = element.getAttribute(testIdAttribute) || "";
    const testSubId = element.getAttribute(testSubIdAttribute) || "";

    // The buildFullTestId function is not available in external Playwright browsers.
    return [testId, testSubId].filter((id) => id).join(idSubIdSeparator);
  });
}
