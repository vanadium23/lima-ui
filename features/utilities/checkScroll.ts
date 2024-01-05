export function noVerticalScroll(element: HTMLElement): boolean {
  return element.scrollHeight === element.offsetHeight;
}
