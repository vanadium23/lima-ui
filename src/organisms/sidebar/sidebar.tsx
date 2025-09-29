import { ADD_GROUP_BUTTON, PRO_VERSION_BUTTON, SIDEBAR, SIGN_OUT_BUTTON } from "../../../features/testIds.ts";
import { Button, ButtonSize, ButtonTheme } from "../../components/button/button.tsx";
import { Divider, DividerOrientation, DividerSize, DividerTheme } from "../../components/divider/divider.tsx";
import { IconName } from "../../components/icon/types.ts";
import { IconButton, IconButtonSize, IconButtonTheme } from "../../components/iconButton/iconButton.tsx";
import { Nav } from "../../components/nav/nav.tsx";
import { UserButton, UserButtonSize, UserButtonTheme } from "../../components/userButton/userButton.tsx";
import { panelState } from "../../state/sidebarsStateManager.ts";

import "./sidebar.css";

export const Sidebar = () => {
  return (
    <div
      class="sidebar"
      classList={{
        sidebar_hidden: panelState.isSidebarHidden(),
      }}
      data-test-id={SIDEBAR}
    >
      <div class="sidebar__top">
        <div class="sidebar__user">
          <UserButton userName="Ефросинья_Мыловареная" theme={UserButtonTheme.Primary} size={UserButtonSize.Medium} />
          <IconButton iconName={IconName.SignOut} ariaLabel="Выйти из аккаунта" testId={SIGN_OUT_BUTTON} />
        </div>
        <Divider theme={DividerTheme.Primary} size={DividerSize.Medium} orientation={DividerOrientation.Horizontal} />
        <Nav />
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
        <Button theme={ButtonTheme.Successful} size={ButtonSize.Medium} testId={PRO_VERSION_BUTTON}>
          Версия PRO
        </Button>
      </div>
    </div>
  );
};
