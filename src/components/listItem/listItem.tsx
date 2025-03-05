import { mergeProps, Show } from "solid-js";

import { EDIT_LIST_INPUT_LIMIT } from "../../../configuration.ts";
import {
  CHECKBOX,
  DRAG_HANDLE,
  DROPDOWN_MENU_BUTTON,
  ITEM_INPUT,
  ITEM_INPUT_CONTAINER,
  REMOVE_ITEM_BUTTON,
} from "../../../features/testIds.ts";
import {
  Checkbox,
  CheckboxSize,
  CheckboxTheme,
} from "../checkbox/checkbox.tsx";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import {
  ItemInput,
  ItemInputSize,
  ItemInputTheme,
} from "../itemInput/itemInput.tsx";
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
  removeItem: () => void;
  isDisabled?: boolean;
  isCheckable: boolean;
  isChecked: boolean;
  defaultValue?: string;
  name: string;
  dataId?: string;
  isOnlyOneItem?: boolean;
  isRequired?: boolean;
  onChange?: (value: string) => void;
};

export const ListItem = (props: Testable<ListItemProps>) => {
  const mProps: Testable<Required<ListItemProps>> = mergeProps(
    {
      theme: ListItemTheme.Primary,
      size: ListItemSize.Medium,
      isOnlyOneItem: false,
      isDisabled: false,
      isRequired: true,
      defaultValue: "",
      dataId: "",
      onChange: () => {},
    },
    props,
  );

  function removeItemIfEnabled() {
    if (!mProps.isDisabled) {
      mProps.removeItem();
    }
  }

  return (
    <div
      class={`listItem listItem_${mProps.theme} listItem_${mProps.size}`}
      data-test-id={ITEM_INPUT_CONTAINER}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="listItem__dragHandle">
        <DragHandle
          isDisabled={mProps.isDisabled}
          testId={DRAG_HANDLE}
          testSubId={mProps.testSubId ?? "0"}
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
          defaultValue={mProps.defaultValue}
          isRequired={mProps.isRequired}
          onChange={mProps.onChange}
          testId={ITEM_INPUT}
          testSubId={mProps.testSubId ?? "0"}
        />
        <div class="listItem__controls">
          <IconButton
            iconName={IconName.DotsThreeCircle}
            ariaLabel={"Выпадающее меню"}
            theme={IconButtonTheme.Primary}
            size={IconButtonSize.Medium}
            componentType={IconButtonComponentType.Button}
            testId={DROPDOWN_MENU_BUTTON}
            testSubId={mProps.testSubId ?? "0"}
          />
          <IconButton
            iconName={IconName.Trash}
            ariaLabel={"Удалить пункт"}
            theme={IconButtonTheme.Dangerous}
            size={IconButtonSize.Medium}
            handleClick={removeItemIfEnabled}
            testId={REMOVE_ITEM_BUTTON}
            testSubId={mProps.testSubId ?? "0"}
            isDisabled={mProps.isOnlyOneItem}
          />
        </div>
      </div>
    </div>
  );
};
