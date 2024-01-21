export function prepareARIALabel(
  ariaLabel: string,
): { "aria-label": string } | Record<string, never> {
  if (ariaLabel) return { "aria-label": ariaLabel };

  return {};
}
