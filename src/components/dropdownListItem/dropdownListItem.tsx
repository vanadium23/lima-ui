import { mergeProps } from "solid-js";

import { URL_MY_LISTS } from "../../../utilities/addresses.ts";
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
  children: string;
  listId: string;
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
      class="dropdownListItem"
      classList={{
        [`dropdownListItem_${mProps.size}`]: true,
        [`dropdownListItem_${mProps.theme}`]: true,
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <a class="dropdownListItem__text" href={`${URL_MY_LISTS}/${mProps.listId}`}>
        {mProps.children}
      </a>
    </li>
  );
};
