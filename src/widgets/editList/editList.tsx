import { type Component, createSignal, For, mergeProps, Show } from "solid-js";
import { createStore } from "solid-js/store";
import "./editList.css";
import { Button, ButtonType } from "../../components/button/button.tsx";
import {
  CREATE_LIST_BUTTON,
  DEFAULT_TEST_ID,
  ITEM_INPUT_CONTAINER,
  ITEMS_INPUTS,
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_PURPOSE_INPUT,
  LIST_TITLE_INPUT,
  NETWORK_ERROR,
} from "../../../features/testIds.ts";
import {
  ITEMS_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../../configuration.ts";
import { Note } from "../../components/note/note.tsx";
import { soften } from "./utilities/soften.ts";
import { PageError } from "../../components/pageError/pageError.tsx";
import { createList } from "../../services/createList.ts";
import { ListItem } from "../../components/listItem/listItem.tsx";
import {
  ToolsPanel,
  ToolsPanelSize,
  ToolsPanelTheme,
} from "../../organisms/toolsPanel/toolsPanel.tsx";
import { Switch } from "../../components/switch/switch.tsx";
import type { BackendList, NewList, UpdatedList } from "../../types.ts";
import { updateList } from "../../services/updateList.ts";
import { Divider } from "../../components/divider/divider.tsx";
import {
  ToolsButton,
  ToolsButtonComponentType,
  ToolsButtonTheme,
} from "../../components/toolsButton/toolsButton.tsx";
import { IconName } from "../../components/icon/icon.tsx";
import { EditableTitle } from "../../components/editableTitle/editableTitle.tsx";
import {
  ItemInput,
  ItemInputSize,
  ItemInputTheme,
} from "../../components/itemInput/itemInput.tsx";

type EditListProps = {
  defaultList?: BackendList;
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
      defaultList: {
        id: "",
        name: "",
        purpose: "",
        note: "",
        items: [{ content: "", id: "" }],
      },
    },
    props,
  );

  const list = mProps.defaultList;

  type EditListStore = {
    items: UpdatedList["items"];
    sendingNow: boolean;
    error: boolean;
  };

  const [store, setStore] = createStore<EditListStore>({
    items: list.items,
    sendingNow: false,
    error: false,
  });

  const [getCheckable, setIsCheckable] = createSignal(false);

  function addItem() {
    if (store.items.length < ITEMS_LIMIT) {
      setStore("items", [...store.items, { content: "", id: "" }]);
    }
  }

  function checkItemsLimitReached() {
    return store.items.length >= ITEMS_LIMIT;
  }

  function isLastItem() {
    return store.items.length === 1;
  }

  function removeItem(indexToRemove: number) {
    setStore("items", (items) =>
      items.filter((_item, index) => index !== indexToRemove),
    );
  }

  function prepareAndSendListData(event: SubmitEvent) {
    event.preventDefault();

    if (!store.sendingNow) {
      const target = event.target as HTMLFormElement & EditListForm;

      const elements = Array.from(target.elements) as HTMLInputElement[];

      const itemsInputs = elements.filter((element) => {
        return element.name.startsWith(EditListFormNames.ListItem);
      });

      const inputsValues = itemsInputs.map((itemInput) => {
        if (itemInput.dataset.id) {
          return {
            content: itemInput.value,
            id: itemInput.dataset.id,
          };
        } else {
          return {
            content: itemInput.value,
          };
        }
      });

      const data = {
        name: target[EditListFormNames.ListTitle].value,
        purpose: target[EditListFormNames.ListPurpose].value,
        items: inputsValues,
        note: target[EditListFormNames.ListNote].value,
        noDocumentedReasonForLatestUpdate: true, // GERMAN надо будет потом выпилить на бекенде
      };

      if (list.id) {
        sendListUpdate({ ...data, id: list.id });
      } else {
        sendList(data);
      }
    }
  }

  function setSendingNow(status: boolean) {
    setStore("sendingNow", status);
  }

  function sendList(data: NewList) {
    setStore("error", false);
    setSendingNow(true);

    createList(data)
      .then((list) => {
        soften(() => {
          history.pushState({}, "", `/lists/${list.id}`);
          setSendingNow(false);
        });
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

  function sendListUpdate(data: UpdatedList) {
    setStore("error", false);
    setSendingNow(true);

    updateList(data)
      .then(() => {
        soften(() => {
          setSendingNow(false);
        });
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
    <div class="editList">
      <div class="editList__main">
        <form
          class="editList__form"
          method="post"
          onSubmit={prepareAndSendListData}
        >
          <div class="editList__wrapper">
            <div class="editList__listHeader">
              <div class="editList__title">
                <EditableTitle
                  maxLength={LIST_TITLE_INPUT_LIMIT}
                  name={EditListFormNames.ListTitle}
                  testId={LIST_TITLE_INPUT}
                  isRequired={true}
                  isDisabled={store.sendingNow}
                  defaultValue={list.name}
                />
              </div>
              <div class="editList__input">
                <ItemInput
                  theme={ItemInputTheme.Primary}
                  size={ItemInputSize.Medium}
                  placeholder="Цель списка"
                  maxLength={LIST_PURPOSE_INPUT_LIMIT}
                  name={EditListFormNames.ListPurpose}
                  testId={LIST_PURPOSE_INPUT}
                  isDisabled={store.sendingNow}
                  defaultValue={list.purpose}
                />
              </div>
              <div class="editList__input">
                <Note
                  title="Заметка"
                  name={EditListFormNames.ListNote}
                  isDisabled={store.sendingNow}
                  defaultValue={list.note}
                />
              </div>
            </div>

            <div class="editList__container">
              <div class="editList__inner" data-test-id={ITEMS_INPUTS}>
                <div class="editList__scrollWrapper">
                  <For each={store.items}>
                    {(item, getIndex) => (
                      <ListItem
                        removeItem={() => removeItem(getIndex())}
                        isDisabled={store.sendingNow}
                        isLastItem={isLastItem()}
                        isCheckable={getCheckable()}
                        isChecked={false}
                        defaultValue={item.content}
                        name={`${EditListFormNames.ListItem} ${getIndex() + 1}`}
                        dataId={"id" in item ? item.id : ""}
                        defaultListItemId={String(getIndex())}
                        data-test-id={ITEM_INPUT_CONTAINER}
                        data-test-sub-id={getIndex()}
                      />
                    )}
                  </For>
                </div>
              </div>
              <Show when={store.error}>
                <PageError testId={NETWORK_ERROR}>
                  Произошла ошибка соединения с сервером, попробуйте еще раз
                </PageError>
              </Show>
              <Show when={checkItemsLimitReached()}>
                <PageError testId={ITEMS_LIMIT_REACHED_WARNING}>
                  Вы использовали лимит в {ITEMS_LIMIT} пунктов
                </PageError>
              </Show>

              <div class="editList__controls">
                <Button
                  type={ButtonType.Submit}
                  text="Сохранить"
                  isLoading={store.sendingNow}
                  testId={CREATE_LIST_BUTTON}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
      <aside class="editList__toolsPanel">
        <ToolsPanel
          size={ToolsPanelSize.Medium}
          theme={ToolsPanelTheme.Primary}
          testId={DEFAULT_TEST_ID}
        >
          <div class="toolsPanel__horizontalSection">
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.RowsPlusBottom}
              handleClick={addItem}
              isDisabled={checkItemsLimitReached() || store.sendingNow}
              text={"Добавить пункт"}
              testId={DEFAULT_TEST_ID}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.CopySimple}
              text={"Копировать пункты"}
              testId={DEFAULT_TEST_ID}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.Trash}
              theme={ToolsButtonTheme.Dangerous}
              text={"Удалить список"}
              testId={DEFAULT_TEST_ID}
            />
          </div>
          <Divider testId={DEFAULT_TEST_ID} />
          <div class="toolsPanel__verticalSection">
            <Switch
              testId={DEFAULT_TEST_ID}
              text="Чек-лист"
              isChecked={getCheckable()}
              onChange={setIsCheckable}
            />
          </div>
          <Divider testId={DEFAULT_TEST_ID} />
          <div class="toolsPanel__horizontalSection">
            <ToolsButton
              componentType={ToolsButtonComponentType.Link}
              iconName={IconName.Printer}
              link={`./${list.id}/print`}
              text={"Напечатать список"}
              testId={DEFAULT_TEST_ID}
              openInNewTab={true}
            />
          </div>
        </ToolsPanel>
      </aside>
    </div>
  );
};
