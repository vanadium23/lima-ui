// Ported from features/lists_count/lists_count_steps.clj — complete.
import { And, When, is, type TestData } from "../../support/world.ts";
import { requestListsCountParsed } from "../../utilities/requestCount.ts";

When(
  "I request the current count of lists",
  async (data: TestData): Promise<TestData> => {
    const token = data.auth?.sessionToken;
    const { status, countResult, response } = await requestListsCountParsed(token);
    return { ...data, status, countResult, countResponse: response };
  },
);

And(
  "I store the initial lists count",
  (data: TestData): TestData => {
    const countResult = data.countResult as { listsCount?: number } | null;
    return {
      ...data,
      additionalData: {
        ...(data.additionalData ?? {}),
        initialCount: countResult?.listsCount,
      },
    };
  },
);

And(
  "I see the lists count increased by {int}",
  (data: TestData, expectedIncrease: number): TestData => {
    const countResult = data.countResult as { listsCount?: number } | null;
    const initialCount = data.additionalData?.initialCount as number;
    const currentCount = Number(countResult?.listsCount);
    const actualIncrease = currentCount - initialCount;
    is(
      actualIncrease === expectedIncrease,
      `Expected the lists count to increase by ${expectedIncrease}, got ${actualIncrease} (${currentCount} vs ${initialCount}).`,
    );
    return data;
  },
);
