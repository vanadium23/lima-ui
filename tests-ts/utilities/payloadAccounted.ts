// utilities.payload-accounted, ported: the FieldsAccounting protocol
// becomes a class — get-field registers the visited field and reads the
// payload, so "I overviewed all fields" steps can later compare the
// registry against the full keyword order.
export class PayloadAccounted {
  readonly fieldsChecked = new Set<string>();

  constructor(readonly payload: Record<string, unknown>) {}

  getField(pathToField: string[]): unknown {
    const lastField = pathToField[pathToField.length - 1];
    if (lastField !== undefined) {
      this.fieldsChecked.add(lastField);
    }
    let current: unknown = this.payload;
    for (const segment of pathToField) {
      current =
        typeof current === "object" && current !== null
          ? (current as Record<string, unknown>)[segment]
          : undefined;
    }
    // Clojure (get-in payload path) yields nil on an absent read — the
    // ported equivalent is null (JSON nil), never undefined.
    return current ?? null;
  }
}

export const getPayloadAccounted = (
  payload: Record<string, unknown>,
): PayloadAccounted => new PayloadAccounted(payload);
