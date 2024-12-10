import { type Component } from "solid-js";
import "./sidebar.css";
import { Nav } from "../../components/nav/nav.tsx";
import {
  Button,
  ButtonSize,
  ButtonTheme,
} from "../../components/button/button.tsx";
import {
  ADD_GROUP_BUTTON,
  PRO_VERSION_BUTTON,
} from "../../../features/testIds.ts";
import { ProfileButton } from "../../components/profileButton/profileButton.tsx";
import { IconName } from "../../components/icon/icon.tsx";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../../components/iconButton/iconButton.tsx";

export const Sidebar: Component = () => {
  return (
    <div class="sidebar">
      <div class="sidebar__top">
        <Nav />
      </div>
      <div class="sidebar__bottom">
        <div class="sidebar__profile">
          <ProfileButton text={"et"} url={"https://ya.ru"} />
          <IconButton
            iconName={IconName.User}
            theme={IconButtonTheme.Primary}
            size={IconButtonSize.Medium}
            ariaLabel={"Add user"}
            testId={ADD_GROUP_BUTTON}
          />
        </div>
        <Button
          theme={ButtonTheme.Successful}
          size={ButtonSize.Medium}
          text={"Версия PRO"}
          testId={PRO_VERSION_BUTTON}
        />
      </div>
    </div>
  );
};
