import { For, type JSX, mergeProps, type Ref, Show } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import type { SimpleList } from "../../types/types.ts";
import { DropdownListItem } from "../dropdownListItem/dropdownListItem.tsx";
import { createDroppable } from "../utilities/createDroppable.ts";
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
  component: (props: { ref: Ref<HTMLButtonElement>; handleClick: () => void }) => JSX.Element;
  title?: string;
};

export const DropdownList = (props: Testable<DropdownListProps>) => {
  const mProps: Testable<Required<DropdownListProps>> = mergeProps(
    {
      theme: DropdownListTheme.Primary,
      size: DropdownListSize.Medium,
      title: "",
    },
    props,
  );

  const [isMenuOpen, setIsMenuOpen, setMenuButtonRef, setMenuRef, floatingPosition] = createDroppable("bottom-start");

  return (
    <>
      <Dynamic
        component={mProps.component}
        ref={setMenuButtonRef}
        handleClick={() => {
          setIsMenuOpen((prev) => !prev);
        }}
      />
      <Show when={isMenuOpen()}>
        <Portal mount={document.body}>
          <div
            class="dropdownList"
            classList={{
              [`dropdownList_${mProps.size}`]: true,
              [`dropdownList_${mProps.theme}`]: true,
            }}
            style={
              floatingPosition
                ? {
                    position: floatingPosition.strategy,
                    top: `${(floatingPosition.y ?? 0) / 10}rem`,
                    left: `${(floatingPosition.x ?? 0) / 10}rem`,
                    display: floatingPosition.middlewareData.hide?.referenceHidden ? "none" : "flex",
                  }
                : {}
            }
            ref={setMenuRef}
          >
            <Show when={mProps.title}>
              <span class="dropdownList__title" id="importedDropdownTitle">
                {mProps.title}
              </span>
            </Show>

            <ul
              class="dropdownList__list scrollStyles"
              aria-labelledby="importedDropdownTitle"
              data-test-id={DEFAULT_TEST_ID}
            >
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
        </Portal>
      </Show>
    </>
  );
};
