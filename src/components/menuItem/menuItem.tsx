import { mergeProps } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./menuItem.css";

export enum MenuItemTheme {
  Primary = "primary",
  Dangerous = "dangerous",
}

export enum MenuItemSize {
  Medium = "medium",
}

export type MenuItemProps = {
  theme?: MenuItemTheme;
  size?: MenuItemSize;
  disabled?: boolean | undefined;
  children: string;
  handleClick?: () => void;
  icon: IconName;
};

export const MenuItem = (props: Testable<MenuItemProps>) => {
  const mProps: Testable<Required<MenuItemProps>> = mergeProps(
    {
      theme: MenuItemTheme.Primary,
      size: MenuItemSize.Medium,
      disabled: false,
      handleClick: () => {},
    },
    props,
  );

  return (
    <li
      role="menuitem"
      class="menuItem"
      classList={{
        [`menuItem_${mProps.size}`]: true,
        [`menuItem_${mProps.theme}`]: !mProps.disabled,
        menuItem_disabled: mProps.disabled,
      }}
      aria-disabled={mProps.disabled}
      tabindex={mProps.disabled ? -1 : 0}
      onClick={() => {
        if (!mProps.disabled) {
          mProps.handleClick();
        }
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <Icon name={mProps.icon} size={IconSize.Small} />
      <span class="menuItem__text">{mProps.children}</span>
    </li>
  );
};
