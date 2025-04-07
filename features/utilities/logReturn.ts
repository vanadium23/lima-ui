export function logReturn<SomeType>(
  something: SomeType,
  label?: string,
): SomeType {
  if (label) {
    console.log(label, something);
  } else {
    console.log(something);
  }

  return something;
}
