import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { location } from "../../state/locationState.ts";
import { isLimitReached } from "../../state/reachListsLimit.ts";
import { IconName } from "../icon/icon.tsx";
import { NavItem, NavItemSize, NavItemTheme } from "../navItem/navItem.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./nav.css";

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

export const Nav = (props: Testable<NavProps>) => {
  const mProps: Testable<Required<NavProps>> = mergeProps(
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
            testId={DEFAULT_TEST_ID}
            isCurrent={location() === "/lists/create/"}
            isDisabled={isLimitReached()}
          />
        </li>
        <li role="none">
          <NavItem
            url="/lists/"
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Мои списки"
            icon={IconName.List}
            testId={DEFAULT_TEST_ID}
            isCurrent={
              location() === "/lists/" || location().startsWith("/lists/list-")
            }
          />
        </li>
        <li role="none">
          <NavItem
            url="/lists/"
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Мои чек-листы"
            icon={IconName.ListChecks}
            testId={DEFAULT_TEST_ID}
            isCurrent={location() === "/lists/"}
          />
        </li>
      </ul>
    </nav>
  );
};
