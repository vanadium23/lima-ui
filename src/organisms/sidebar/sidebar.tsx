import { mergeProps } from "solid-js";

import { ADD_GROUP_BUTTON, PRO_VERSION_BUTTON, SIDEBAR } from "../../../features/testIds.ts";
import { Button, ButtonSize, ButtonTheme } from "../../components/button/button.tsx";
import { Divider, DividerOrientation, DividerSize, DividerTheme } from "../../components/divider/divider.tsx";
import { IconName } from "../../components/icon/types.ts";
import { IconButton, IconButtonSize, IconButtonTheme } from "../../components/iconButton/iconButton.tsx";
import { Nav } from "../../components/nav/nav.tsx";
import { UserBadge } from "../../components/userBadge/userBadge.tsx";
import { panelState } from "../../state/sidebarsStateManager.ts";

import "./sidebar.css";

type SidebarProps = {
  isListsLimitReached?: boolean;
};

export const Sidebar = (props: SidebarProps) => {
  const mProps: Required<SidebarProps> = mergeProps(
    {
      isListsLimitReached: false,
    },
    props,
  );

  return (
    <div
      class="sidebar"
      classList={{
        sidebar_hidden: panelState.isSidebarHidden(),
      }}
      data-test-id={SIDEBAR}
    >
      <div class="sidebar__top">
        <UserBadge tariff={"professional"} error={true}>
          example@mail.ru
        </UserBadge>
        <Divider theme={DividerTheme.Primary} size={DividerSize.Medium} orientation={DividerOrientation.Horizontal} />
        <Nav isListsLimitReached={mProps.isListsLimitReached} />
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
