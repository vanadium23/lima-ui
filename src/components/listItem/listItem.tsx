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
  DRAGGED_LIST_ITEM,
  LIST_ITEM,
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
import { pasteItemAfter, pasteItemBefore } from "../../widgets/editList/utilities/pasteNewItem.ts";
import { reachedItemsLimit } from "../../widgets/editList/utilities/reachedItemsLimit.ts";
import { removeItem } from "../../widgets/editList/utilities/removeItem.ts";
import { Checkbox, CheckboxSize, CheckboxTheme } from "../checkbox/checkbox.tsx";
import { CyberInput } from "../cyberInput/cyberInput.tsx";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { DropdownMenu } from "../dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonSize } from "../iconButton/iconButton.tsx";
import { MenuItemTheme } from "../menuItem/menuItem.tsx";
import type { TestId, TestSubId } from "../utilities/testable.ts";

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
  name?: string;
  children?: string;
  disabled?: boolean;
  auto?: boolean;
  checked?: boolean;
  dragSettings?: DragSettings;
  isDraggingOverlay?: boolean;
};

export const ListItem = (props: ListItemProps) => {
  const mProps: Required<ListItemProps> = mergeProps(
    {
      theme: ListItemTheme.Primary,
      size: ListItemSize.Medium,
      dataId: "",
      name: "",
      children: "",
      disabled: false,
      auto: false,
      checked: false,
      isDraggingOverlay: false,
      dragId: "",
      dragSettings: {
        dragData: null,
        dragProps: {},
        dragState: null,
      },
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
      disabled: reachedItemsLimit(),
    },
    {
      children: "Добавить пункт ниже",
      icon: IconName.Plus,
      handleClick: () => {
        pasteItemAfter(mProps.index);
      },
      testId: ADD_ITEM_BELOW_MENUITEM,
      disabled: reachedItemsLimit(),
    },
    {
      children: "Импортировать выше",
      icon: IconName.SortDescending,
      handleClick: () => {
        openImportDialogPasteBefore(mProps.index);
      },
      testId: DEFAULT_TEST_ID,
      disabled: reachedItemsLimit(),
    },
    {
      children: "Импортировать ниже",
      icon: IconName.SortAscending,
      handleClick: () => {
        openImportDialogPasteAfter(mProps.index);
      },
      testId: DEFAULT_TEST_ID,
      disabled: reachedItemsLimit(),
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
      testSubId: getListItemTestSubId(getTestId(), mProps.index),
    },
  ];

  function isOnlyOneItem() {
    return storeEditList.items.length === 1;
  }

  function getTestId() {
    if (mProps.isDraggingOverlay) {
      return DRAGGED_LIST_ITEM;
    } else if (mProps.auto) {
      return AUTO_LIST_ITEM;
    } else {
      return LIST_ITEM;
    }
  }

  function getListItemTestSubId(testId: TestId, testSubId: TestSubId | undefined): TestSubId {
    return testId === AUTO_LIST_ITEM ? AUTO_LIST_ITEM : testSubId || "0";
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
      data-test-id={getTestId()}
      data-test-sub-id={getListItemTestSubId(getTestId(), mProps.index)}
    >
      <div class="listItem__dragHandle">
        <DragHandle
          disabled={mProps.disabled}
          testId={DRAG_HANDLE}
          testSubId={getListItemTestSubId(getTestId(), mProps.index)}
          dragHandle={mProps.dragSettings.dragData}
        />
      </div>
      <Show when={storeEditList.isCheckable}>
        <div class="listItem__checkbox">
          <Checkbox
            theme={CheckboxTheme.Primary}
            size={CheckboxSize.Medium}
            testId={CHECKBOX}
            testSubId={getListItemTestSubId(getTestId(), mProps.index)}
            disabled={mProps.disabled}
            checked={mProps.checked}
          />
        </div>
      </Show>
      <div class="listItem__inner">
        <CyberInput
          maxLength={EDIT_LIST_INPUT_LIMIT}
          name={mProps.isDraggingOverlay ? "Drag Overlay Item" : `List Item ${mProps.index + 1}`}
          dataId={mProps.dataId}
          disabled={mProps.disabled}
          placeholder={mProps.auto ? "Добавить пункт списка" : "Пункт списка"}
          required={!mProps.auto || isOnlyOneItem()}
          onChange={(value) => handleItemChange(mProps.index, value)}
          testId={buildListItemInputTestId(getTestId())}
          testSubId={getListItemTestSubId(getTestId(), mProps.index)}
          controlElements={
            <DropdownMenu
              component={(props) => (
                <IconButton
                  ref={props.ref}
                  componentType={IconButtonComponentType.Button}
                  handleClick={props.handleClick}
                  testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
                  testSubId={getListItemTestSubId(getTestId(), mProps.index)}
                  size={IconButtonSize.MediumEmbedded}
                  iconName={IconName.DotsThree}
                  ariaLabel={"Выпадающее меню"}
                  disabled={mProps.disabled}
                />
              )}
              testId={LIST_ITEM_CONTEXT_MENU}
              testSubId={getListItemTestSubId(getTestId(), mProps.index)}
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
