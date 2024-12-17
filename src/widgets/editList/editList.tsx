import { type Component, For, mergeProps, Show } from "solid-js";
import { createStore } from "solid-js/store";
import "./editList.css";
import { Input, InputSize, InputTheme } from "../../components/input/input.tsx";
import {
  Button,
  ButtonSize,
  ButtonTheme,
  ButtonType,
} from "../../components/button/button.tsx";
import {
  ADD_ITEM_BUTTON,
  CREATE_LIST_BUTTON,
  DEFAULT_TEST_ID,
  IMPORT_BUTTON,
  ITEM_INPUT_CONTAINER,
  ITEMS_INPUTS,
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_PURPOSE_INPUT,
  LIST_TITLE_INPUT,
  NETWORK_ERROR,
  PAGE_TITLE,
} from "../../../features/testIds.ts";
import {
  ITEMS_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../../configuration.ts";
import { Note, NoteSize, NoteTheme } from "../../components/note/note.tsx";
import { soften } from "./utilities/soften.ts";
import {
  PageError,
  PageErrorSize,
  PageErrorTheme,
} from "../../components/pageError/pageError.tsx";
import { createList } from "../../services/createList.ts";
import {
  ListItem,
  ListItemSize,
  ListItemTheme,
} from "../../components/listItem/listItem.tsx";
import {
  ToolsPanel,
  ToolsPanelSize,
  ToolsPanelTheme,
} from "../../organisms/toolsPanel/toolsPanel.tsx";
import {
  Switch,
  SwitchSize,
  SwitchTheme,
} from "../../components/switch/switch.tsx";
import type { BackendList, NewList, UpdatedList } from "../../types.ts";
import { updateList } from "../../services/updateList.ts";
import {
  Divider,
  DividerSize,
  DividerTheme,
} from "../../components/divider/divider.tsx";
import {
  ToolsButton,
  ToolsButtonComponentType,
  ToolsButtonSize,
  ToolsButtonTheme,
} from "../../components/toolsButton/toolsButton.tsx";
import { IconName } from "../../components/icon/icon.tsx";

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

  const [store, setStore] = createStore({
    items: list.items,
    sendingNow: false,
    error: false,
  });

  function addItem() {
    if (store.items.length < ITEMS_LIMIT) {
      setStore("items", [...store.items, { content: "", id: "" }]);
    }
  }

  function checkItemsLimitReached() {
    return store.items.length >= ITEMS_LIMIT;
  }

  // function isLastItem() {
  //   return store.items.length === 1;
  // }
  //
  // function removeItem(indexToRemove: number) {
  //   setStore("items", (items) =>
  //     items.filter((_item, index) => index !== indexToRemove),
  //   );
  // }

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
        <h1 class="editList__pageTitle" data-test-id={PAGE_TITLE}>
          Создание списка
        </h1>
        <form
          class="editList__form"
          method="post"
          onSubmit={prepareAndSendListData}
        >
          <Show when={store.error}>
            <PageError
              size={PageErrorSize.Medium}
              theme={PageErrorTheme.Dangerous}
              testId={NETWORK_ERROR}
            >
              Произошла ошибка соединения с сервером, попробуйте еще раз
            </PageError>
          </Show>
          <Show when={checkItemsLimitReached()}>
            <PageError
              size={PageErrorSize.Medium}
              theme={PageErrorTheme.Dangerous}
              testId={ITEMS_LIMIT_REACHED_WARNING}
            >
              Вы использовали лимит в {ITEMS_LIMIT} пунктов
            </PageError>
          </Show>

          <div class="editList__wrapper">
            <div class="editList__listHeader">
              <div class="editList__title">
                <div class="editList__input">
                  <Input
                    theme={InputTheme.Secondary}
                    size={InputSize.Medium}
                    placeholder="Название списка"
                    maxLength={LIST_TITLE_INPUT_LIMIT}
                    name={EditListFormNames.ListTitle}
                    testId={LIST_TITLE_INPUT}
                    isRequired={true}
                    isDisabled={store.sendingNow}
                    defaultValue={list.name}
                  />
                </div>
                <Button
                  type={ButtonType.Submit}
                  theme={ButtonTheme.Primary}
                  size={ButtonSize.Medium}
                  text="Сохранить"
                  isLoading={store.sendingNow}
                  testId={CREATE_LIST_BUTTON}
                />
              </div>
              <div class="editList__input">
                <Input
                  theme={InputTheme.Primary}
                  size={InputSize.Medium}
                  placeholder="Назначение списка"
                  maxLength={LIST_PURPOSE_INPUT_LIMIT}
                  name={EditListFormNames.ListPurpose}
                  testId={LIST_PURPOSE_INPUT}
                  isDisabled={store.sendingNow}
                  defaultValue={list.purpose}
                />
              </div>
              <div class="editList__input">
                <Note
                  theme={NoteTheme.Primary}
                  size={NoteSize.Medium}
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
                        theme={ListItemTheme.Primary}
                        size={ListItemSize.Medium}
                        staticOnRemoveSuccess={() => {}}
                        staticOnRemoveError={() => {}}
                        isDisabled={store.sendingNow}
                        isCheckable={false}
                        isChecked={false}
                        defaultValue={item.content}
                        name={`${EditListFormNames.ListItem} ${getIndex() + 1}`}
                        dataId={item.id} // TODO может передавать в обычный ID? Может смержить как-то с testID? Как-то много у нас всяких ID.
                        defaultListItemId={String(getIndex())}
                        data-test-id={ITEM_INPUT_CONTAINER}
                        data-test-sub-id={getIndex()}
                      />
                    )}
                  </For>
                </div>
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
              iconName={IconName.CopySimple}
              theme={ToolsButtonTheme.Primary}
              size={ToolsButtonSize.Medium}
              text={"Копировать пункты"}
              testId={DEFAULT_TEST_ID}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Link}
              iconName={IconName.Printer}
              link={`./${list.id}/print`}
              theme={ToolsButtonTheme.Primary}
              size={ToolsButtonSize.Medium}
              text={"Напечатать список"}
              testId={DEFAULT_TEST_ID}
              openInNewTab={true}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.Trash}
              theme={ToolsButtonTheme.Dangerous}
              size={ToolsButtonSize.Medium}
              text={"Удалить список"}
              testId={DEFAULT_TEST_ID}
            />
          </div>
          <Divider
            theme={DividerTheme.Primary}
            size={DividerSize.Medium}
            testId={DEFAULT_TEST_ID}
          />
          <div class="toolsPanel__verticalSection">
            <Switch
              size={SwitchSize.Medium}
              theme={SwitchTheme.Primary}
              testId={DEFAULT_TEST_ID}
              text="Чек-лист"
            />
          </div>
          <Divider
            theme={DividerTheme.Primary}
            size={DividerSize.Medium}
            testId={DEFAULT_TEST_ID}
          />
        </ToolsPanel>
      </aside>
    </div>
  );
};
