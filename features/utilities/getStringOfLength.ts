const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut morbi tincidunt augue interdum velit euismod in pellentesque. Ac turpis egestas sed tempus. Id interdum velit laoreet id. Justo donec enim diam vulputate ut pharetra. Volutpat est velit egestas dui id ornare. A diam sollicitudin tempor id eu nisl nunc. Eu augue ut lectus arcu bibendum. Odio morbi quis commodo odio. Id interdum velit laoreet id. Neque volutpat ac tincidunt vitae semper quis lectus. Morbi tincidunt augue interdum velit euismod. Pellentesque elit ullamcorper dignissim cras tincidunt. Lacus sed viverra tellus in hac habitasse platea dictumst vestibulum. Enim nec dui nunc mattis enim. Urna molestie at elementum eu facilisis sed odio. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Pellentesque habitant morbi tristique senectus et netus.";

function getStringOfLength(length: number): string {
  return loremIpsum.slice(0, length);
}

export function getStringUpToLimit(limit: number): string {
  const stringLength = Math.round(Math.random() * limit);

  return getStringOfLength(stringLength);
}
