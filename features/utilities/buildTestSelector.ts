export const TEST_ID_ATTRIBUTE = "data-test-id";

export function buildTestSelector(testId?: string): string {
  if (!testId) {
    return `[${TEST_ID_ATTRIBUTE}]`;
  }
  return `[${TEST_ID_ATTRIBUTE}="${testId}"]`;
}
