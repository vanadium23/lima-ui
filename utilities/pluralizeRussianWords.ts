export type RuWordForms = [string, string, string];
/**
 * Возвращает корректную русскую словоформу по целому числу.
 *
 * @param count Целое число, по которому выбирается форма.
 * @param forms Кортеж из трёх форм в порядке: [именит. ед.ч., родит. ед.ч., родит. мн.ч.].
 * @returns Только слово в корректной форме без числа.
 *
 * @example
 * pluralizeRu(1, ["день", "дня", "дней"]);
 */

export function pluralizeRu(count: number, forms: RuWordForms): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;

  if (n > 10 && n < 20) return forms[2];
  if (n1 === 1) return forms[0];
  if (n1 >= 2 && n1 <= 4) return forms[1];

  return forms[2];
}
