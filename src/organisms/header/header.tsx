import { type Component } from "solid-js";
import "./header.css";
import { Logo } from "../../components/logo/logo.tsx";
import {
  BasicInput,
  InputSize,
  InputTheme,
} from "../../components/basicInput/basicInput.tsx";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../../components/iconButton/iconButton.tsx";
import { IconName } from "../../components/icon/icon.tsx";

export const Header: Component = () => {
  return (
    <header class="header">
      <div class="header__logo">
        <Logo />
      </div>
      <div class="header__search">
        <BasicInput
          theme={InputTheme.Primary}
          size={InputSize.Medium}
          name={"Search"}
          placeholder={"Поиск"}
          maxLength={80}
          testId={DEFAULT_TEST_ID}
          isCountable={false}
        ></BasicInput>
        <IconButton
          iconName={IconName.Search}
          ariaLabel={"Начать поиск"}
          testId={DEFAULT_TEST_ID}
          size={IconButtonSize.Medium}
          theme={IconButtonTheme.Primary}
        ></IconButton>
      </div>
      <div class="header__controls">
        <IconButton
          iconName={IconName.Trash}
          ariaLabel={"Переключить панель инструментов"}
          testId={DEFAULT_TEST_ID}
          size={IconButtonSize.Medium}
          theme={IconButtonTheme.Primary}
        ></IconButton>
      </div>
    </header>
  );
};
