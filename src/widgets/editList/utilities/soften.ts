export function soften(act: () => unknown): void {
  setTimeout(act, 500);
}
