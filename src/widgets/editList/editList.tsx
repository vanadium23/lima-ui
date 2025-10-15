import {
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  transformStyle,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { For, mergeProps, onCleanup, onMount, Show } from "solid-js";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import {
  AUTO_LIST_ITEM,
  DEFAULT_TEST_ID,
  DRAGGED_LIST_ITEM,
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_ITEM,
  LIST_ITEMS,
  LIST_REMOVAL_ERROR,
  NETWORK_ERROR,
  SAVE_LIST_BUTTON,
} from "../../../features/testIds.ts";
import { Button, ButtonType } from "../../components/button/button.tsx";
import { ImportedGroup } from "../../components/importedGroup/importedGroup.tsx";
import { ListItem } from "../../components/listItem/listItem.tsx";
import { PageError } from "../../components/pageError/pageError.tsx";
import { EditListFormNames, type List } from "../../types/types.ts";

import { EditListHeader } from "./components/editListHeader/editListHeader.tsx";
import EditListToolsPanel from "./components/editListToolsPanel/editListToolsPanel.tsx";
import { emptyList, initStoreEditList, setStoreEditList, storeEditList } from "./editList.store.tsx";
import { addEmptyItem } from "./utilities/addEmptyItem.ts";
import { checkChanges } from "./utilities/checkChanges.ts";
import {
  createScrollableCollisionsDetector,
  draggedItemData,
  dragIds,
  onDragEnd,
  onDragStart,
} from "./utilities/dragAndDrop.ts";
import { prepareAndSendListData } from "./utilities/prepareAndSendListData.ts";
import { reachedItemsLimit } from "./utilities/reachedItemsLimit.ts";
import { removeItem } from "./utilities/removeItem.ts";
import { scroller } from "./utilities/scrollToBottom.ts";
import "./editList.css";

type EditListProps = {
  defaultList?: List;
};

export const EditList = (props: EditListProps) => {
  const mProps: Required<EditListProps> = mergeProps(
    {
      defaultList: emptyList,
    },
    props,
  );

  initStoreEditList(mProps.defaultList);

  onMount(() => {
    const handleLeave = (event: BeforeUnloadEvent) => {
      if (storeEditList.isChanged) {
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

  function isLastItem(index: number) {
    return index === storeEditList.items.length - 1;
  }

  function handleItemChange(index: number, value: string) {
    setStoreEditList("items", index, "content", value);
    checkChanges(storeEditList, setStoreEditList);

    if (isLastItem(index) && value.trim() !== "") {
      setStoreEditList("items", index, "auto", false);
      addEmptyItem({ mode: "end", scroll: true, auto: true });
    }

    const lastIndex = storeEditList.items.length - 1;
    const beforeLastIndex = lastIndex - 1;

    if (
      storeEditList.items.length !== 1 &&
      index === beforeLastIndex &&
      storeEditList.items[lastIndex]?.content.trim() === "" &&
      storeEditList.items[beforeLastIndex]?.content.trim() === ""
    ) {
      removeItem(lastIndex);
    }
  }

  return (
    <div class="editList">
      <div class="editList__main">
        <form class="editList__form" method="post" onSubmit={prepareAndSendListData}>
          <EditListHeader />

          <div
            class="editList__scrollContainer scrollStyles"
            ref={(el) => (scroller.scrollContainer = el)}
            data-test-id={LIST_ITEMS}
          >
            <DragDropProvider
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              collisionDetector={createScrollableCollisionsDetector(scroller.scrollContainer, storeEditList)}
            >
              <DragDropSensors />
              <SortableProvider ids={dragIds()}>
                <For each={storeEditList.items}>
                  {(item, index) => {
                    const dragData = createSortable(item.dragId);

                    if (item.originalListId === storeEditList.id) {
                      return (
                        <ListItem
                          removeItem={() => removeItem(index())}
                          disabled={storeEditList.sendingNow !== false}
                          isOnlyOneItem={storeEditList.items.length === 1}
                          checkable={storeEditList.isCheckable}
                          checked={false}
                          name={`${EditListFormNames.ListItem} ${index() + 1}`}
                          dataId={item.id}
                          onChange={(value) => handleItemChange(index(), value)}
                          onAddBefore={() => addEmptyItem({ mode: "before", index: index() })}
                          onAddAfter={() => addEmptyItem({ mode: "after", index: index() })}
                          canAddMore={!reachedItemsLimit()}
                          testId={item.auto ? AUTO_LIST_ITEM : LIST_ITEM}
                          testSubId={index()}
                          required={!item.auto}
                          dragSettings={{
                            dragData,
                            dragProps: {
                              ref: dragData.ref,
                              style: storeEditList.draggedItem ? transformStyle(dragData.transform) : {},
                            },
                            dragState: useDragDropContext()?.[0] || null,
                          }}
                          placeholder={item.auto ? "Добавить пункт списка" : "Пункт списка"}
                        >
                          {item.content}
                        </ListItem>
                      );
                    } else {
                      return (
                        <ImportedGroup
                          testId={DEFAULT_TEST_ID}
                          id={item.originalListId}
                          dragSettings={{
                            dragData,
                            dragProps: {
                              ref: dragData.ref,
                              style: storeEditList.draggedItem ? transformStyle(dragData.transform) : {},
                            },
                            dragState: useDragDropContext()?.[0] || null,
                          }}
                        >
                          {[item]}
                        </ImportedGroup>
                      );
                    }
                  }}
                </For>
              </SortableProvider>
              <DragOverlay>
                <ListItem
                  checkable={storeEditList.isCheckable}
                  checked={false}
                  dataId={draggedItemData().dragId}
                  canAddMore={!reachedItemsLimit()}
                  testId={DRAGGED_LIST_ITEM}
                  isDraggingOverlay={true}
                  placeholder={draggedItemData().auto ? "Добавить пункт списка" : "Пункт списка"}
                >
                  {draggedItemData().content}
                </ListItem>
              </DragOverlay>
            </DragDropProvider>
          </div>

          <Show when={storeEditList.error || reachedItemsLimit() || storeEditList.removeError}>
            <div class="editList__errors">
              <Show when={storeEditList.error}>
                <PageError testId={NETWORK_ERROR}>Ошибка соединения с сервером, попробуйте еще раз</PageError>
              </Show>
              <Show when={reachedItemsLimit()}>
                <PageError testId={ITEMS_LIMIT_REACHED_WARNING}>
                  Вы использовали лимит в {ITEMS_LIMIT} пунктов
                </PageError>
              </Show>
              <Show when={storeEditList.removeError}>
                <PageError testId={LIST_REMOVAL_ERROR}>Не удалось удалить список. Попробуйте ещё раз.</PageError>
              </Show>
            </div>
          </Show>

          <div class="editList__controls">
            <Button
              type={ButtonType.Submit}
              disabled={!storeEditList.isChanged || storeEditList.sendingNow === "deleting"}
              loading={storeEditList.sendingNow === "saving"}
              testId={SAVE_LIST_BUTTON}
            >
              Сохранить
            </Button>
          </div>
        </form>
      </div>
      <EditListToolsPanel />
    </div>
  );
};
