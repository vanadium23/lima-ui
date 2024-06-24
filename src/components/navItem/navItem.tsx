import { type Component } from "solid-js";
import { mergeProps } from "solid-js";
import "./navItem.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";

export enum NavItemTheme {
  Primary = "primary",
}

export enum NavItemSize {
  Medium = "medium",
}

type NavItemProps = {
  text: string;
  theme: NavItemTheme;
  size: NavItemSize;
  url: string;
  icon: IconName;
  isCurrent?: boolean;
};

export const NavItem: Component<NavItemProps> = (props) => {
  const mProps: Required<NavItemProps> = mergeProps(
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
      <Icon name={mProps.icon} size={IconSize.x12} />
      <span class="navItem__text">{mProps.text}</span>
    </a>
  );
};
