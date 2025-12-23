export function logReturn<SomeType>(something: SomeType, label?: string | number): SomeType {
  if (label) {
    console.log(label, something);
  } else {
    console.log(something);
  }

  return something;
}

export const returnLog = logReturn;
