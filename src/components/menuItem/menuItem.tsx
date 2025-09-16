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
  isDisabled?: boolean | undefined;
  text: string;
  handleClick?: () => void;
  icon: IconName;
};

export const MenuItem = (props: Testable<MenuItemProps>) => {
  const mProps: Testable<Required<MenuItemProps>> = mergeProps(
    {
      theme: MenuItemTheme.Primary,
      size: MenuItemSize.Medium,
      isDisabled: false,
      handleClick: () => {},
    },
    props,
  );

  return (
    <li
      role="menuitem"
      class={`menuItem menuItem_${mProps.theme} menuItem_${mProps.size}`}
      classList={{
        menuItem_disabled: mProps.isDisabled,
      }}
      aria-disabled={mProps.isDisabled}
      tabindex={mProps.isDisabled ? -1 : 0}
      onClick={() => {
        if (!mProps.isDisabled) {
          mProps.handleClick();
        }
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <Icon name={mProps.icon} size={IconSize.Small} />
      <span class="menuItem__text">{mProps.text}</span>
    </li>
  );
};
