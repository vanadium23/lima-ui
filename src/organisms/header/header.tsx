import {
  HEADER,
  SEARCH_BUTTON,
  SEARCH_INPUT,
  TOGGLE_TOOLS_PANEL_BUTTON,
} from "../../../features/testIds.ts";
import { IconName } from "../../components/icon/icon.tsx";
import {
  IconButton,
  IconButtonTheme,
} from "../../components/iconButton/iconButton.tsx";
import { Input, InputTheme } from "../../components/input/input.tsx";
import { Logo } from "../../components/logo/logo.tsx";
import { ToggleIconButton } from "../../components/toggleIconButton/toggleIconButton.tsx";
import { isHidden, setIsHidden } from "../../state/toolsPanelState.ts";

import "./header.css";

export const Header = () => {
  return (
    <header class="header" data-test-id={HEADER}>
      <div class="header__logo">
        <Logo />
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
        <ToggleIconButton
          iconName={IconName.SquareHalf}
          ariaLabel={"Переключить панель инструментов"}
          testId={TOGGLE_TOOLS_PANEL_BUTTON}
          defaultIsToggled={!isHidden()}
          setGlobalToggled={(toggled) => setIsHidden(!toggled)}
        />
      </div>
    </header>
  );
};
