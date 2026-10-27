// utilities.handle-raw-data, ported. `{}`-placeholder steps receive
// Examples-cell strings; "absent" is the sentinel for a field the
// scenario does not provide, everything else is parsed as JSON
// (json/read-str semantics: "" → "", "123" → 123, "{}" → {}, "null" →
// null, '"some"' → "some").
export const ABSENT = Symbol("absent");

export const parseJsonTestData = (value: string): unknown | typeof ABSENT =>
  value === "absent" ? ABSENT : JSON.parse(value);

export const assocIfNotAbsent = <T extends Record<string, unknown>>(
  data: T,
  field: string,
  value: unknown,
): T => (value === ABSENT ? data : { ...data, [field]: value });

export const assocParsedFromJsonIfNotAbsent = <T extends Record<string, unknown>>(
  data: T,
  field: string,
  value: string,
): T => assocIfNotAbsent(data, field, parseJsonTestData(value));

export const assocConvertedToJson = <T extends Record<string, unknown>>(
  data: T,
  field: string,
  value: string,
): T => ({ ...data, [field]: parseJsonTestData(value) });

// keywordize-essence / fieldify-essence: the donor converts between
// keyword-keyed and fieldified-name-keyed maps via a JSON round-trip;
// JSON keys here are already the fieldified camelCase names, so both are
// fresh copies with identical entries.
export const keywordizeEssence = <T extends Record<string, unknown>>(essence: T): T => ({
  ...essence,
});

export const fieldifyEssence = <T extends Record<string, unknown>>(essence: T): T => ({
  ...essence,
});

// assoc-in family: donor paths are keyword/integer vectors; here
// camelCase JSON key paths with numeric vector indices. Missing
// intermediate maps are created (Clojure assoc-in).
export const assocInPath = <T>(data: T, path: (string | number)[], value: unknown): T => {
  const [head, ...rest] = path;
  if (head === undefined) {
    return value as T;
  }
  // Clojure assoc-in preserves vectors: (assoc-in {:items [...]}
  // [:items 0 :k] v) updates the element INSIDE the vector, it never
  // converts it to a keyed map.
  if (Array.isArray(data)) {
    const copy = [...data];
    copy[head as number] = assocInPath(data[head as number], rest, value);
    return copy as unknown as T;
  }
  const base =
    typeof data === "object" && data !== null
      ? (data as Record<string, unknown>)
      : {};
  return { ...base, [head]: assocInPath(base[head as string], rest, value) } as T;
};

export const assocInIfNotAbsent = <T extends Record<string, unknown>>(
  data: T,
  path: (string | number)[],
  value: unknown,
): T => (value === ABSENT ? data : assocInPath(data, path, value));

export const assocInParsedFromJsonIfNotAbsent = <T extends Record<string, unknown>>(
  data: T,
  path: (string | number)[],
  value: string,
): T => assocInIfNotAbsent(data, path, parseJsonTestData(value));

export const assocInConvertedToJson = <T extends Record<string, unknown>>(
  data: T,
  path: (string | number)[],
  value: string,
): T => assocInPath(data, path, parseJsonTestData(value));
