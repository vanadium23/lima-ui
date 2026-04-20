import { For, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { useDropdown } from "../dropdown/dropdown.tsx";
import type { MenuItemProps } from "../menuItem/menuItem.tsx";
import { MenuItem } from "../menuItem/menuItem.tsx";
import type { Testable } from "../utilities/testable";

import "./menu.css";

export enum MenuTheme {
  Primary = "primary",
}

export enum MenuSize {
  Medium = "medium",
}

type MenuProps = {
  theme?: MenuTheme;
  size?: MenuSize;
  children: MenuItemProps[];
};

export const Menu = (props: Testable<MenuProps>) => {
  const mProps: Testable<Required<MenuProps>> = mergeProps(
    {
      theme: MenuTheme.Primary,
      size: MenuSize.Medium,
    },
    props,
  );

  const dropdown = useDropdown();

  return (
    <ul
      role="menu"
      class="menu"
      classList={{
        [`menu_${mProps.size}`]: true,
        [`menu_${mProps.theme}`]: true,
      }}
      data-test-id={mProps.testId}
    >
      <For each={mProps.children}>
        {(menuItem) => (
          <MenuItem
            testId={DEFAULT_TEST_ID}
            testSubId={mProps.testSubId || "0"}
            {...menuItem}
            handleClick={() => {
              menuItem.handleClick?.();
              dropdown?.close();
            }}
          >
            {menuItem.children}
          </MenuItem>
        )}
      </For>
    </ul>
  );
};
