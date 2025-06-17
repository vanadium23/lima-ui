import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { LISTS, LISTS_CREATE } from "../../../utilities/addresses.ts";
import { location } from "../../state/locationState.ts";
import { isLimitReached } from "../../state/reachListsLimit.ts";
import { Divider } from "../divider/divider.tsx";
import { IconName } from "../icon/icon.tsx";
import { NavItem, NavItemSize, NavItemTheme } from "../navItem/navItem.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./nav.css";

export enum NavTheme {
  Primary = "primary",
}

export enum NavSize {
  Medium = "medium",
}

type NavProps = {
  theme?: NavTheme;
  size?: NavSize;
};

const navItemSize = {
  [NavSize.Medium]: NavItemSize.Medium,
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
            url={LISTS_CREATE}
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Новый список"
            icon={IconName.ListPlus}
            testId={DEFAULT_TEST_ID}
            isCurrent={location() === LISTS_CREATE}
            isDisabled={isLimitReached()}
          />
        </li>
        <li role="none">
          <NavItem
            url={LISTS}
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Мои списки"
            icon={IconName.List}
            testId={DEFAULT_TEST_ID}
            isCurrent={
              location() === LISTS || location().startsWith(`${LISTS}list-`)
            }
          />
        </li>
        <li role="none">
          <NavItem
            url={LISTS}
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Мои чек-листы"
            icon={IconName.ListChecks}
            testId={DEFAULT_TEST_ID}
            isCurrent={location() === LISTS}
          />
        </li>
        <Divider />
        <li role="none">
          <NavItem
            url="/stories/button/buttonStory"
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            text="Сторибук"
            icon={IconName.Books}
            testId={DEFAULT_TEST_ID}
          />
        </li>
      </ul>
    </nav>
  );
};
