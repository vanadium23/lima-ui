export function createDefaultItem(auto: boolean = false) {
  return { content: "", id: "", dragId: createDragId(), auto };
}

export function createDragId() {
  return crypto.randomUUID();
}
