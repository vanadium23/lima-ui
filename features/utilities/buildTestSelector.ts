import type { SeveralTestIds, TestId } from "../testIds.ts";

export const TEST_ID_ATTRIBUTE = "data-test-id";
export const TEST_SUB_ID_ATTRIBUTE = "data-test-sub-id";

export function buildTestSelector(testId?: string): string {
  if (!testId) {
    return `[${TEST_ID_ATTRIBUTE}]`;
  }
  return `[${TEST_ID_ATTRIBUTE}="${testId}"]`;
}

export function extractAllCompleteIds(
  elements: (HTMLElement | SVGElement)[],
  {
    testIdAttribute,
    testSubIdAttribute,
  }: {
    testIdAttribute: string;
    testSubIdAttribute: string;
  },
): SeveralTestIds {
  return elements.map(function extractCompleteId(
    element: HTMLElement | SVGElement,
  ): TestId {
    const testId = element.getAttribute(testIdAttribute) || "";
    const testSubId = element.getAttribute(testSubIdAttribute) || "";

    return testId + testSubId;
  });
}
