import type { Component } from "solid-js";
import { createSignal, For, Show } from "solid-js";
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
} from "../../../../../features/testIds.ts";

// It's not Record<string, string> as there is a TypeScript error arriving:
// Type '{ "client:only": string; }' is not assignable to type 'EditListProps'.
type EditListProps = Record<string, string>;

export const EditList: Component<EditListProps> = () => {
  const [getInputs, setInputs] = createSignal([{}]);

  const addItem = () => {
    if (!checkItemsLimitReached()) {
      setInputs((prev) => prev.concat({}));
    }
  };

  const checkItemsLimitReached = () => {
    return getInputs().length >= 500;
  };

  return (
    <div class="editList">
      <div class="editList__inner">
        <For each={getInputs()}>
          {() => (
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
                />
              </div>
            </div>
          )}
        </For>
      </div>

      <div class="editList__error">
        <Show when={checkItemsLimitReached()}>
          <span class="editList__errorText">
            Вы использовали лимит в 500 пунктов
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
