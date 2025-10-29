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
import {
  openImportDialogPasteAfter,
  openImportDialogPasteBefore,
} from "../../widgets/editList/components/importDialog/importDialog.tsx";
import { storeEditList } from "../../widgets/editList/editList.store.tsx";
import { handleItemChange } from "../../widgets/editList/utilities/handleItemChange.ts";
import { pasteItemAfter, pasteItemBefore } from "../../widgets/editList/utilities/pasteItem.ts";
import { removeItem } from "../../widgets/editList/utilities/removeItem.ts";
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
  index: number;
  dataId?: string;
  disabled?: boolean;
  auto?: boolean;

  checkable: boolean;
  checked: boolean;
  children?: string;
  name?: string;

  required?: boolean;
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
      dataId: "",
      name: "",
      disabled: false,
      auto: false,

      required: true,
      children: "",

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
      children: "Добавить пункт выше",
      icon: IconName.Plus,
      handleClick: () => {
        pasteItemBefore(mProps.index);
      },
      testId: ADD_ITEM_ABOVE_MENUITEM,
      disabled: !mProps.canAddMore,
    },
    {
      children: "Добавить пункт ниже",
      icon: IconName.Plus,
      handleClick: () => {
        pasteItemAfter(mProps.index);
      },
      testId: ADD_ITEM_BELOW_MENUITEM,
      disabled: !mProps.canAddMore,
    },
    {
      children: "Импортировать выше",
      icon: IconName.SortDescending,
      handleClick: openImportDialogPasteBefore,
      testId: DEFAULT_TEST_ID,
      disabled: !mProps.canAddMore,
    },
    {
      children: "Импортировать ниже",
      icon: IconName.SortAscending,
      handleClick: openImportDialogPasteAfter,
      testId: DEFAULT_TEST_ID,
      disabled: !mProps.canAddMore,
    },
    {
      children: "Удалить пункт",
      icon: IconName.Trash,
      handleClick: () => {
        removeItem(mProps.index);
      },
      disabled: isOnlyOneItem() || mProps.auto,
      theme: MenuItemTheme.Dangerous,
      testId: REMOVE_ITEM_MENUITEM,
      testSubId: getListItemTestSubId(mProps.testId, mProps.testSubId),
    },
  ];

  function isOnlyOneItem() {
    return storeEditList.items.length === 1;
  }

  return (
    <div
      {...mProps.dragSettings.dragProps}
      class="listItem"
      classList={{
        [`listItem_${mProps.size}`]: true,
        [`listItem_${mProps.theme}`]: true,
        listItem_dragging: mProps.isDraggingOverlay,
        listItem_transition: !!mProps.dragSettings.dragState?.active.draggable,
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={getListItemTestSubId(mProps.testId, mProps.testSubId)}
    >
      <div class="listItem__dragHandle">
        <DragHandle
          disabled={mProps.disabled}
          testId={DRAG_HANDLE}
          testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
          dragHandle={mProps.dragSettings.dragData}
        />
      </div>
      <Show when={mProps.checkable}>
        <div class="listItem__checkbox">
          <Checkbox
            theme={CheckboxTheme.Primary}
            size={CheckboxSize.Medium}
            testId={CHECKBOX}
            testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
            disabled={mProps.disabled}
            checked={mProps.checked}
          />
        </div>
      </Show>
      <div class="listItem__inner">
        <CyberInput
          maxLength={EDIT_LIST_INPUT_LIMIT}
          name={`List Item ${mProps.index + 1}`}
          dataId={mProps.dataId}
          disabled={mProps.disabled}
          placeholder={mProps.placeholder}
          required={!mProps.auto || isOnlyOneItem()}
          onChange={(value) => handleItemChange(mProps.index, value)}
          testId={buildListItemInputTestId(mProps.testId)}
          testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
          controlElements={
            <DropdownMenu
              component={(props) => (
                <IconButton
                  ref={props.ref}
                  componentType={IconButtonComponentType.Button}
                  handleClick={props.handleClick}
                  testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
                  testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
                  size={IconButtonSize.MediumEmbedded}
                  iconName={IconName.DotsThree}
                  ariaLabel={"Выпадающее меню"}
                  disabled={mProps.disabled}
                />
              )}
              testId={LIST_ITEM_CONTEXT_MENU}
              testSubId={getListItemTestSubId(mProps.testId, mProps.testSubId)}
            >
              {menuItems()}
            </DropdownMenu>
          }
        >
          {mProps.children}
        </CyberInput>
      </div>
    </div>
  );
};

function getListItemTestSubId(testId: TestId, testSubId: TestSubId | undefined): TestSubId {
  return testId === AUTO_LIST_ITEM ? AUTO_LIST_ITEM : testSubId || "0";
}
