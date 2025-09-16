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
  isError?: boolean;
};

export function CyberInputWrapper(props: CyberInputWrapperProps) {
  const mProps = mergeProps(
    {
      isError: false,
      listOfButtons: null,
    },
    props,
  );
  const [text, setText] = createSignal("");

  const menuItems = () => [
    {
      text: "Добавить пункт выше",
      icon: IconName.Plus,
      handleClick: () => {},
    },
    {
      text: "Добавить пункт ниже",
      icon: IconName.Plus,
      handleClick: () => {},
    },
    {
      text: "Импортировать выше",
      icon: IconName.SortDescending,
      testId: DEFAULT_TEST_ID,
      isDisabled: true,
    },
    {
      text: "Импортировать ниже",
      icon: IconName.SortAscending,
      testId: DEFAULT_TEST_ID,
      isDisabled: true,
    },
    {
      text: "Удалить пункт",
      icon: IconName.Trash,
      handleClick: () => {},
      theme: MenuItemTheme.Dangerous,
    },
  ];

  return (
    <CyberInput
      onChange={setText}
      defaultValue={text()}
      size={mProps.size}
      theme={mProps.theme}
      maxLength={50}
      name="Some-text"
      isRequired={true}
      testId={DEFAULT_TEST_ID}
      defaultIsError={mProps.isError}
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
          menuItems={menuItems()}
        />
      }
    />
  );
}
