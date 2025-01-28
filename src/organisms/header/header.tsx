import { type Component } from "solid-js";
import "./header.css";
import { Logo } from "../../components/logo/logo.tsx";
import { Input, InputTheme } from "../../components/input/input.tsx";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import {
  IconButton,
  IconButtonTheme,
} from "../../components/iconButton/iconButton.tsx";
import { ToggleIconButton } from "../../components/toggleIconButton/toggleIconButton.tsx";

import { IconName } from "../../components/icon/icon.tsx";
import { isHidden, setIsHidden } from "../../state/toolsPanelState.ts";

export const Header: Component = () => {
  return (
    <header class="header">
      <div class="header__logo">
        <Logo />
      </div>
      <div class="header__search">
        <Input
          theme={InputTheme.Tertiary}
          name={"Search"}
          placeholder={"Поиск"}
          maxLength={80}
          testId={DEFAULT_TEST_ID}
          isCountable={false}
        />
        <IconButton
          iconName={IconName.MagnifyingGlass}
          ariaLabel={"Начать поиск"}
          testId={DEFAULT_TEST_ID}
          theme={IconButtonTheme.Tertiary}
        />
      </div>
      <div class="header__controls">
        <ToggleIconButton
          iconName={IconName.SquareHalf}
          ariaLabel={"Переключить панель инструментов"}
          testId={DEFAULT_TEST_ID}
          defaultIsToggled={!isHidden()}
          setGlobalToggled={(toggled) => setIsHidden(!toggled)}
        />
      </div>
    </header>
  );
};
