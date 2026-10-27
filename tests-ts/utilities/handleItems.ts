// utilities.handle-items, ported.
import { is } from "../support/world.ts";
import { ITEMS } from "../../src-ts/domain/svernik.ts";
import { assocInPath, assocInParsedFromJsonIfNotAbsent } from "./handleRawData.ts";
import { presentKeys } from "./presentKeys.ts";

const SVERNIK_DATA_KEY = "svernikData";

// Clojure truthiness for the :svernik-data presence check (nil/false are
// absent; 0/"" count as present).
const isPresent = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== false;

const addToItems = (
  listData: Record<string, unknown> | undefined,
  items: unknown,
): Record<string, unknown> => {
  const base = listData ?? {};
  const itemsData = (base[ITEMS] as unknown[] | undefined) ?? [];
  // Non-empty sequential items are concatenated, anything else is
  // appended as a single element (donor concat/conj choice).
  const itemsIsNonEmptySequence = Array.isArray(items) && items.length > 0;
  const joined = itemsIsNonEmptySequence
    ? [...itemsData, ...(items as unknown[])]
    : [...itemsData, items];
  return { ...base, [ITEMS]: joined };
};

const parseFromJsonAndAddToItems = (
  listData: Record<string, unknown> | undefined,
  items: unknown,
): Record<string, unknown> => addToItems(listData, JSON.parse(items as string));

const addSpecificallyToItems = (
  listData: Record<string, unknown>,
  itemsData: unknown,
  add: (
    listData: Record<string, unknown> | undefined,
    items: unknown,
  ) => Record<string, unknown>,
): Record<string, unknown> => {
  if (isPresent(listData[SVERNIK_DATA_KEY])) {
    return {
      ...listData,
      [SVERNIK_DATA_KEY]: add(
        listData[SVERNIK_DATA_KEY] as Record<string, unknown>,
        itemsData,
      ),
    };
  }
  return add(listData, itemsData);
};

export const addParsedToItemsForUpdateOrCreation = (
  listData: Record<string, unknown>,
  itemsData: string,
): Record<string, unknown> =>
  addSpecificallyToItems(listData, itemsData, parseFromJsonAndAddToItems);

export const addToItemsForUpdateOrCreation = (
  listData: Record<string, unknown>,
  itemsData: unknown,
): Record<string, unknown> =>
  addSpecificallyToItems(listData, itemsData, addToItems);

export const areValidItems = (
  svernikAccounted: { payload?: Record<string, unknown> },
  isValid: (item: unknown) => boolean,
): void => {
  const items = (svernikAccounted.payload?.[ITEMS] as unknown[] | undefined) ?? [];
  for (const item of items) {
    is(isValid(item), `Item is not valid: ${JSON.stringify(item)}.`);
  }
};

export const getIndexOfLastItem = (
  svernikData: Record<string, unknown>,
  itemsPath: (string | number)[],
): number => {
  let current: unknown = svernikData;
  for (const segment of itemsPath) {
    current = (current as Record<string, unknown> | undefined)?.[
      segment as string
    ];
  }
  return ((current as unknown[] | undefined)?.length ?? 0) - 1;
};

export const getItemsPathInData = (
  svernikData: Record<string, unknown>,
): (string | number)[] => [...presentKeys(svernikData, SVERNIK_DATA_KEY), ITEMS];

export type AssocInMethod = (
  data: Record<string, unknown>,
  path: (string | number)[],
  value: unknown,
) => Record<string, unknown>;

export const assocInLastItemWith = (
  svernikData: Record<string, unknown>,
  assocInMethod: AssocInMethod,
  field: string,
  value: unknown,
): Record<string, unknown> => {
  const itemsPath = getItemsPathInData(svernikData);
  const lastItemIndex = getIndexOfLastItem(svernikData, itemsPath);
  return assocInMethod(svernikData, [...itemsPath, lastItemIndex, field], value);
};

export const assocInLastItem = (
  svernikData: Record<string, unknown>,
  field: string,
  value: string,
): Record<string, unknown> =>
  assocInLastItemWith(
    svernikData,
    assocInParsedFromJsonIfNotAbsent as AssocInMethod,
    field,
    value,
  );

export const assocSeveralInLastItem = (
  svernikData: Record<string, unknown>,
  fieldsAndValues: Record<string, unknown>,
): Record<string, unknown> => {
  let result = svernikData;
  for (const [field, value] of Object.entries(fieldsAndValues)) {
    result = assocInLastItemWith(result, assocInPath as AssocInMethod, field, value);
  }
  return result;
};

export const getItemsInResults = (
  svernikChangeResults: Record<string, unknown>,
): unknown =>
  svernikChangeResults.items ??
  (svernikChangeResults.preparedList as Record<string, unknown> | undefined)?.items;
