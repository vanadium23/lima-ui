// utilities.maps-operations, ported.
// maps-not-intersecting?: no keys of another-data are present in data
// (donor (empty? (select-keys data (keys another-data)))).
export const mapsNotIntersecting = (
  data: Record<string, unknown>,
  anotherData: Record<string, unknown>,
): boolean => Object.keys(anotherData).every((key) => !(key in data));

// subtract-map: dissoc of every subtrahend key from the minuend.
export const subtractMap = (
  minuend: Record<string, unknown>,
  subtrahend: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = { ...minuend };
  for (const key of Object.keys(subtrahend)) {
    delete result[key];
  }
  return result;
};

const addIndexOnlyToString = (index: number, value: unknown): unknown =>
  typeof value === "string" ? `${value}${index}` : value;

// add-index-to-strings-for-uniqueness: update-vals appending the index
// to every string value.
export const addIndexToStringsForUniqueness = (
  index: number,
  someMap: Record<string, unknown>,
): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(someMap)) {
    result[key] = addIndexOnlyToString(index, value);
  }
  return result;
};
