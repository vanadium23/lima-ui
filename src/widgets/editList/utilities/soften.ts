export function soften(act: () => unknown, time = 500): void {
  setTimeout(act, time);
}
