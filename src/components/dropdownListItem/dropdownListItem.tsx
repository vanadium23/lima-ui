import { mergeProps } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./dropdownListItem.css";

export enum DropdownListItemTheme {
  Primary = "primary",
}

export enum DropdownListItemSize {
  Medium = "medium",
}

export type DropdownListItemProps = {
  theme?: DropdownListItemTheme;
  size?: DropdownListItemSize;
  text: string;
  link: string;
};

export const DropdownListItem = (props: Testable<DropdownListItemProps>) => {
  const mProps: Testable<Required<DropdownListItemProps>> = mergeProps(
    {
      theme: DropdownListItemTheme.Primary,
      size: DropdownListItemSize.Medium,
    },
    props,
  );

  return (
    <li
      class={`dropdownListItem dropdownListItem_${mProps.theme} dropdownListItem_${mProps.size}`}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <a class="dropdownListItem__text" href={mProps.link}>
        {mProps.text}
      </a>
    </li>
  );
};
