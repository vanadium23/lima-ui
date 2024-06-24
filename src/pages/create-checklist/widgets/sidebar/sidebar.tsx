import { type Component } from "solid-js";
import "./sidebar.css";
import { Nav } from "../../../../components/nav/nav.tsx";
import {
  Button,
  ButtonSize,
  ButtonTheme,
} from "../../../../components/button/button.tsx";
import { DEFAULT_TEST_ID } from "../../../../../features/testIds.ts";
import { ProfileButton } from "../../../../components/profileButton/profileButton.tsx";
import { IconName } from "../../../../components/icon/icon.tsx";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../../../../components/iconButton/iconButton.tsx";
import { Logo } from "../../../../components/logo/logo.tsx";

export const Sidebar: Component = () => {
  return (
    <div class="sidebar">
      <div class="sidebar__top">
        <Logo />
        <Nav />
      </div>
      <div class="sidebar__bottom">
        <div class="sidebar__profile">
          <ProfileButton text={"et"} url={"https://ya.ru"} />
          <IconButton
            iconName={IconName.AddGroup}
            theme={IconButtonTheme.Primary}
            size={IconButtonSize.Medium}
            ariaLabel={"Add user"}
            testId={DEFAULT_TEST_ID}
          />
        </div>
        <Button
          theme={ButtonTheme.Successful}
          size={ButtonSize.Medium}
          text={"Версия PRO"}
          testId={DEFAULT_TEST_ID}
        ></Button>
      </div>
    </div>
  );
};
