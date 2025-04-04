export function createDefaultItem() {
  return { content: "", id: "", dragId: createDragId() };
}

export function createDragId() {
  return crypto.randomUUID();
}
