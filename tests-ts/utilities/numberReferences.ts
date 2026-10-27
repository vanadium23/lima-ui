// resolve-number-reference (lists_deleting_sublists_steps.clj),
// ported: numeric references like 'pre-limit', 'on-limit' resolve
// against a configured limit, everything else is a plain integer.
import { ITEMS_MAX_LENGTH, LISTS_MAX_LENGTH } from "../../src-ts/domain/svernik.ts";

export const resolveNumberReference = (reference: string, limit: number): number => {
  switch (reference) {
    case "right-after-limit":
      return limit + 1;
    case "pre-pre-limit":
      return limit - 2;
    case "pre-limit":
      return limit - 1;
    case "on-limit":
      return limit;
    default:
      return Number.parseInt(reference, 10);
  }
};

export const resolveListsQuantity = (reference: string): number =>
  resolveNumberReference(reference, LISTS_MAX_LENGTH);

// resolve-items-index: index references count from 0, so the limit is
// the max index (items-max-length - 1), not the element count.
export const resolveItemsIndex = (reference: string): number =>
  resolveNumberReference(reference, ITEMS_MAX_LENGTH - 1);

export const resolveItemsNumber = (reference: string): number =>
  resolveNumberReference(reference, ITEMS_MAX_LENGTH);
