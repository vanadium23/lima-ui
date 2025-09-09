import { For, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import type { SimpleList } from "../../widgets/editList/types.ts";
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
  lists: SimpleList[];
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
    <div class={`dropdownList dropdownList_${props.theme} dropdownList_${mProps.size}`}>
      <ul class="dropdownList__list scrollStyles" data-test-id={DEFAULT_TEST_ID}>
        <For each={mProps.lists}>
          {(list, index) => {
            return <DropdownListItem text={list.name} listId={list.id} testId={DEFAULT_TEST_ID} testSubId={index()} />;
          }}
        </For>
      </ul>
    </div>
  );
};
