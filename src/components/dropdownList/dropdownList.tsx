import { For, mergeProps } from "solid-js";

import { SEARCH_RESULT, SEARCH_RESULTS } from "../../../features/testIds.ts";
import type { DropdownListType } from "../../widgets/editList/types.ts";
import { DropdownListItem } from "../dropdownListItem/dropdownListItem.tsx";

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
  lists: DropdownListType[];
};

export const DropdownList = (props: DropdownListProps) => {
  const mProps: Required<DropdownListProps> = mergeProps(
    {
      theme: DropdownListTheme.Primary,
      size: DropdownListSize.Medium,
    },
    props,
  );

  return (
    <div
      class={`dropdownList dropdownList_${props.theme} dropdownList_${mProps.size}`}
    >
      <ul class="dropdownList__list scrollStyles" data-test-id={SEARCH_RESULTS}>
        <For each={mProps.lists}>
          {(list, index) => {
            return (
              <DropdownListItem
                text={list.name}
                link={list.id}
                testId={SEARCH_RESULT}
                testSubId={index()}
              />
            );
          }}
        </For>
      </ul>
    </div>
  );
};
