import { Show } from "solid-js";

import {
  DEFAULT_TEST_ID,
  HEADER,
  SEARCH_BUTTON,
  SEARCH_INPUT,
  TOGGLE_TOOLS_PANEL_BUTTON,
} from "../../../features/testIds.ts";
import { LISTS } from "../../../utilities/addresses.ts";
import { IconName } from "../../components/icon/icon.tsx";
import {
  IconButton,
  IconButtonTheme,
} from "../../components/iconButton/iconButton.tsx";
import { Input, InputTheme } from "../../components/input/input.tsx";
import { Logo } from "../../components/logo/logo.tsx";
import { ToggleIconButton } from "../../components/toggleIconButton/toggleIconButton.tsx";
import { location } from "../../state/locationState.ts";
import { panelState } from "../../state/sidebarsStateManager.ts";

import "./header.css";

type HeaderProps = {
  list404?: boolean;
};

export const Header = (props: HeaderProps) => {
  const showToggleIconButton = (): boolean => {
    const currentLocation: string = location();

    return (
      !props.list404 &&
      currentLocation !== LISTS &&
      currentLocation !== LISTS.slice(0, -1)
    );
  };

  return (
    <header class="header" data-test-id={HEADER}>
      <div class="header__inner">
        <div class="header__burger">
          <ToggleIconButton
            iconName={IconName.List}
            testId={DEFAULT_TEST_ID}
            ariaLabel={"Переключить меню"}
            isToggled={!panelState.isSidebarHidden()}
            setGlobalToggled={panelState.toggleSidebar}
          />
        </div>
        <div class="header__logo">
          <Logo />
        </div>
      </div>
      <div class="header__search">
        <Input
          theme={InputTheme.Tertiary}
          name={"Search"}
          placeholder={"Поиск"}
          maxLength={80}
          testId={SEARCH_INPUT}
          isCountable={false}
        />
        <IconButton
          iconName={IconName.MagnifyingGlass}
          ariaLabel={"Начать поиск"}
          testId={SEARCH_BUTTON}
          theme={IconButtonTheme.Tertiary}
        />
      </div>
      <div class="header__controls">
        <Show when={showToggleIconButton()}>
          <ToggleIconButton
            iconName={IconName.SquareHalf}
            ariaLabel={"Переключить панель инструментов"}
            testId={TOGGLE_TOOLS_PANEL_BUTTON}
            isToggled={!panelState.isToolsPanelHidden()}
            setGlobalToggled={panelState.toggleToolsPanel}
          />
        </Show>
      </div>
    </header>
  );
};
