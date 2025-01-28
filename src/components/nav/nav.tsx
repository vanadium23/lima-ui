import { type Component, mergeProps } from "solid-js";
import "./nav.css";
import { IconName } from "../icon/icon.tsx";
import { NavItem, NavItemSize, NavItemTheme } from "../navItem/navItem.tsx";

export enum NavTheme {
  Primary = "primary",
}

export enum NavSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type NavProps = {
  theme?: NavTheme;
  size?: NavSize;
};

const navItemSize = {
  [NavSize.Small]: NavItemSize.Small,
  [NavSize.Medium]: NavItemSize.Medium,
  [NavSize.Large]: NavItemSize.Large,
};

export const Nav: Component<NavProps> = (props) => {
  const mProps: Required<NavProps> = mergeProps(
    {
      theme: NavTheme.Primary,
      size: NavSize.Medium,
    },
    props,
  );

  return (
    <nav class="nav">
      <ul class="nav__list" role="menubar" aria-label="Navigation">
        <li class="nav__item" role="none">
          <NavItem
            url="/lists/create/"
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Новый список"
            icon={IconName.ListPlus}
          />
        </li>
        <li role="none">
          <NavItem
            url="/lists/"
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Мои списки"
            icon={IconName.List}
          />
        </li>
        <li role="none">
          <NavItem
            url="/lists/"
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Мои чек-листы"
            icon={IconName.ListChecks}
          />
        </li>
      </ul>
    </nav>
  );
};
