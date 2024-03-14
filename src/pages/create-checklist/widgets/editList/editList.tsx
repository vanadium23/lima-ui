import { type Component, createEffect, For, Show } from "solid-js";
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
  REMOVE_ITEM_BUTTON,
} from "../../../../../features/testIds.ts";
import { ITEMS_LIMIT } from "../../../../../configuration.ts";
import { RemoveIconButton } from "../../../../components/removeIconButton/removeIconButton.tsx";

// It's not Record<string, string> as there is a TypeScript error arriving:
// Type '{ "client:only": string; }' is not assignable to type 'EditListProps'.
type EditListProps = Record<string, string>;
type Item = {
  removeInProgress: boolean;
};

export const EditList: Component<EditListProps> = () => {
  const [store, setStore] = createStore({
    // This derived state is required to avoid significant
    // performance drop caused by the isLastItem function
    // in case filtering of items is done in there.
    allButLastDeleteInProgress: true,
    items: [{ removeInProgress: false }],
  });

  createEffect(() => {
    setStore(
      "allButLastDeleteInProgress",
      store.items.filter((item) => item.removeInProgress).length ===
        store.items.length - 1,
    );
  });

  function addItem() {
    if (!checkItemsLimitReached()) {
      setStore("items", (items) => items.concat({ removeInProgress: false }));
    }
  }

  function checkItemsLimitReached() {
    return store.items.length >= ITEMS_LIMIT;
  }

  function isLastItem(item: Item) {
    return !item.removeInProgress && store.allButLastDeleteInProgress;
  }

  function removeItem(indexToRemove: number) {
    setStore("items", (items) =>
      items.filter((_item, index) => index !== indexToRemove),
    );
  }

  function setDeleteInProgress(indexToSet: number) {
    setStore("items", indexToSet, {
      removeInProgress: true,
    });
  }

  function resetDeleteInProgress(indexToReset: number) {
    setStore("items", indexToReset, {
      removeInProgress: false,
    });
  }

  return (
    <div class="editList">
      <div class="editList__inner" data-test-id={ITEMS_INPUTS}>
        <div class="editList__scrollWrapper">
          <For each={store.items}>
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
                    testId={REMOVE_ITEM_BUTTON}
                    testSubId={getIndex()}
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
