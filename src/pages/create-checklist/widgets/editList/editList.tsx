import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import "./editList.css";
import {
  BasicInput,
  InputSize,
  InputTheme,
} from "../../../../components/basicInput/basicInput.tsx";
import {
  Button,
  ButtonSize,
  ButtonTheme,
} from "../../../../components/button/button.tsx";
import {
  ADD_ITEM_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  ITEMS_INPUTS,
  ITEMS_LIMIT_REACHED_WARNING,
} from "../../../../../features/testIds.ts";
import { ITEMS_LIMIT } from "../../../../../configuration.ts";
import { RemoveIconButton } from "../../../../components/removeIconButton/removeIconButton.tsx";

// It's not Record<string, string> as there is a TypeScript error arriving:
// Type '{ "client:only": string; }' is not assignable to type 'EditListProps'.
type EditListProps = Record<string, string>;
type Item = {
  deleteInProgress: boolean;
};

export const EditList: Component<EditListProps> = () => {
  const [items, setItems] = createStore([{ deleteInProgress: false }]);

  function addItem() {
    if (!checkItemsLimitReached()) {
      setItems((items) => items.concat({ deleteInProgress: false }));
    }
  }

  function checkItemsLimitReached() {
    return items.length >= ITEMS_LIMIT;
  }

  function isLastItem(item: Item) {
    const deleteInProgressCount = items.filter(
      (item) => item.deleteInProgress,
    ).length;

    return !item.deleteInProgress
      ? deleteInProgressCount === items.length - 1
      : false;
  }

  function removeItem(indexToRemove: number) {
    setItems((items) =>
      items.filter((_item, index) => index !== indexToRemove),
    );
  }

  function setDeleteInProgress(indexToSet: number) {
    setItems(indexToSet, {
      deleteInProgress: true,
    });
  }

  function resetDeleteInProgress(indexToReset: number) {
    setItems(indexToReset, {
      deleteInProgress: false,
    });
  }

  return (
    <div class="editList">
      <div class="editList__inner" data-test-id={ITEMS_INPUTS}>
        <div class="editList__scrollWrapper">
          <For each={items}>
            {(item, getIndex) => (
              <div class="editList__item">
                <div class="editList__input">
                  <BasicInput
                    placeholder="Текст пункта"
                    theme={InputTheme.Primary}
                    size={InputSize.Medium}
                    maxLength={200}
                    isRequired={true}
                    name="checklist-item"
                    testId={ITEM_INPUT}
                    testSubId={getIndex()}
                  />
                </div>
                <div class="editList__itemControls">
                  <RemoveIconButton
                    removeItem={() => {
                      removeItem(getIndex());
                    }}
                    onTimerStart={() => {
                      setDeleteInProgress(getIndex());
                    }}
                    onTimerCancel={() => {
                      resetDeleteInProgress(getIndex());
                    }}
                    isDisabled={isLastItem(item)}
                  />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      <div class="editList__error">
        <Show when={checkItemsLimitReached()}>
          <span
            class="editList__errorText"
            data-test-id={ITEMS_LIMIT_REACHED_WARNING}
          >
            Вы использовали лимит в {ITEMS_LIMIT} пунктов
          </span>
        </Show>
      </div>

      <div class="editList__controls">
        <Button
          theme={ButtonTheme.Secondary}
          size={ButtonSize.Medium}
          text="Добавить пункт"
          handleClick={addItem}
          isDisabled={checkItemsLimitReached()}
          testId={ADD_ITEM_BUTTON}
        />
        <Button
          theme={ButtonTheme.Secondary}
          size={ButtonSize.Medium}
          text="Импортировать"
          isDisabled={checkItemsLimitReached()}
          testId={IMPORT_BUTTON}
        />
      </div>
    </div>
  );
};
