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
  ButtonType,
} from "../../../../components/button/button.tsx";
import {
  ADD_ITEM_BUTTON,
  CANCEL_ITEM_REMOVAL_BUTTON,
  CREATE_LIST_BUTTON,
  IMPORT_BUTTON,
  ITEM_INPUT,
  ITEM_INPUT_CONTAINER,
  ITEMS_INPUTS,
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_PURPOSE_INPUT,
  LIST_TITLE_INPUT,
  REMOVE_ITEM_BUTTON,
} from "../../../../../features/testIds.ts";
import {
  EDIT_LIST_INPUT_LIMIT,
  ITEMS_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../../../../configuration.ts";
import { RemoveIconButton } from "../../../../components/removeIconButton/removeIconButton.tsx";
import {
  Note,
  NoteSize,
  NoteTheme,
} from "../../../../components/note/note.tsx";

// It's not Record<string, string> as there is a TypeScript error arriving:
// Type '{ "client:only": string; }' is not assignable to type 'EditListProps'.
type EditListProps = Record<string, string>;
type Item = {
  removeInProgress: boolean;
};

enum EditListFormNames {
  ListTitle = "List Title",
  ListPurpose = "List Purpose",
  ListNote = "List Note",
  ListItem = "List Item",
}

type EditListForm = {
  [EditListFormNames.ListTitle]: HTMLInputElement;
  [EditListFormNames.ListPurpose]: HTMLInputElement;
  [EditListFormNames.ListNote]: HTMLInputElement;
};

export const EditList: Component<EditListProps> = () => {
  const [store, setStore] = createStore({
    // This derived state is required to avoid significant
    // performance drop caused by the isLastItem function
    // in case filtering of items is done in there.
    allButLastDeleteInProgress: true,
    items: [{ removeInProgress: false }],
    sendingNow: false,
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

  function setRemoveInProgress(indexToSet: number) {
    setStore("items", indexToSet, {
      removeInProgress: true,
    });
  }

  function resetRemoveInProgress(indexToReset: number) {
    setStore("items", indexToReset, {
      removeInProgress: false,
    });
  }

  function prepareAndSendListData(event: SubmitEvent) {
    event.preventDefault();

    const target = event.target as HTMLFormElement & EditListForm;

    const elements = Array.from(target.elements) as HTMLInputElement[];

    const itemsInputs = elements.filter((element) => {
      return element.name.startsWith(EditListFormNames.ListItem);
    });

    const inputsValues = itemsInputs.map((itemInput) => ({
      content: itemInput.value,
    }));

    const data = {
      name: target[EditListFormNames.ListTitle].value,
      reasonForExistence: target[EditListFormNames.ListPurpose].value,
      items: inputsValues,
      note: target[EditListFormNames.ListNote].value,
    };

    sendList(data);
  }

  function setSendingNow(status: boolean) {
    setStore("sendingNow", status);
  }

  type ListData = {
    name: string;
    reasonForExistence: string;
    items: { content: string }[];
    note: string;
  };

  function sendList(data: ListData) {
    setSendingNow(true);

    fetch("http://localhost:3000/sverniks", {
      method: "POST", // или 'PUT', 'DELETE', и т.д.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // преобразование объекта данных в JSON строку
    })
      .then((response) => {
        setSendingNow(false); // MAKSIM выпилить отмену загрузки когда научимся после отправки перехдить на страницу готового списка
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // обработка полученных данных
        setSendingNow(false); // MAKSIM выпилить отмену загрузки когда научимся после отправки перехдить на страницу готового списка
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );
        setSendingNow(false);
      });
  }

  return (
    <form class="createList" method="post" onSubmit={prepareAndSendListData}>
      <div class="createList__listHeader">
        <div class="createList__title">
          <div class="createList__input">
            <BasicInput
              theme={InputTheme.Secondary}
              size={InputSize.Medium}
              placeholder="Название чек-листа"
              maxLength={LIST_TITLE_INPUT_LIMIT}
              isRequired={true}
              name={EditListFormNames.ListTitle}
              testId={LIST_TITLE_INPUT}
              isDisabled={store.sendingNow}
            />
          </div>
          <Button
            type={ButtonType.Submit}
            theme={ButtonTheme.Primary}
            size={ButtonSize.Medium}
            text="Создать"
            isLoading={store.sendingNow}
            testId={CREATE_LIST_BUTTON}
          />
        </div>
        <div class="createList__input">
          <BasicInput
            theme={InputTheme.Primary}
            size={InputSize.Medium}
            placeholder="Назначение чек-листа"
            maxLength={LIST_PURPOSE_INPUT_LIMIT}
            isRequired={false}
            name={EditListFormNames.ListPurpose}
            testId={LIST_PURPOSE_INPUT}
            isDisabled={store.sendingNow}
          />
        </div>
        <div class="createList__input">
          <Note
            theme={NoteTheme.Primary}
            size={NoteSize.Medium}
            title="Заметка"
            name={EditListFormNames.ListNote}
            isDisabled={store.sendingNow}
          />
        </div>
      </div>

      <div class="editList">
        <div class="editList__inner" data-test-id={ITEMS_INPUTS}>
          <div class="editList__scrollWrapper">
            <For each={store.items}>
              {(item, getIndex) => (
                <div
                  class="editList__item"
                  classList={{
                    editList__item_removeInProgress: item.removeInProgress,
                  }}
                  data-test-id={ITEM_INPUT_CONTAINER}
                  data-test-sub-id={getIndex()}
                >
                  <div class="editList__input">
                    <BasicInput
                      placeholder="Текст пункта"
                      theme={InputTheme.Primary}
                      size={InputSize.Medium}
                      maxLength={EDIT_LIST_INPUT_LIMIT}
                      isRequired={true}
                      name={`${EditListFormNames.ListItem} ${getIndex() + 1}`}
                      testId={ITEM_INPUT}
                      testSubId={getIndex()}
                      isDisabled={item.removeInProgress || store.sendingNow}
                    />
                  </div>
                  <div class="editList__itemControls">
                    <RemoveIconButton
                      removeItem={() => {
                        removeItem(getIndex());
                      }}
                      onTimerStart={() => {
                        setRemoveInProgress(getIndex());
                      }}
                      onTimerCancel={() => {
                        resetRemoveInProgress(getIndex());
                      }}
                      isDisabled={isLastItem(item) || store.sendingNow}
                      testId={
                        !item.removeInProgress
                          ? REMOVE_ITEM_BUTTON
                          : CANCEL_ITEM_REMOVAL_BUTTON
                      }
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
            isDisabled={checkItemsLimitReached() || store.sendingNow}
            testId={ADD_ITEM_BUTTON}
          />
          <Button
            theme={ButtonTheme.Secondary}
            size={ButtonSize.Medium}
            text="Импортировать"
            isDisabled={checkItemsLimitReached() || store.sendingNow}
            testId={IMPORT_BUTTON}
          />
        </div>
      </div>
    </form>
  );
};
