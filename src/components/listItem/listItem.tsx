import { type Component, mergeProps, Show } from "solid-js";
import "./listItem.css";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import {
  ItemInput,
  ItemInputSize,
  ItemInputTheme,
} from "../itemInput/itemInput.tsx";
import {
  Checkbox,
  CheckboxSize,
  CheckboxTheme,
} from "../checkbox/checkbox.tsx";
import { EDIT_LIST_INPUT_LIMIT } from "../../../configuration.ts";

export enum ListItemTheme {
  Primary = "primary",
}

export enum ListItemSize {
  Medium = "medium",
}

type ListItemProps = {
  theme?: ListItemTheme;
  size?: ListItemSize;
  removeItem: (defaultListId: string) => void;
  defaultListItemId: string;
  isDisabled?: boolean;
  isCheckable: boolean;
  isChecked: boolean;
  defaultValue?: string;
  name: string;
  dataId?: string;
  isLastItem?: boolean;
  onChange?: (value: string) => void;
};

export const ListItem: Component<ListItemProps> = (props) => {
  const mProps: Required<ListItemProps> = mergeProps(
    {
      theme: ListItemTheme.Primary,
      size: ListItemSize.Medium,
      isLastItem: false,
      isDisabled: false,
      defaultValue: "",
      dataId: "",
      onChange: () => {},
    },
    props,
  );

  function removeItemIfEnabled() {
    if (!mProps.isDisabled) {
      mProps.removeItem(mProps.defaultListItemId);
    }
  }

  return (
    <div class={`listItem listItem_${mProps.theme} listItem_${mProps.size}`}>
      <Show when={mProps.isCheckable}>
        <div class="listItem__checkbox">
          <Checkbox
            theme={CheckboxTheme.Primary}
            size={CheckboxSize.Medium}
            testId={DEFAULT_TEST_ID}
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
          testId={DEFAULT_TEST_ID}
          dataId={mProps.dataId}
          isDisabled={mProps.isDisabled}
          placeholder={"Пункт списка"}
          defaultValue={mProps.defaultValue}
          isRequired={true}
          onChange={(value) => mProps.onChange?.(value)}
        />
        <div class="listItem__controls">
          <IconButton
            iconName={IconName.DotsThreeCircle}
            ariaLabel={"Выпадающее меню"}
            theme={IconButtonTheme.Primary}
            size={IconButtonSize.Medium}
            componentType={IconButtonComponentType.Button}
            testId={DEFAULT_TEST_ID}
          />
          <IconButton
            iconName={IconName.Trash}
            ariaLabel={"Удалить пункт"}
            theme={IconButtonTheme.Dangerous}
            size={IconButtonSize.Medium}
            handleClick={removeItemIfEnabled}
            testId={DEFAULT_TEST_ID}
            isDisabled={mProps.isLastItem}
          />
        </div>
      </div>
    </div>
  );
};
