import { mergeProps } from "solid-js";

import { LIST_ITEM_CONTEXT_MENU, OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON } from "../../../../features/testIds.ts";
import { DropdownMenu } from "../../../components/dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../../../components/icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonSize } from "../../../components/iconButton/iconButton.tsx";
import { type MenuItemProps } from "../../../components/menuItem/menuItem.tsx";

type DropdownMenuWrapperProps = {
  children: MenuItemProps[];
};

export function DropdownMenuWrapper(props: DropdownMenuWrapperProps) {
  const mProps = mergeProps(props);

  return (
    <DropdownMenu
      component={(props) => (
        <IconButton
          ref={props.ref}
          componentType={IconButtonComponentType.Button}
          handleClick={props.handleClick}
          testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
          size={IconButtonSize.MediumEmbedded}
          iconName={IconName.DotsThree}
          ariaLabel={"Выпадающее меню"}
        />
      )}
      testId={LIST_ITEM_CONTEXT_MENU}
    >
      {mProps.children}
    </DropdownMenu>
  );
}
