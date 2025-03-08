import {
  createMemo,
  For,
  mergeProps,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";

import {  
  ITEMS_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../../configuration.ts";
import {
  CHECKLIST_SWITCH,
  CREATE_LIST_BUTTON,
  ITEM_INPUT_CONTAINER,
  ITEMS_INPUTS,
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_PURPOSE_INPUT,
  LIST_TITLE_INPUT,
  NETWORK_ERROR,
  REMOVE_LIST_DIALOG,
  TOOLS_BUTTON_COPY_ITEMS,
  TOOLS_BUTTON_PRINT_LIST,
  TOOLS_BUTTON_REMOVE_LIST,
  TOOLS_PANEL,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
} from "../../../features/testIds.ts";
import { Button, ButtonType } from "../../components/button/button.tsx";
import { Dialog } from "../../components/dialog/dialog.tsx";
import { Divider } from "../../components/divider/divider.tsx";
import { EditableTitle } from "../../components/editableTitle/editableTitle.tsx";
import { IconName } from "../../components/icon/icon.tsx";
import {
  ItemInput,
  ItemInputSize,
  ItemInputTheme,
} from "../../components/itemInput/itemInput.tsx";
import { ListItem } from "../../components/listItem/listItem.tsx";
import { Note } from "../../components/note/note.tsx";
import { PageError } from "../../components/pageError/pageError.tsx";
import { Switch } from "../../components/switch/switch.tsx";
import {
  ToolsButton,
  ToolsButtonComponentType,
  ToolsButtonTheme,
} from "../../components/toolsButton/toolsButton.tsx";
import {
  ToolsPanel,
  ToolsPanelSize,
  ToolsPanelTheme,
} from "../../organisms/toolsPanel/toolsPanel.tsx";
import { createList } from "../../services/createList.ts";
import { removeList } from "../../services/removeList.ts";
import { updateList } from "../../services/updateList.ts";
import { setLocation } from "../../state/locationState.ts";
import type { BackendList, NewList, UpdatedList } from "../../types.ts";

import { soften } from "./utilities/soften.ts";
import "./editList.css";

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

export const EditList = (props: EditListProps) => {
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

  type EditListStore = {
    id: string;
    items: UpdatedList["items"];
    name: string;
    purpose: string;
    note: string;
    sendingNow: false | "saving" | "deleting";
    error: boolean;
    isCheckable: boolean;
    isDialogOpen: boolean;
    isChanged: boolean;
    isNewList: boolean;
  };

  const list = mProps.defaultList;

  const [store, setStore] = createStore<EditListStore>({
    id: list.id,
    items: list.items,
    name: list.name,
    purpose: list.purpose,
    note: list.note,
    sendingNow: false,
    error: false,
    isCheckable: false,
    isDialogOpen: false,
    isChanged: false,
    isNewList: list.id === "",
  });

  onMount(() => {
    const handleLeave = (event: BeforeUnloadEvent) => {
      if (store.isChanged) {
        event.preventDefault();

        return "Вы уверены, что хотите покинуть страницу?";
      }

      return;
    };

    window.addEventListener("beforeunload", handleLeave);

    if (
      store.items.length === 0 ||
      store.items[store.items.length - 1]?.content.trim() !== ""
    ) {
      addItem();
    }

    onCleanup(() => {
      window.removeEventListener("beforeunload", handleLeave);
    });
  });

  const toggleCheckable = () => setStore("isCheckable", !store.isCheckable);
  const openDialog = () => setStore("isDialogOpen", true);
  const closeDialog = () => setStore("isDialogOpen", false);

  function addItem() {
    if (store.items.length < ITEMS_LIMIT) {
      setStore("items", [...store.items, { content: "", id: "" }]);
      checkChanges();
    }
  }

  function handleItemChange(index: number, value: string) {
    setStore("items", index, "content", value);
    checkChanges();

    const isLastItem = index === store.items.length - 1;

    if (isLastItem && value.trim() !== "" && store.items.length < ITEMS_LIMIT) {
      addItem();
    }

    const lastIndex = store.items.length - 1;
    const beforeLastIndex = lastIndex - 1;

    if (
      !isOnlyOneItem() &&
      index === beforeLastIndex &&
      store.items[lastIndex]?.content.trim() === "" &&
      store.items[beforeLastIndex]?.content.trim() === ""
    ) {
      removeItem(lastIndex);
    }
  }

  function checkItemsLimitReached() {
    return store.items.length >= ITEMS_LIMIT;
  }

  function isOnlyOneItem() {
    return store.items.length === 1;
  }

  function removeItem(indexToRemove: number) {
    setStore("items", (items) =>
      items.filter((_item, index) => index !== indexToRemove),
    );
    checkChanges();
  }

  function copyItemsToClipboard() {
    const textToCopy = store.items
      .map((item) => item.content.trim())
      .join("\n");
    navigator.clipboard.writeText(textToCopy).catch(() => {});
  }

  function getComparableList(initialList: Omit<UpdatedList, "id">) {
    return {
      items: JSON.stringify(initialList.items),
      name: initialList.name,
      purpose: initialList.purpose,
      note: initialList.note,
    };
  }

  let initialData = getComparableList(list);

  function checkChanges() {
    const currentData = getComparableList(store);

    const hasChanges =
      currentData.items !== initialData.items ||
      currentData.name !== initialData.name ||
      currentData.purpose !== initialData.purpose ||
      currentData.note !== initialData.note;

    setStore("isChanged", hasChanges);
  }

  function handleInputChange(key: keyof typeof initialData, value: string) {
    setStore(key, value);
    checkChanges();
  }

  function prepareAndSendListData(event: SubmitEvent) {
    event.preventDefault();

    if (!store.sendingNow) {
      const target = event.target as HTMLFormElement & EditListForm;

      const elements = Array.from(target.elements) as HTMLInputElement[];

      const itemsInputs = elements.filter((element) => {
        return element.name.startsWith(EditListFormNames.ListItem);
      });

      const inputsValues = itemsInputs
        .map((itemInput) => {
          const content = itemInput.value.trim();
          const id = itemInput.dataset.id?.trim();

          return id ? { id, content } : { content };
        })
        .filter(
          (item, index) =>
            item.content !== "" || index < store.items.length - 1,
        );

      const data = {
        name: target[EditListFormNames.ListTitle].value,
        purpose: target[EditListFormNames.ListPurpose].value,
        items: inputsValues,
        note: target[EditListFormNames.ListNote].value,
        noDocumentedReasonForLatestUpdate: true,
      };

      if (store.id) {
        sendListUpdate({ ...data, id: store.id });
      } else {
        sendList(data);
      }
    }
  }

  function sendList(data: NewList) {
    setStore({
      error: false,
      sendingNow: "saving",
    });

    createList(data)
      .then((newList) => {
        soften(() => {
          history.pushState({}, "", `/lists/${newList.id}`);
          setLocation(window.location.pathname);

          setStore({
            id: newList.id,
            isNewList: false,
            sendingNow: false,
          });

          initialData = getComparableList(store);
          checkChanges();
        });
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );

        soften(() => {
          setStore("error", true);
          setStore("sendingNow", false);
        });
      });
  }

  function sendListUpdate(data: UpdatedList) {
    setStore({
      error: false,
      sendingNow: "saving",
    });

    updateList(data)
      .then(() => {
        soften(() => {
          setStore({
            isNewList: false,
            sendingNow: false,
          });

          initialData = getComparableList(store);
          checkChanges();
        });
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );

        soften(() => {
          setStore({ error: true, sendingNow: false });
        });
      });
  }

  function sendListRemove() {
    setStore({
      error: false,
      sendingNow: "deleting",
    });
    closeDialog();

    removeList(store.id)
      .then(() => {
        soften(() => {
          setStore("sendingNow", false);
          location.href = "/lists/";
        });
      })
      .catch((error) => {
        console.error("Error deleting the list:", error);
        soften(() => {
          setStore({
            error: true,
            sendingNow: false,
          });
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
                  isDisabled={store.sendingNow !== false}
                  defaultValue={store.name}
                  onChange={(value) => handleInputChange("name", value)}
                />
              </div>
              <div class="editList__listHeaderInner">
                <ItemInput
                  theme={ItemInputTheme.Primary}
                  size={ItemInputSize.Medium}
                  placeholder="Цель списка"
                  maxLength={LIST_PURPOSE_INPUT_LIMIT}
                  name={EditListFormNames.ListPurpose}
                  testId={LIST_PURPOSE_INPUT}
                  isDisabled={store.sendingNow !== false}
                  defaultValue={store.purpose}
                  onChange={(value) => handleInputChange("purpose", value)}
                />
                <Note
                  title="Заметка"
                  name={EditListFormNames.ListNote}
                  isDisabled={store.sendingNow !== false}
                  defaultValue={store.note}
                  onChange={(value) => handleInputChange("note", value)}
                />
              </div>
            </div>

            <div class="editList__container">
              <div class="editList__inner" data-test-id={ITEMS_INPUTS}>
                <div class="editList__scrollWrapper">
                  <For each={store.items}>
                    {(item, getIndex) => {
                      const index = createMemo(() => getIndex());
                      const isLastItem = createMemo(
                        () => index() === store.items.length - 1,
                      );
                      const isRequired = createMemo(
                        () => !isLastItem() || isOnlyOneItem(),
                      );

                      return (
                        <ListItem
                          removeItem={() => removeItem(index())}
                          isDisabled={store.sendingNow !== false}
                          isOnlyOneItem={isOnlyOneItem()}
                          isCheckable={store.isCheckable}
                          isChecked={false}
                          defaultValue={item.content}
                          name={`${EditListFormNames.ListItem} ${index() + 1}`}
                          dataId={"id" in item ? item.id : ""}
                          onChange={(value) => handleItemChange(index(), value)}
                          testId={ITEM_INPUT_CONTAINER}
                          testSubId={index()}
                          isRequired={isRequired()}
                        />
                      );
                    }}
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
                  isDisabled={
                    !store.isChanged || store.sendingNow === "deleting"
                  }
                  isLoading={store.sendingNow === "saving"}
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
          testId={TOOLS_PANEL}
        >
          <div class="toolsPanel__horizontalSection">
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.RowsPlusBottom}
              handleClick={addItem}
              isDisabled={
                checkItemsLimitReached() || store.sendingNow !== false
              }
              text={"Добавить пункт"}
              testId={TOOLS_PANEL_ADD_ITEM_BUTTON}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.CopySimple}
              text={"Копировать пункты"}
              isDisabled={store.isNewList || store.sendingNow !== false}
              handleClick={copyItemsToClipboard}
              testId={TOOLS_BUTTON_COPY_ITEMS}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.Trash}
              theme={ToolsButtonTheme.Dangerous}
              text={"Удалить список"}
              isLoading={store.sendingNow === "deleting"}
              isDisabled={store.isNewList || store.sendingNow === "saving"}
              handleClick={openDialog}
              testId={TOOLS_BUTTON_REMOVE_LIST}
            />
            <Dialog
              title="Удаление списка"
              onConfirm={sendListRemove}
              onCancel={closeDialog}
              isOpen={store.isDialogOpen}
              testId={REMOVE_LIST_DIALOG}
            >
              <p>
                Список <strong>{store.name}</strong> будет удален без
                возможности восстановления.
              </p>
            </Dialog>
          </div>
          <Divider />
          <div class="toolsPanel__verticalSection">
            <Switch
              testId={CHECKLIST_SWITCH}
              text="Чек-лист"
              isDisabled={store.sendingNow !== false}
              isChecked={store.isCheckable}
              onChange={toggleCheckable}
            />
          </div>
          <Divider />
          <div class="toolsPanel__horizontalSection">
            <ToolsButton
              componentType={ToolsButtonComponentType.Link}
              iconName={IconName.Printer}
              link={`./${store.id}/print`}
              text={"Напечатать список"}
              testId={TOOLS_BUTTON_PRINT_LIST}
              isDisabled={store.isNewList || store.sendingNow !== false}
              openInNewTab={true}
            />
          </div>
        </ToolsPanel>
      </aside>
    </div>
  );
};
