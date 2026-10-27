// utilities.is-that-all-fields-in-essence-overviewed, ported: the set of
// fields registered through get-field must equal the keys-specification
// set. convert-keys-spec-to-set resolves the donor's spec/or of *-keys
// specs to the union of their key sets.
import { is, equalsValue } from "../support/world.ts";
import {
  ITEM_KEYWORDS_ORDER,
  LINKED_LIST_KEYWORDS_ORDER,
  SVERNIK_KEYWORDS_ORDER,
} from "../../src-ts/domain/svernik.ts";
import type { PayloadAccounted } from "./payloadAccounted.ts";

const KEYS_SPECIFICATIONS: Record<string, readonly string[]> = {
  "svernik.domain.svernik/svernik-keys": SVERNIK_KEYWORDS_ORDER,
  "svernik.domain.link-to-list/link-to-list-keys": LINKED_LIST_KEYWORDS_ORDER,
  "svernik.domain.item/item-keys": ITEM_KEYWORDS_ORDER,
};

export const isThatAllFieldsInEssenceOverviewed = (
  payloadAccounted: PayloadAccounted,
  specificationName: string,
): void => {
  const expectedKeys = KEYS_SPECIFICATIONS[specificationName];
  if (expectedKeys === undefined) {
    throw new Error(`Unknown keys specification: ${specificationName}`);
  }
  const fieldsChecked = [...payloadAccounted.fieldsChecked];
  is(
    equalsValue([...expectedKeys].sort(), fieldsChecked.sort()),
    `Expected the overviewed fields to be ${JSON.stringify([...expectedKeys].sort())}, got: ${JSON.stringify(fieldsChecked)}.`,
  );
};
