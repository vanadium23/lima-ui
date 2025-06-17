import { mergeProps } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./searchItem.css";

export enum SearchItemTheme {
  Primary = "primary",
}

export enum SearchItemSize {
  Medium = "medium",
}

export type SearchItemProps = {
  theme?: SearchItemTheme;
  size?: SearchItemSize;
  text: string;
  link: string;
};

export const SearchItem = (props: Testable<SearchItemProps>) => {
  const mProps: Testable<Required<SearchItemProps>> = mergeProps(
    {
      theme: SearchItemTheme.Primary,
      size: SearchItemSize.Medium,
    },
    props,
  );

  return (
    <li
      class={`searchItem searchItem_${mProps.theme} searchItem_${mProps.size}`}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <a class="searchItem__text" href={mProps.link}>
        {mProps.text}
      </a>
    </li>
  );
};
