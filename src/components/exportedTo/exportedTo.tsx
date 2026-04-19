import { For, mergeProps } from "solid-js";

import { EXPORTED_TO_LIST, EXPORTED_TO_LIST_ITEM } from "../../../features/testIds.ts";
import type { SimpleList } from "../../types/types.ts";
import { DropdownListItem } from "../dropdownListItem/dropdownListItem.tsx";

import "./exportedTo.css";

export enum ExportedToTheme {
  Primary = "primary",
}

export enum ExportedToSize {
  Medium = "medium",
}

export type ExportedToProps = {
  theme?: ExportedToTheme;
  size?: ExportedToSize;
  children: SimpleList[];
  title: string;
};

export const ExportedTo = (props: ExportedToProps) => {
  const mProps: Required<ExportedToProps> = mergeProps(
    {
      theme: ExportedToTheme.Primary,
      size: ExportedToSize.Medium,
    },
    props,
  );

  return (
    <div
      class="exportedTo"
      classList={{
        [`exportedTo_${mProps.size}`]: true,
        [`exportedTo_${mProps.theme}`]: true,
      }}
    >
      <span class="exportedTo__title" id="exportedToDropdownTitle">
        {mProps.title}
      </span>

      <ul
        class="exportedTo__list scrollStyles"
        aria-labelledby="exportedToDropdownTitle"
        data-test-id={EXPORTED_TO_LIST}
      >
        <For each={mProps.children}>
          {(list, index) => {
            return (
              <DropdownListItem listId={list.id} testId={EXPORTED_TO_LIST_ITEM} testSubId={index()}>
                {list.name}
              </DropdownListItem>
            );
          }}
        </For>
      </ul>
    </div>
  );
};
