import { type Component, createEffect, For, mergeProps, Show } from "solid-js";
import { createStore } from "solid-js/store";
import "./editList.css";
import {
  BasicInput,
  InputSize,
  InputTheme,
} from "../../components/basicInput/basicInput.tsx";
import {
  Button,
  ButtonSize,
  ButtonTheme,
  ButtonType,
} from "../../components/button/button.tsx";
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
  NETWORK_ERROR,
  REMOVE_ITEM_BUTTON,
} from "../../../features/testIds.ts";
import {
  EDIT_LIST_INPUT_LIMIT,
  ITEMS_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../../configuration.ts";
import { RemoveIconButton } from "../../components/removeIconButton/removeIconButton.tsx";
import { Note, NoteSize, NoteTheme } from "../../components/note/note.tsx";
import { soften } from "./utilities/soften.ts";

type ServerItem = {
  content: string;
};

type EditListProps = {
  items?: ServerItem[];
  listName?: string;
  purpose?: string;
  note?: string;
};

type Item = {
  removeInProgress: boolean;
  defaultValue: string;
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

export const EditList: Component<EditListProps> = (props) => {
  const mProps: Required<EditListProps> = mergeProps(
    {
      listName: "",
      purpose: "",
      note: "",
      items: [{ content: "" }],
    },
    props,
  );

  const [store, setStore] = createStore({
    // This derived state is required to avoid significant
    // performance drop caused by the isLastItem function
    // in case filtering of items is done in there.
    allButLastDeleteInProgress: true,
    items: mProps.items.map((item) => ({
      removeInProgress: false,
      defaultValue: item.content,
    })),
    sendingNow: false,
    error: false,
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
      setStore("items", (items) =>
        items.concat({ removeInProgress: false, defaultValue: "" }),
      );
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

  function isAnyRemoveInProgress() {
    return store.items.some((item) => item.removeInProgress); //GERMAN почему эта функция вызывается дважды какждый раз?
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

    if (!store.sendingNow) {
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
        purpose: target[EditListFormNames.ListPurpose].value,
        items: inputsValues,
        note: target[EditListFormNames.ListNote].value,
      };

      sendList(data);
    }
  }

  function setSendingNow(status: boolean) {
    setStore("sendingNow", status);
  }

  type ListData = {
    name: string;
    purpose: string;
    items: { content: string }[];
    note: string;
  };

  function sendList(data: ListData) {
    setStore("error", false);
    setSendingNow(true);

    fetch("http://localhost:3000/lists", {
      method: "POST", // или 'PUT', 'DELETE', и т.д.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // преобразование объекта данных в JSON строку
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        window.location.href = `/lists/${data.id}`; // обработка полученных данных
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );

        soften(() => {
          setStore("error", true);
          setSendingNow(false);
        });
      });
  }

  return (
    <form class="editList" method="post" onSubmit={prepareAndSendListData}>
      <Show when={store.error}>
        <div class="editList__serverError" data-test-id={NETWORK_ERROR}>
          Произошла ошибка соединения с сервером, попробуйте еще раз
        </div>
      </Show>
      <div class="editList__listHeader">
        <div class="editList__title">
          <div class="editList__input">
            <BasicInput
              theme={InputTheme.Secondary}
              size={InputSize.Medium}
              placeholder="Название чек-листа"
              maxLength={LIST_TITLE_INPUT_LIMIT}
              name={EditListFormNames.ListTitle}
              testId={LIST_TITLE_INPUT}
              isRequired={true}
              isDisabled={store.sendingNow}
              defaultValue={mProps.listName}
            />
          </div>
          <Button
            type={ButtonType.Submit}
            theme={ButtonTheme.Primary}
            size={ButtonSize.Medium}
            text="Создать"
            isLoading={store.sendingNow}
            testId={CREATE_LIST_BUTTON}
            isDisabled={isAnyRemoveInProgress()}
          />
        </div>
        <div class="editList__input">
          <BasicInput
            theme={InputTheme.Primary}
            size={InputSize.Medium}
            placeholder="Назначение чек-листа"
            maxLength={LIST_PURPOSE_INPUT_LIMIT}
            name={EditListFormNames.ListPurpose}
            testId={LIST_PURPOSE_INPUT}
            isDisabled={store.sendingNow}
            defaultValue={mProps.purpose}
          />
        </div>
        <div class="editList__input">
          <Note
            theme={NoteTheme.Primary}
            size={NoteSize.Medium}
            title="Заметка"
            name={EditListFormNames.ListNote}
            isDisabled={store.sendingNow}
            defaultValue={mProps.note}
          />
        </div>
      </div>

      <div class="editList__container">
        <div class="editList__inner" data-test-id={ITEMS_INPUTS}>
          <div class="editList__scrollWrapper">
            <For each={store.items}>
              {(item, getIndex) => (
                <div
                  class="editList__item"
                  classList={{
                    editList__item_removeInProgress: item.removeInProgress,
                    editList__item_disabled: store.sendingNow,
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
                      defaultValue={item.defaultValue}
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
