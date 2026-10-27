// utilities.doseq-parallel, ported: zips the two sequences and handles
// corresponding elements (sequential loop — the assertion semantics are
// identical to the donor's doseq).
export const doseqParallel = <SomeElement, AnotherElement>(
  someSequence: SomeElement[],
  anotherSequence: AnotherElement[],
  handleCorrespondingElements: (
    someElement: SomeElement,
    anotherElement: AnotherElement,
  ) => void,
): void => {
  const sharedLength = Math.min(someSequence.length, anotherSequence.length);
  for (let index = 0; index < sharedLength; index += 1) {
    handleCorrespondingElements(someSequence[index]!, anotherSequence[index]!);
  }
};
