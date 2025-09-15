import { For, type JSX, mergeProps, type Ref, Show } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import type { MenuItemProps } from "../menuItem/menuItem.tsx";
import { MenuItem } from "../menuItem/menuItem.tsx";
import { createDroppable } from "../utilities/createDroppable.ts";
import type { Testable, TestId } from "../utilities/testable";

import "./dropdownMenu.css";

export enum DropdownMenuTheme {
  Primary = "primary",
}

export enum DropdownMenuSize {
  Medium = "medium",
}

type DropdownMenu = {
  theme?: DropdownMenuTheme;
  size?: DropdownMenuSize;
  menuItems: MenuItemProps[];
  dropDownMenuTestId: TestId;
  disabled?: boolean;
  loading?: boolean;
  component: (props: { ref: Ref<HTMLButtonElement>; handleClick: () => void }) => JSX.Element;
};

export const DropdownMenu = (props: Testable<DropdownMenu>) => {
  const mProps: Testable<Required<DropdownMenu>> = mergeProps(
    {
      theme: DropdownMenuTheme.Primary,
      size: DropdownMenuSize.Medium,
      disabled: false,
      loading: false,
    },
    props,
  );

  const [isMenuOpen, setIsMenuOpen, setMenuButtonRef, setMenuRef, floatingPosition] = createDroppable();

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
          <ul
            role="menu"
            class={`dropdownMenu dropdownMenu_${mProps.theme} dropdownMenu_${mProps.size}`}
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
            data-test-id={mProps.dropDownMenuTestId}
          >
            <For each={mProps.menuItems}>
              {(menuItem) => (
                <MenuItem
                  testId={DEFAULT_TEST_ID}
                  testSubId={mProps.testSubId || "0"}
                  {...menuItem}
                  handleClick={() => {
                    menuItem.handleClick?.();
                    setIsMenuOpen(false);
                  }}
                  isDisabled={menuItem.isDisabled || mProps.disabled}
                />
              )}
            </For>
          </ul>
        </Portal>
      </Show>
    </>
  );
};
