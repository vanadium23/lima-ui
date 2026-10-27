// utilities.build-random, ported. crypto-based randomness: the donor
// uses random-uuid / rand-nth, both non-seeded.
import { randomInt, randomUUID } from "node:crypto";

const RANDOM_ALPHABET = "abcdefghijklmnopqrstuvwxyz";

export const buildRandomString = (): string => randomUUID();

export const buildRandomBoolean = (): boolean => randomInt(2) === 0;

export const createRandomString = (length: number): string => {
  let result = "";
  for (let index = 0; index < length; index += 1) {
    result += RANDOM_ALPHABET[randomInt(RANDOM_ALPHABET.length)];
  }
  return result;
};
