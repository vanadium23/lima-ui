import { mergeProps } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./navItem.css";

export enum NavItemTheme {
  Primary = "primary",
}

export enum NavItemSize {
  Medium = "medium",
}

type NavItemProps = {
  theme?: NavItemTheme;
  size?: NavItemSize;
  children: string;
  href: string;
  icon: IconName;
  current?: boolean;
  disabled?: boolean;
};

export const NavItem = (props: Testable<NavItemProps>) => {
  const mProps: Testable<Required<NavItemProps>> = mergeProps(
    {
      theme: NavItemTheme.Primary,
      size: NavItemSize.Medium,
      current: false,
      disabled: false,
    },
    props,
  );

  return (
    <a
      href={!mProps.disabled ? mProps.href : "#"}
      role="menuitem"
      aria-current={mProps.current ? "page" : "false"}
      class="navItem"
      classList={{
        [`navItem_${mProps.size}`]: true,
        [`navItem_${mProps.theme}`]: !mProps.disabled,
        navItem_disabled: mProps.disabled,
        navItem_current: mProps.current,
      }}
      aria-disabled={mProps.disabled}
    >
      <Icon name={mProps.icon} size={IconSize.Medium} />
      <span class="navItem__text">{mProps.children}</span>
    </a>
  );
};
