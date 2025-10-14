import { For, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import type { SimpleList } from "../../types/types.ts";
import { DropdownListItem } from "../dropdownListItem/dropdownListItem.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./dropdownList.css";

export enum DropdownListTheme {
  Primary = "primary",
}

export enum DropdownListSize {
  Medium = "medium",
}

export type DropdownListProps = {
  theme?: DropdownListTheme;
  size?: DropdownListSize;
  children: SimpleList[];
};

export const DropdownList = (props: Testable<DropdownListProps>) => {
  const mProps: Testable<Required<DropdownListProps>> = mergeProps(
    {
      theme: DropdownListTheme.Primary,
      size: DropdownListSize.Medium,
    },
    props,
  );

  return (
    <div
      class="dropdownList"
      classList={{
        [`dropdownList_${mProps.size}`]: true,
        [`dropdownList_${mProps.theme}`]: true,
      }}
    >
      <ul class="dropdownList__list scrollStyles" data-test-id={DEFAULT_TEST_ID}>
        <For each={mProps.children}>
          {(list, index) => {
            return (
              <DropdownListItem listId={list.id} testId={DEFAULT_TEST_ID} testSubId={index()}>
                {list.name}
              </DropdownListItem>
            );
          }}
        </For>
      </ul>
    </div>
  );
};
