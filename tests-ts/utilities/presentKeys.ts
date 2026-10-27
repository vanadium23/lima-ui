// utilities.present-keys, ported: only those of the requested keys which
// are present in the map.
export const presentKeys = (
  someMap: Record<string, unknown>,
  ...keysToFind: string[]
): string[] => keysToFind.filter((key) => key in someMap);
