import { createSignal, mergeProps } from "solid-js";

import {
  DEFAULT_TEST_ID,
  LIST_ITEM_CONTEXT_MENU,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
} from "../../../../features/testIds.ts";
import { CyberInput, CyberInputSize, CyberInputTheme } from "../../../components/cyberInput/cyberInput.tsx";
import { DropdownMenu } from "../../../components/dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../../../components/icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonSize } from "../../../components/iconButton/iconButton.tsx";
import { MenuItemTheme } from "../../../components/menuItem/menuItem.tsx";

type CyberInputWrapperProps = {
  size: CyberInputSize;
  theme: CyberInputTheme;
  error?: boolean;
};

export function CyberInputWrapper(props: CyberInputWrapperProps) {
  const mProps = mergeProps(
    {
      error: false,
      listOfButtons: null,
    },
    props,
  );
  const [text, setText] = createSignal("");

  const menuItems = () => [
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
      disabled: true,
    },
    {
      children: "Импортировать ниже",
      icon: IconName.SortAscending,
      testId: DEFAULT_TEST_ID,
      disabled: true,
    },
    {
      children: "Удалить пункт",
      icon: IconName.Trash,
      handleClick: () => {},
      theme: MenuItemTheme.Dangerous,
    },
  ];

  return (
    <CyberInput
      onChange={setText}
      size={mProps.size}
      theme={mProps.theme}
      maxLength={50}
      name="Some-text"
      required={true}
      testId={DEFAULT_TEST_ID}
      defaultIsError={mProps.error}
      placeholder="Введите текст"
      controlElements={
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
          {menuItems()}
        </DropdownMenu>
      }
    >
      {text()}
    </CyberInput>
  );
}
