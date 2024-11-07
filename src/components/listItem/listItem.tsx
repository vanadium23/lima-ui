import { type Component, createSignal, mergeProps, Show } from "solid-js";
import "./listItem.css";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";

import { Dialog, DialogSize, DialogTheme } from "../dialog/dialog.tsx";
import { soften } from "../../widgets/editList/utilities/soften.ts";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import {
  ListItemInput,
  ListItemInputSize,
  ListItemInputTheme,
} from "../listItemInput/listItemInput.tsx";
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
  theme: ListItemTheme;
  size: ListItemSize;
  isRemoving?: boolean;
  staticOnRemoveSuccess: (defaultListId: string) => void;
  staticOnRemoveError: (removeError: boolean) => void;
  defaultListItemId: string;
  isDisabled?: boolean;
  isCheckable: boolean;
  isChecked: boolean;
  defaultValue?: string;
};

export const ListItem: Component<ListItemProps> = (props) => {
  const mProps: Required<ListItemProps> = mergeProps(
    {
      isRemoving: false,
      isDisabled: false,
      defaultValue: "",
    },
    props,
  );

  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  const [isRemoving, setIsRemoving] = createSignal(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  function listItemIsRemoving() {
    return isRemoving() || mProps.isRemoving;
  }

  function removeItem() {
    mProps.staticOnRemoveError(false);
    setIsRemoving(true);
    setIsDialogOpen(false);

    fetch(
      `${import.meta.env.PUBLIC_API_URL}/lists/${mProps.defaultListItemId}`,
      {
        method: "DELETE", // или 'PUT', 'DELETE', и т.д.
      },
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then(() => {
        soften(() => mProps.staticOnRemoveSuccess(mProps.defaultListItemId));
      })
      .catch((error) => {
        soften(() => {
          mProps.staticOnRemoveError(true);
          console.error(
            "There has been a problem with your fetch operation:",
            error,
          );
          setIsRemoving(false);
        });
      });
  }

  return (
    <div
      class={`listItem listItem_${mProps.theme} listItem_${mProps.size}`}
      classList={{
        listItem_removing: listItemIsRemoving(),
      }}
    >
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
        <ListItemInput
          theme={ListItemInputTheme.Primary}
          size={ListItemInputSize.Medium}
          maxLength={EDIT_LIST_INPUT_LIMIT}
          name={"ололо"}
          testId={DEFAULT_TEST_ID}
          isDisabled={mProps.isDisabled}
          defaultValue={mProps.defaultValue}
          isRequired={true}
        />
        <div class="listItem__controls">
          <IconButton
            iconName={IconName.Edit}
            ariaLabel={"Выпадающее меню"}
            theme={IconButtonTheme.Primary}
            size={IconButtonSize.Medium}
            componentType={IconButtonComponentType.Button}
            isDisabled={listItemIsRemoving()}
            testId={DEFAULT_TEST_ID}
          />
          <IconButton
            iconName={IconName.Trash}
            ariaLabel={"Удалить пункт"}
            theme={IconButtonTheme.Dangerous}
            size={IconButtonSize.Medium}
            handleClick={openDialog}
            isLoading={listItemIsRemoving()}
            testId={DEFAULT_TEST_ID}
          />
        </div>
      </div>
      <Dialog
        theme={DialogTheme.Primary}
        size={DialogSize.Medium}
        onConfirm={removeItem}
        onCancel={closeDialog}
        isOpen={isDialogOpen()}
        title={"Удаление пункта"}
        testId={DEFAULT_TEST_ID}
      >
        <p>
          <strong>Пункт</strong> будет удален без возможности восстановления.
        </p>
      </Dialog>
    </div>
  );
};
