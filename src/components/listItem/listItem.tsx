import { mergeProps, Show } from "solid-js";

import { EDIT_LIST_INPUT_LIMIT } from "../../../configuration.ts";
import {
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
  AUTO_LIST_ITEM,
  buildListItemInputTestId,
  CHECKBOX,
  DEFAULT_TEST_ID,
  DRAG_HANDLE,
  LIST_ITEM_CONTEXT_MENU,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
  REMOVE_ITEM_MENUITEM,
} from "../../../features/testIds.ts";
import type { DragSettings } from "../../types/types.ts";
import { Checkbox, CheckboxSize, CheckboxTheme } from "../checkbox/checkbox.tsx";
import { CyberInput } from "../cyberInput/cyberInput.tsx";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { DropdownMenu } from "../dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonSize } from "../iconButton/iconButton.tsx";
import { MenuItemTheme } from "../menuItem/menuItem.tsx";
import type { Testable, TestId, TestSubId } from "../utilities/testable.ts";

import "./listItem.css";

export enum ListItemTheme {
  Primary = "primary",
}

export enum ListItemSize {
  Medium = "medium",
}

type ListItemProps = {
  theme?: ListItemTheme;
  size?: ListItemSize;
  removeItem?: () => void;
  isDisabled?: boolean;
  isCheckable: boolean;
  isChecked: boolean;
  defaultValue?: string;
  name?: string;
  dataId?: string;
  isOnlyOneItem?: boolean;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onAddBefore?: () => void;
  onAddAfter?: () => void;
  canAddMore: boolean;
  dragSettings?: DragSettings;
  isDraggingOverlay?: boolean;
  placeholder?: string;
};

export const ListItem = (props: Testable<ListItemProps>) => {
  const mProps: Testable<Required<ListItemProps>> = mergeProps(
    {
      theme: ListItemTheme.Primary,
      size: ListItemSize.Medium,
      name: "",
      isOnlyOneItem: false,
      isDisabled: false,
      isRequired: true,
      defaultValue: "",
      dataId: "",
      onChange: () => {},
      onAddBefore: () => {},
      onAddAfter: () => {},
      removeItem: () => {},
      isDraggingOverlay: false,
      dragId: "",
      dragSettings: {
        dragData: null,
        dragProps: {},
        dragState: null,
      },
      placeholder: "Пункт списка",
    },
    props,
  );

  const menuItems = () => [
    {
      text: "Добавить пункт выше",
      icon: IconName.Plus,
      handleClick: mProps.onAddBefore,
      testId: ADD_ITEM_ABOVE_MENUITEM,
      isDisabled: !mProps.canAddMore,
    },
    {
      text: "Добавить пункт ниже",
      icon: IconName.Plus,
      handleClick: mProps.onAddAfter,
      testId: ADD_ITEM_BELOW_MENUITEM,
      isDisabled: !mProps.canAddMore,
    },
    {
      text: "Импортировать выше",
      icon: IconName.SortDescending,
      testId: DEFAULT_TEST_ID,
      isDisabled: !mProps.canAddMore,
    },
    {
      text: "Импортировать ниже",
      icon: IconName.SortAscending,
      testId: DEFAULT_TEST_ID,
      isDisabled: !mProps.canAddMore,
    },
    {
      text: "Удалить пункт",
      icon: IconName.Trash,
      handleClick: mProps.removeItem,
      isDisabled: mProps.isOnlyOneItem,
      theme: MenuItemTheme.Dangerous,
      testId: REMOVE_ITEM_MENUITEM,
      testSubId: getListItemTestSubId(mProps.testId, mProps.testSubId),
    },
  ];

  return (
    <div
      {...mProps.dragSettings.dragProps}
      class={`listItem listItem_${mProps.theme} listItem_${mProps.size}`}
      classList={{
        listItem_dragging: mProps.isDraggingOverlay,
        listItem_transition: !!mProps.dragSettings.dragState?.active.draggable,
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={getListItemTestSubId(mProps.testId, mProps.testSubId)}
    >
      <div class="listItem__dragHandle">
        <DragHandle
          isDisabled={mProps.isDisabled}
          testId={DRAG_HANDLE}
          testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
          dragHandle={mProps.dragSettings.dragData}
        />
      </div>
      <Show when={mProps.isCheckable}>
        <div class="listItem__checkbox">
          <Checkbox
            theme={CheckboxTheme.Primary}
            size={CheckboxSize.Medium}
            testId={CHECKBOX}
            testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
            disabled={mProps.isDisabled}
            checked={mProps.isChecked}
          />
        </div>
      </Show>
      <div class="listItem__inner">
        <CyberInput
          maxLength={EDIT_LIST_INPUT_LIMIT}
          name={mProps.name}
          dataId={mProps.dataId}
          isDisabled={mProps.isDisabled}
          placeholder={mProps.placeholder}
          defaultValue={mProps.defaultValue}
          isRequired={mProps.isRequired}
          onChange={mProps.onChange}
          testId={buildListItemInputTestId(mProps.testId)}
          testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
          controlElements={
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
                  isDisabled={mProps.isDisabled}
                />
              )}
              testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
              testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
              dropDownMenuTestId={LIST_ITEM_CONTEXT_MENU}
              menuItems={menuItems()}
              disabled={mProps.isDisabled}
            />
          }
        />
      </div>
    </div>
  );
};

function getListItemTestSubId(testId: TestId, testSubId: TestSubId | undefined): TestSubId {
  return testId === AUTO_LIST_ITEM ? AUTO_LIST_ITEM : testSubId || "0";
}
