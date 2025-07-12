import {
  createSortable,
  DragDropProvider,
  DragDropSensors,
  type DragEvent,
  DragOverlay,
  SortableProvider,
  transformStyle,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { For, mergeProps, onCleanup, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

import {
  ITEMS_LIMIT,
  LIST_PURPOSE_INPUT_LIMIT,
  LIST_TITLE_INPUT_LIMIT,
} from "../../../configuration.ts";
import {
  AUTO_LIST_ITEM,
  CHECKLIST_SWITCH,
  DIALOG_REMOVE_BUTTON,
  DRAGGED_LIST_ITEM,
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_ITEM,
  LIST_ITEMS,
  LIST_PURPOSE_INPUT,
  LIST_REMOVAL_ERROR,
  LIST_TITLE_INPUT,
  NETWORK_ERROR,
  REMOVE_LIST_DIALOG,
  SAVE_LIST_BUTTON,
  TOOLS_PANEL,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  TOOLS_PANEL_BUTTON_COPY_ITEMS,
  TOOLS_PANEL_BUTTON_PRINT_LIST,
  TOOLS_PANEL_BUTTON_REMOVE_LIST,
} from "../../../features/testIds.ts";
import { MY_LISTS } from "../../../utilities/addresses.ts";
import { suffixTabTitle } from "../../../utilities/tabTitle.ts";
import {
  Button,
  ButtonSize,
  ButtonTheme,
  ButtonType,
} from "../../components/button/button.tsx";
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
import { setLocation } from "../../state/locationState.ts";

import { createList } from "./services/createList.ts";
import { removeList } from "./services/removeList.ts";
import { updateList } from "./services/updateList.ts";
import {
  type DragItems,
  EditListFormNames,
  type EditListStore,
  type List,
  type NewList,
  type ScrollContainer,
  type UpdatedList,
} from "./types.ts";
import { addAutoItemIfNeeded } from "./utilities/addAutoItemIfNeeded.ts";
import { checkChanges } from "./utilities/checkChanges.ts";
import { copyItemsToClipboard } from "./utilities/copyItemsToClipboard.ts";
import { createDefaultItem } from "./utilities/createDefaultItem.ts";
import {
  convertItemsToDragItems,
  createAutoScroll,
  createScrollableCollisionsDetector,
} from "./utilities/dragAndDrop.ts";
import { isOnlyOneItem } from "./utilities/isOnlyOneItem.ts";
import { prepareListItemsDataForSending } from "./utilities/prepareListItemsDataForSending.ts";
import { soften } from "./utilities/soften.ts";
import "./editList.css";

type EditListProps = {
  defaultList?: List;
};

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

  let scrollContainer: ScrollContainer = undefined;

  function scrollToBottom() {
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }

  const list = mProps.defaultList;

  const [store, setStore] = createStore<EditListStore>({
    id: list.id,
    items: addAutoItemIfNeeded(convertItemsToDragItems(list)),
    name: list.name,
    purpose: list.purpose,
    note: list.note,
    initialList: list,
    sendingNow: false,
    error: false,
    removeError: false,
    isCheckable: false,
    isDialogOpen: false,
    isChanged: false,
    isNewList: list.id === "",
    draggedItem: "",
    itemsScrollStartPosition: 0,
  });

  type AddItemOptions =
    | { mode: "end"; scroll?: boolean; auto: boolean }
    | { mode: "before" | "after"; index: number };

  const autoScroll = createAutoScroll({
    isActive: () => !!store.draggedItem,
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

    onCleanup(() => {
      window.removeEventListener("beforeunload", handleLeave);
    });
  });

  const toggleCheckable = () => setStore("isCheckable", !store.isCheckable);
  const openDialog = () => setStore("isDialogOpen", true);
  const closeDialog = () => setStore("isDialogOpen", false);

  function addItem(options: AddItemOptions) {
    if (reachedItemsLimit()) return;

    let resultingItems: DragItems = [];

    if (options.mode === "end") {
      const items = store.items.filter((item) => !item.auto);
      const existingAutoItem = store.items.filter((item) => item.auto);

      resultingItems = [
        ...items,
        createDefaultItem(options.auto),
        ...existingAutoItem,
      ];

      if (options.scroll) {
        requestAnimationFrame(scrollToBottom);
      }
    }

    if (options.mode === "before" || options.mode === "after") {
      const insertIndex =
        options.mode === "before" ? options.index : options.index + 1;

      resultingItems = [
        ...store.items.slice(0, insertIndex).map((item) => ({
          ...item,
          auto: false,
        })),
        createDefaultItem(),
        ...store.items.slice(insertIndex),
      ];
    }

    setStore("items", resultingItems.slice(0, ITEMS_LIMIT));
    checkChanges(store, setStore);
  }

  function isLastItem(index: number) {
    return index === store.items.length - 1;
  }

  function handleItemChange(index: number, value: string) {
    setStore("items", index, "content", value);
    checkChanges(store, setStore);

    if (isLastItem(index) && value.trim() !== "") {
      setStore("items", index, "auto", false);
      addItem({ mode: "end", scroll: true, auto: true });
    }

    const lastIndex = store.items.length - 1;
    const beforeLastIndex = lastIndex - 1;

    if (
      !isOnlyOneItem(store.items) &&
      index === beforeLastIndex &&
      store.items[lastIndex]?.content.trim() === "" &&
      store.items[beforeLastIndex]?.content.trim() === ""
    ) {
      removeItem(lastIndex);
    }
  }

  function reachedItemsLimit() {
    return store.items.filter((item) => !item.auto).length >= ITEMS_LIMIT;
  }

  function removeItem(indexToRemove: number) {
    setStore("items", (items) => {
      const updatedItems = items.filter(
        (_item, index) => index !== indexToRemove,
      );

      if (updatedItems.length === 1) {
        return updatedItems.map((item) => ({
          ...item,
          auto: false,
        }));
      }

      return updatedItems;
    });
    checkChanges(store, setStore);
  }

  function handleInputChange(key: keyof List, value: string) {
    setStore(key, value);
    checkChanges(store, setStore);
  }

  function prepareAndSendListData(event: SubmitEvent) {
    event.preventDefault();

    if (!store.sendingNow) {
      const target = event.target as HTMLFormElement & EditListForm;

      const elements = Array.from(target.elements) as HTMLInputElement[];
      const inputsValues = prepareListItemsDataForSending(elements, store);
      const data = {
        name: target[EditListFormNames.ListTitle].value,
        purpose: target[EditListFormNames.ListPurpose].value,
        items: inputsValues,
        note: target[EditListFormNames.ListNote].value,
        noDocumentedReasonForLatestUpdate: true,
      };

      if (store.id) {
        sendUpdatedList({ ...data, id: store.id });
      } else {
        sendNewList(data);
      }
    }
  }

  function sendNewList(data: NewList) {
    setStore({
      error: false,
      sendingNow: "saving",
    });

    createList(data)
      .then((newList) => {
        soften(() => {
          history.pushState({}, "", `${MY_LISTS}${newList.id}`);
          setLocation(window.location.pathname);
          document.title = suffixTabTitle(newList.name);

          setStore({
            id: newList.id,
            isNewList: false,
            sendingNow: false,
            items: addAutoItemIfNeeded(convertItemsToDragItems(newList)),
            initialList: newList,
          });

          checkChanges(store, setStore);
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

  function sendUpdatedList(data: UpdatedList) {
    setStore({
      error: false,
      sendingNow: "saving",
    });

    updateList(data)
      .then((updatedList) => {
        soften(() => {
          document.title = suffixTabTitle(updatedList.name);

          setStore({
            isNewList: false,
            sendingNow: false,
            items: addAutoItemIfNeeded(convertItemsToDragItems(updatedList)),
            initialList: updatedList,
          });

          checkChanges(store, setStore);
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
      removeError: false,
      sendingNow: "deleting",
    });
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
            sendingNow: false,
            removeError: true,
          });
        });
      });
  }

  const draggedItemData = () =>
    store.items.find((item) => item.dragId === store.draggedItem) ||
    createDefaultItem();
  const ids = () => store.items.map((item) => item.dragId);

  const onDragStart = ({ draggable }: DragEvent) => {
    setStore({
      draggedItem: String(draggable.id),
      itemsScrollStartPosition: scrollContainer?.scrollTop || 0,
    });

    autoScroll.startListening(scrollContainer);
  };

  const onDragEnd = ({ draggable, droppable }: DragEvent) => {
    autoScroll.stopListening();

    if (draggable && droppable) {
      const currentItems = [...store.items];
      const fromIndex = currentItems.findIndex(
        (item) => item.dragId === draggable.id,
      );
      const toIndex = currentItems.findIndex(
        (item) => item.dragId === droppable.id,
      );

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        const updatedItems = [...currentItems];
        const [movedItem] = updatedItems.splice(fromIndex, 1);

        if (!movedItem) return;

        updatedItems.splice(toIndex, 0, movedItem);

        setStore(
          "items",
          updatedItems.map((item, index) => ({
            ...item,
            auto:
              index === updatedItems.length - 1 && item.content.trim() === "",
          })),
        );
        checkChanges(store, setStore);
      }
    }

    setStore({ draggedItem: "", itemsScrollStartPosition: 0 });
  };

  return (
    <div class="editList">
      <div class="editList__main">
        <form
          class="editList__form"
          method="post"
          onSubmit={prepareAndSendListData}
        >
          <div class="editList__listHeader">
            <EditableTitle
              maxLength={LIST_TITLE_INPUT_LIMIT}
              name={EditListFormNames.ListTitle}
              testId={LIST_TITLE_INPUT}
              isRequired={true}
              isDisabled={store.sendingNow !== false}
              defaultValue={store.name}
              onChange={(value) => handleInputChange("name", value)}
            />
            <ItemInput
              theme={ItemInputTheme.Primary}
              size={ItemInputSize.Medium}
              placeholder="Цель списка"
              maxLength={LIST_PURPOSE_INPUT_LIMIT}
              name={EditListFormNames.ListPurpose}
              testId={LIST_PURPOSE_INPUT}
              isDisabled={store.sendingNow !== false}
              textAreaValue={store.purpose}
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

          <div
            class="editList__scrollContainer scrollStyles"
            ref={(el) => (scrollContainer = el)}
            data-test-id={LIST_ITEMS}
          >
            <DragDropProvider
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              collisionDetector={createScrollableCollisionsDetector(
                scrollContainer,
                store,
              )}
            >
              <DragDropSensors />
              <SortableProvider ids={ids()}>
                <For each={store.items}>
                  {(item, index) => {
                    const dragData = createSortable(item.dragId);

                    return (
                      <ListItem
                        removeItem={() => removeItem(index())}
                        isDisabled={store.sendingNow !== false}
                        isOnlyOneItem={isOnlyOneItem(store.items)}
                        isCheckable={store.isCheckable}
                        isChecked={false}
                        defaultValue={item.content}
                        name={`${EditListFormNames.ListItem} ${index() + 1}`}
                        dataId={item.id}
                        onChange={(value) => handleItemChange(index(), value)}
                        onAddBefore={() =>
                          addItem({ mode: "before", index: index() })
                        }
                        onAddAfter={() =>
                          addItem({ mode: "after", index: index() })
                        }
                        canAddMore={!reachedItemsLimit()}
                        testId={item.auto ? AUTO_LIST_ITEM : LIST_ITEM}
                        testSubId={index()}
                        isRequired={!item.auto}
                        dragSettings={{
                          dragData,
                          dragProps: {
                            ref: dragData.ref,
                            style: store.draggedItem
                              ? transformStyle(dragData.transform)
                              : {},
                          },
                          dragState: useDragDropContext()?.[0] || null,
                        }}
                        placeholder={
                          item.auto ? "Добавить пункт списка" : "Пункт списка"
                        }
                      />
                    );
                  }}
                </For>
              </SortableProvider>
              <DragOverlay>
                <ListItem
                  isCheckable={store.isCheckable}
                  isChecked={false}
                  defaultValue={draggedItemData().content}
                  dataId={draggedItemData().dragId}
                  canAddMore={!reachedItemsLimit()}
                  testId={DRAGGED_LIST_ITEM}
                  isDraggingOverlay={true}
                  placeholder={
                    draggedItemData().auto
                      ? "Добавить пункт списка"
                      : "Пункт списка"
                  }
                />
              </DragOverlay>
            </DragDropProvider>
          </div>
          <Show when={store.error || reachedItemsLimit() || store.removeError}>
            <div class="editList__errors">
              <Show when={store.error}>
                <PageError testId={NETWORK_ERROR}>
                  Ошибка соединения с сервером, попробуйте еще раз
                </PageError>
              </Show>
              <Show when={reachedItemsLimit()}>
                <PageError testId={ITEMS_LIMIT_REACHED_WARNING}>
                  Вы использовали лимит в {ITEMS_LIMIT} пунктов
                </PageError>
              </Show>
              <Show when={store.removeError}>
                <PageError testId={LIST_REMOVAL_ERROR}>
                  Не удалось удалить список. Попробуйте ещё раз.
                </PageError>
              </Show>
            </div>
          </Show>

          <div class="editList__controls">
            <Button
              type={ButtonType.Submit}
              text="Сохранить"
              isDisabled={!store.isChanged || store.sendingNow === "deleting"}
              isLoading={store.sendingNow === "saving"}
              testId={SAVE_LIST_BUTTON}
            />
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
              handleClick={() =>
                addItem({ mode: "end", scroll: true, auto: false })
              }
              isDisabled={reachedItemsLimit() || store.sendingNow !== false}
              text={"Добавить пункт"}
              testId={TOOLS_PANEL_ADD_ITEM_BUTTON}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.CopySimple}
              text={"Копировать пункты"}
              isDisabled={store.isNewList || store.sendingNow !== false}
              handleClick={() => copyItemsToClipboard(store.items)}
              testId={TOOLS_PANEL_BUTTON_COPY_ITEMS}
            />
            <ToolsButton
              componentType={ToolsButtonComponentType.Button}
              iconName={IconName.Trash}
              theme={ToolsButtonTheme.Dangerous}
              text={"Удалить список"}
              isLoading={store.sendingNow === "deleting"}
              isDisabled={store.isNewList || store.sendingNow === "saving"}
              handleClick={openDialog}
              testId={TOOLS_PANEL_BUTTON_REMOVE_LIST}
            />
            <Dialog
              title="Удаление списка"
              onCancel={closeDialog}
              controls={
                <Button
                  theme={ButtonTheme.Dangerous}
                  size={ButtonSize.Medium}
                  text={"Удалить"}
                  handleClick={() => {
                    sendListRemove();
                    closeDialog();
                  }}
                  testId={DIALOG_REMOVE_BUTTON}
                />
              }
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
              link={`./${store.id}/print?checkable=${store.isCheckable}`}
              text={"Напечатать список"}
              testId={TOOLS_PANEL_BUTTON_PRINT_LIST}
              isDisabled={store.isNewList || store.sendingNow !== false}
              openInNewTab={true}
            />
          </div>
        </ToolsPanel>
      </aside>
    </div>
  );
};
