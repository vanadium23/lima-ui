import type { Component } from "solid-js";
import { createSignal, For } from "solid-js";
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

// It's not Record<string, string> as there is a TypeScript error arriving:
// Type '{ "client:only": string; }' is not assignable to type 'EditListProps'.
type EditListProps = Record<string, string>;

export const EditList: Component<EditListProps> = () => {
  const [inputs] = createSignal([{}]);

  return (
    <div class="editList">
      <div class="editList__inner">
        <For each={inputs()}>
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
                />
              </div>
            </div>
          )}
        </For>
      </div>

      <div class="editList__error" />

      <div class="editList__controls">
        <Button
          theme={ButtonTheme.Secondary}
          size={ButtonSize.Medium}
          text="Добавить пункт"
        />
        <Button
          theme={ButtonTheme.Secondary}
          size={ButtonSize.Medium}
          text="Импортировать"
        />
      </div>
    </div>
  );
};
