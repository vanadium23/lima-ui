import { mergeProps, Show } from "solid-js";

import { EDIT_LIST_INPUT_LIMIT } from "../../../configuration.ts";
import {
  CHECKBOX,
  DEFAULT_TEST_ID,
  DRAG_HANDLE,
  LIST_ITEM,
  LIST_ITEM_INPUT,
  OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON,
  REMOVE_ITEM_MENUITEM
} from "../../../features/testIds.ts";
import type { DragSettings } from "../../widgets/editList/types.ts";
import {
  Checkbox,
  CheckboxSize,
  CheckboxTheme,
} from "../checkbox/checkbox.tsx";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { DropdownMenuWrapper } from "../dropdownMenuWrapper/dropdownMenuWrapper.tsx";
import { IconName } from "../icon/icon.tsx";
import { IconButtonSize } from "../iconButton/iconButton.tsx";
import {
  ItemInput,
  ItemInputSize,
  ItemInputTheme,
} from "../itemInput/itemInput.tsx";
import { MenuItemTheme } from "../menuItem/menuItem.tsx";
import type { Testable } from "../utilities/testable.ts";

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
      onChange: () => { },
      onAddBefore: () => { },
      onAddAfter: () => { },
      removeItem: () => { },
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

  const dropdownItems = () => [
    {
      text: "Добавить пункт выше",
      icon: IconName.Plus,
      handleClick: mProps.onAddBefore,
      testId: DEFAULT_TEST_ID,
      isDisabled: !mProps.canAddMore,
    },
    {
      text: "Добавить пункт ниже",
      icon: IconName.Plus,
      handleClick: mProps.onAddAfter,
      testId: DEFAULT_TEST_ID,
      isDisabled: !mProps.canAddMore,
    },
    {
      text: "Импортировать пункт выше",
      icon: IconName.SortDescending,
      testId: DEFAULT_TEST_ID,
    },
    {
      text: "Импортировать пункт ниже",
      icon: IconName.SortAscending,
      testId: DEFAULT_TEST_ID
    },
    {
      text: "Удалить пункт",
      icon: IconName.Trash,
      handleClick: mProps.removeItem,
      isDisabled: mProps.isOnlyOneItem,
      theme: MenuItemTheme.Dangerous,
      testId: REMOVE_ITEM_MENUITEM,
      testSubId: mProps.testSubId ?? "0"
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
      data-test-id={LIST_ITEM}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="listItem__dragHandle">
        <DragHandle
          isDisabled={mProps.isDisabled}
          testId={DRAG_HANDLE}
          testSubId={mProps.testSubId ?? "0"}
          dragHandle={mProps.dragSettings.dragData}
        />
      </div>
      <Show when={mProps.isCheckable}>
        <div class="listItem__checkbox">
          <Checkbox
            theme={CheckboxTheme.Primary}
            size={CheckboxSize.Medium}
            testId={CHECKBOX}
            testSubId={mProps.testSubId ?? "0"}
            isDisabled={mProps.isDisabled}
            isChecked={mProps.isChecked}
          />
        </div>
      </Show>
      <div class="listItem__inner">
        <ItemInput
          theme={ItemInputTheme.Primary}
          size={ItemInputSize.Medium}
          maxLength={EDIT_LIST_INPUT_LIMIT}
          name={mProps.name}
          dataId={mProps.dataId}
          isDisabled={mProps.isDisabled}
          placeholder={"Пункт списка"}
          textAreaValue={mProps.defaultValue}
          isRequired={mProps.isRequired}
          onChange={mProps.onChange}
          testId={LIST_ITEM_INPUT}
          testSubId={mProps.testSubId ?? "0"}
          childComponent={
            <DropdownMenuWrapper
              iconSize={IconButtonSize.MediumEmbedded}
              iconName={IconName.DotsThreeCircle}
              testId={OPEN_CONTEXT_MENU_LIST_ITEM_BUTTON}
              testSubId={mProps.testSubId ?? "0"}
              listOfButtons={dropdownItems()}
              isDisabled={mProps.isDisabled} />}
        />
      </div>
    </div>
  );
};
