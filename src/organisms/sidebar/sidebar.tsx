import { type Component } from "solid-js";
import {
  ADD_GROUP_BUTTON,
  DEFAULT_TEST_ID,
  PRO_VERSION_BUTTON,
} from "../../../features/testIds.ts";
import {
  Button,
  ButtonSize,
  ButtonTheme,
} from "../../components/button/button.tsx";
import { IconName } from "../../components/icon/icon.tsx";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../../components/iconButton/iconButton.tsx";
import { Nav, NavSize, NavTheme } from "../../components/nav/nav.tsx";
import { UserButton, UserButtonSize, UserButtonTheme } from "../../components/userButton/userButton.tsx";
import "./sidebar.css";

export const Sidebar: Component = () => {
  return (
    <div class="sidebar">
      <div class="sidebar__top">
        <UserButton
          userName="Ефросинья_Мыловареная"
          theme={UserButtonTheme.Primary}
          size={UserButtonSize.Medium} />
        <Nav theme={NavTheme.Primary} size={NavSize.Medium} testId={DEFAULT_TEST_ID}/>
      </div>
      <div class="sidebar__bottom">
        <div class="sidebar__profile">
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
