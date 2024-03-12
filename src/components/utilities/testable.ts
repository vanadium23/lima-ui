export type TestId = string;
export type TestSubId = string | number;

export type FullTestIdParts = {
  testId: TestId;
  testSubId?: TestSubId;
};

export type Testable<Props> = Props & FullTestIdParts;
