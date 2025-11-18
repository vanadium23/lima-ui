import {
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  transformStyle,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { createEffect, For, mergeProps, onCleanup, onMount, Show } from "solid-js";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import {
  DEFAULT_TEST_ID,
  ITEMS_LIMIT_REACHED_WARNING,
  LIST_ITEMS,
  LIST_REMOVAL_ERROR,
  NETWORK_ERROR,
  SAVE_LIST_BUTTON,
} from "../../../features/testIds.ts";
import { Button, ButtonType } from "../../components/button/button.tsx";
import { ImportedGroup } from "../../components/importedGroup/importedGroup.tsx";
import { ListItem } from "../../components/listItem/listItem.tsx";
import { PageError } from "../../components/pageError/pageError.tsx";
import { notificationState } from "../../state/pushNotificationStateManager.ts";
import { type List } from "../../types/types.ts";

import { EditListHeader } from "./components/editListHeader/editListHeader.tsx";
import EditListToolsPanel from "./components/editListToolsPanel/editListToolsPanel.tsx";
import { emptyList, initStoreEditList, setStoreEditList, storeEditList } from "./editList.store.tsx";
import { addAutoItem } from "./utilities/addAutoItem.ts";
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
import { scroller } from "./utilities/scrollToBottom.ts";
import "./editList.css";

type EditListProps = {
  defaultList?: List;
  requestError?: boolean;
  errorText?: string;
};

export const EditList = (props: EditListProps) => {
  const mProps: Required<EditListProps> = mergeProps(
    {
      defaultList: emptyList,
      requestError: false,
      errorText: "",
    },
    props,
  );

  initStoreEditList(mProps.defaultList);

  createEffect(() => {
    if (storeEditList.error) {
      notificationState.pushNetworkError(
        "Ошибка соединения",
        "Ошибка соединения с сервером, попробуйте еще раз",
        NETWORK_ERROR,
      );
      setStoreEditList("error", false);
    }

    if (storeEditList.removeError) {
      notificationState.pushNetworkError(
        "Ошибка удаления",
        "Не удалось удалить список. Попробуйте ещё раз",
        LIST_REMOVAL_ERROR,
      );
      setStoreEditList("removeError", false);
    }

    checkChanges(storeEditList.name, storeEditList.purpose, storeEditList.note, storeEditList.items);
  });

  createEffect(() => {
    const lastItem = storeEditList.items.at(-1);

    if (lastItem) {
      addAutoItem();
    }
  });

  onMount(() => {
    if (mProps.requestError) {
      notificationState.pushNetworkError("Ошибка соединения", mProps.errorText, NETWORK_ERROR);
    }

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

  return (
    <Show when={!mProps.requestError}>
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
                  <For each={storeEditList.items.slice(0, ITEMS_LIMIT)}>
                    {(item, index) => {
                      const dragData = createSortable(item.dragId);

                      if (item.originalList.id === storeEditList.id) {
                        return (
                          <ListItem
                            index={index()}
                            dataId={item.id}
                            auto={item.auto}
                            dragSettings={{
                              dragData,
                              dragProps: {
                                ref: dragData.ref,
                                style: storeEditList.draggedItem ? transformStyle(dragData.transform) : {},
                              },
                              dragState: useDragDropContext()?.[0] || null,
                            }}
                          >
                            {item.content}
                          </ListItem>
                        );
                      } else {
                        return (
                          <ImportedGroup
                            testId={DEFAULT_TEST_ID}
                            itemIndex={index()}
                            id={item.originalList.id}
                            name={item.originalList.name}
                            disabled={Boolean(storeEditList.sendingNow)}
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
                    index={ITEMS_LIMIT + 1}
                    auto={draggedItemData().auto}
                    dataId={draggedItemData().dragId}
                    isDraggingOverlay={true}
                  >
                    {draggedItemData().content}
                  </ListItem>
                </DragOverlay>
              </DragDropProvider>
            </div>

            <Show when={storeEditList.error || reachedItemsLimit() || storeEditList.removeError}>
              <div class="editList__errors">
                <Show when={reachedItemsLimit()}>
                  <PageError testId={ITEMS_LIMIT_REACHED_WARNING}>
                    Вы использовали лимит в {ITEMS_LIMIT} пунктов
                  </PageError>
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
    </Show>
  );
};
