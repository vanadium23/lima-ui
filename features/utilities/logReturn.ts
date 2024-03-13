export function logReturn<SomeType>(something: SomeType): SomeType {
  console.log(something);

  return something;
}
