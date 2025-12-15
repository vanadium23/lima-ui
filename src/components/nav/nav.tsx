import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { URL_CREATE_LIST, URL_MY_LISTS } from "../../../utilities/addresses.ts";
import { location } from "../../state/locationState.ts";
import { Divider } from "../divider/divider.tsx";
import { IconName } from "../icon/types.ts";
import { NavItem, NavItemSize, NavItemTheme } from "../navItem/navItem.tsx";

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
  isListsLimitReached: boolean;
};

const navItemSize = {
  [NavSize.Medium]: NavItemSize.Medium,
};

export const Nav = (props: NavProps) => {
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
            href={URL_CREATE_LIST}
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            icon={IconName.ListPlus}
            testId={DEFAULT_TEST_ID}
            current={location() === URL_CREATE_LIST}
            disabled={mProps.isListsLimitReached}
          >
            Новый список
          </NavItem>
        </li>
        <li role="none">
          <NavItem
            href={URL_MY_LISTS}
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            icon={IconName.List}
            testId={DEFAULT_TEST_ID}
            current={location() === URL_MY_LISTS || location().startsWith(`${URL_MY_LISTS}/list-`)}
          >
            Мои списки
          </NavItem>
        </li>
        <li role="none">
          <NavItem
            href={URL_MY_LISTS}
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            icon={IconName.ListChecks}
            testId={DEFAULT_TEST_ID}
            current={location() === URL_MY_LISTS}
          >
            Мои чек-листы
          </NavItem>
        </li>
        <Divider />
        <li role="none">
          <NavItem
            href="/stories/button/buttonStory"
            theme={NavItemTheme.Primary}
            size={navItemSize[mProps.size]}
            icon={IconName.Books}
            testId={DEFAULT_TEST_ID}
          >
            Сторибук
          </NavItem>
        </li>
      </ul>
    </nav>
  );
};
