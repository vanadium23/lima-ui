import { mergeProps } from "solid-js";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";
import "./navItem.css";

export enum NavItemTheme {
  Primary = "primary",
}

export enum NavItemSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type NavItemProps = {
  text: string;
  theme: NavItemTheme;
  size: NavItemSize;
  url: string;
  icon: IconName;
  isCurrent?: boolean;
};

const iconSize = {
  [NavItemSize.Small]: IconSize.Small,
  [NavItemSize.Medium]: IconSize.Medium,
  [NavItemSize.Large]: IconSize.Large,
};

export const NavItem = (props: Testable<NavItemProps>) => {
  const mProps: Testable<Required<NavItemProps>> = mergeProps(
    {
      isCurrent: false,
    },
    props,
  );

  return (
    <a
      href={mProps.url}
      role="menuitem"
      aria-current={mProps.isCurrent ? "page" : "false"}
      class={`navItem navItem_${mProps.theme} navItem_${mProps.size}`}
      classList={{
        navItem_current: mProps.isCurrent,
      }}
    >
      <Icon name={mProps.icon} size={iconSize[mProps.size]} />
      <span class="navItem__text">{mProps.text}</span>
    </a>
  );
};
