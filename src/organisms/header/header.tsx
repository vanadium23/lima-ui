import { Show } from "solid-js";

import {
  HEADER,
  OPEN_SEARCH_BUTTON,
  TOGGLE_SIDEBAR_BUTTON,
  TOGGLE_TOOLS_PANEL_BUTTON,
} from "../../../features/testIds.ts";
import { URL_MY_LISTS } from "../../../utilities/addresses.ts";
import { IconName } from "../../components/icon/types.ts";
import {
  IconButton,
  IconButtonTheme,
} from "../../components/iconButton/iconButton.tsx";
import { Logo } from "../../components/logo/logo.tsx";
import { ToggleIconButton } from "../../components/toggleIconButton/toggleIconButton.tsx";
import { location } from "../../state/locationState.ts";
import { searchState } from "../../state/searchState.ts";
import { panelState } from "../../state/sidebarsStateManager.ts";
import { Search } from "../../widgets/search/search.tsx";

import "./header.css";

type HeaderProps = {
  list404?: boolean;
};

export const Header = (props: HeaderProps) => {
  const showToggleIconButton = (): boolean => {
    const currentLocation: string = location();

    return (
      !props.list404 &&
      currentLocation !== URL_MY_LISTS &&
      currentLocation !== URL_MY_LISTS.slice(0, -1)
    );
  };

  return (
    <header class="header" data-test-id={HEADER}>
      <div class="header__inner">
        <div class="header__burger">
          <ToggleIconButton
            iconName={IconName.List}
            testId={TOGGLE_SIDEBAR_BUTTON}
            ariaLabel={"Переключить меню"}
            isToggled={!panelState.isSidebarHidden()}
            setGlobalToggled={panelState.toggleSidebar}
            id="sidebarToggle"
          />
        </div>
        <div class="header__logo">
          <Logo />
        </div>
      </div>
      <div class="header__search">
        <Search />
      </div>
      <div class="header__controls">
        <div class="header__searchOpen">
          <IconButton
            iconName={IconName.MagnifyingGlass}
            ariaLabel={"Открыть поиск"}
            testId={OPEN_SEARCH_BUTTON}
            theme={IconButtonTheme.Tertiary}
            handleClick={searchState.open}
          />
        </div>
        <div class="header__toggleToolsPanelButton">
          <Show when={showToggleIconButton()}>
            <ToggleIconButton
              iconName={IconName.SquareHalf}
              ariaLabel={"Переключить панель инструментов"}
              testId={TOGGLE_TOOLS_PANEL_BUTTON}
              isToggled={!panelState.isToolsPanelHidden()}
              setGlobalToggled={panelState.toggleToolsPanel}
              id="toolsPanelToggle"
            />
          </Show>
        </div>
      </div>
    </header>
  );
};
