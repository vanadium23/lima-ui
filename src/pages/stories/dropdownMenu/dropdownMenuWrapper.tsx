import {
  DEFAULT_TEST_ID,
  LIST_ITEM_CONTEXT_MENU,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
} from "../../../../features/testIds.ts";
import { DropdownMenu } from "../../../components/dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../../../components/icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonSize } from "../../../components/iconButton/iconButton.tsx";
import { MenuItemTheme } from "../../../components/menuItem/menuItem.tsx";

const menuItems = [
  {
    children: "Добавить пункт выше",
    icon: IconName.Plus,
    handleClick: () => {},
  },
  {
    children: "Добавить пункт ниже",
    icon: IconName.Plus,
    handleClick: () => {},
  },
  {
    children: "Импортировать выше",
    icon: IconName.SortDescending,
    testId: DEFAULT_TEST_ID,
    isDisabled: true,
  },
  {
    children: "Импортировать ниже",
    icon: IconName.SortAscending,
    testId: DEFAULT_TEST_ID,
    isDisabled: true,
  },
  {
    children: "Удалить пункт",
    icon: IconName.Trash,
    handleClick: () => {},
    theme: MenuItemTheme.Dangerous,
  },
];

export function DropdownMenuWrapper() {
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
      {menuItems}
    </DropdownMenu>
  );
}
