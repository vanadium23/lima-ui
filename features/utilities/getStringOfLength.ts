import {
  getRandomIntBelowMax,
  getRandomNaturalBelowMax,
} from "./getRandomInt.ts";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut morbi tincidunt augue interdum velit euismod in pellentesque. Ac turpis egestas sed tempus. Id interdum velit laoreet id. Justo donec enim diam vulputate ut pharetra. Volutpat est velit egestas dui id ornare. A diam sollicitudin tempor id eu nisl nunc. Eu augue ut lectus arcu bibendum. Odio morbi quis commodo odio. Id interdum velit laoreet id. Neque volutpat ac tincidunt vitae semper quis lectus. Morbi tincidunt augue interdum velit euismod. Pellentesque elit ullamcorper dignissim cras tincidunt. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Enim nec dui nunc mattis enim. Urna molestie at elementum eu facilisis sed odio. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Pellentesque habitant morbi tristique senectus et netus.";

export function getStringOfLength(length: number): string {
  const randomStart = getRandomIntBelowMax(loremIpsum.length - length);

  const string = loremIpsum.slice(randomStart, randomStart + length);

  const startingSpacesCount = string.match(/^\s+/)?.[0].length ?? 0;
  const endingSpacesCount = string.match(/\s+$/)?.[0].length ?? 0;

  return string
    .replace(/^\s+/g, ".".repeat(startingSpacesCount))
    .replace(/\s+$/g, ".".repeat(endingSpacesCount));
}

export function getStringUpToLimit(limit: number): string {
  return getStringOfLength(getRandomNaturalBelowMax(limit));
}

export function getStringLongerThanLowerLimit(limit: number): string {
  const LONGER_ENSURER = 1;
  const stringLength =
    limit +
    LONGER_ENSURER +
    Math.round(Math.random() * (loremIpsum.length - limit - LONGER_ENSURER));

  return getStringOfLength(stringLength);
}

export function getStringCloseToLimit(
  length: number,
  distance: number,
): string {
  return getStringOfLength(length - getRandomIntBelowMax(distance + 1));
}
