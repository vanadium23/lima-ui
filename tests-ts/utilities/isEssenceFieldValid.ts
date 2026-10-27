// utilities.is-essence-field-valid, ported: the value read through the
// accounted payload must satisfy the referenced domain specification.
import { is } from "../support/world.ts";
import type { PayloadAccounted } from "./payloadAccounted.ts";
import { ESSENCE_FIELD_SPECIFICATIONS } from "./validators.ts";

export const isEssenceAccountedFieldValid = (
  accounted: PayloadAccounted,
  pathToField: string[],
  specificationName: string,
): void => {
  const specification = ESSENCE_FIELD_SPECIFICATIONS[specificationName];
  if (specification === undefined) {
    throw new Error(`Unknown essence field specification: ${specificationName}`);
  }
  const value = accounted.getField(pathToField);
  is(
    specification(value),
    `Expected ${specificationName} at [${pathToField.join(", ")}], got: ${JSON.stringify(value)}.`,
  );
};
