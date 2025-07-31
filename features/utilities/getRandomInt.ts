export function getRandomIntBelowMax(max: number) {
  return Math.floor(Math.random() * max);
}

export function getRandomNaturalBelowMax(max: number) {
  return Math.floor(Math.random() * (max - 1)) + 1;
}
