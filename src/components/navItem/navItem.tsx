import { mergeProps } from "solid-js";

import { Icon, IconName, IconSize } from "../icon/icon.tsx";
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
  text: string;
  url: string;
  icon: IconName;
  isCurrent?: boolean;
  isDisabled?: boolean;
};

const iconSize = {
  [NavItemSize.Medium]: IconSize.Large,
};

export const NavItem = (props: Testable<NavItemProps>) => {
  const mProps: Testable<Required<NavItemProps>> = mergeProps(
    {
      theme: NavItemTheme.Primary,
      size: NavItemSize.Medium,
      isCurrent: false,
      isDisabled: false,
    },
    props,
  );

  return (
    <a
      href={!mProps.isDisabled ? mProps.url : "#"}
      role="menuitem"
      aria-current={mProps.isCurrent ? "page" : "false"}
      class={`navItem navItem_${mProps.theme} navItem_${mProps.size}`}
      classList={{
        navItem_current: mProps.isCurrent,
        navItem_disabled: mProps.isDisabled,
      }}
      aria-disabled={mProps.isDisabled}
    >
      <Icon name={mProps.icon} size={iconSize[mProps.size]} />
      <span class="navItem__text">{mProps.text}</span>
    </a>
  );
};
