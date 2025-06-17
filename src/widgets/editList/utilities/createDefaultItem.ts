export function createDefaultItem(auto: boolean = false) {
  return { content: "", id: "", dragId: createDragId(), auto };
}

export function createDragId() {
  return (Math.random() * 1000000).toString();
}
