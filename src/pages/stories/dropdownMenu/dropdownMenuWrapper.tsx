import { mergeProps } from "solid-js";

import {
  DEFAULT_TEST_ID,
  LIST_ITEM_CONTEXT_MENU,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
} from "../../../../features/testIds.ts";
import { DropdownMenu } from "../../../components/dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../../../components/icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonSize } from "../../../components/iconButton/iconButton.tsx";
import { type MenuItemProps } from "../../../components/menuItem/menuItem.tsx";

type DropdownMenuWrapperProps = {
  menuItems: MenuItemProps[];
  disabled?: boolean;
};

export function DropdownMenuWrapper(props: DropdownMenuWrapperProps) {
  const mProps = mergeProps(
    {
      disabled: false,
    },
    props,
  );

  return (
    <DropdownMenu
      component={(props) => (
        <IconButton
          ref={props.ref}
          componentType={IconButtonComponentType.Button}
          handleClick={props.handleClick}
          testId={DEFAULT_TEST_ID}
          size={IconButtonSize.MediumEmbedded}
          iconName={IconName.DotsThree}
          ariaLabel={"Выпадающее меню"}
          isDisabled={mProps.disabled}
        />
      )}
      testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
      dropDownMenuTestId={LIST_ITEM_CONTEXT_MENU}
      menuItems={mProps.menuItems}
      disabled={mProps.disabled}
    />
  );
}
