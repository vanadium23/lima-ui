export type Testable<Props> = Props & {
  testId: string;
  testSubId?: string | number;
};
