export const TEST_ID_ATTRIBUTE = "data-test-id";
export const TEST_SUB_ID_ATTRIBUTE = "data-test-sub-id";

export function buildTestSelector(testId?: string): string {
  if (!testId) {
    return `[${TEST_ID_ATTRIBUTE}]`;
  }
  return `[${TEST_ID_ATTRIBUTE}="${testId}"]`;
}

export function extractCompleteId(element: HTMLElement): string {
  const testId = element.getAttribute(TEST_ID_ATTRIBUTE) || "";
  const testSubId = element.getAttribute(TEST_SUB_ID_ATTRIBUTE) || "";

  return testId + testSubId;
}
