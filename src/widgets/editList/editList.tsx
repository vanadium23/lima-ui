import {
  createSortable,
  DragDropProvider,
  DragDropSensors,
  DragOverlay,
  SortableProvider,
  transformStyle,
  useDragDropContext,
} from "@thisbeyond/solid-dnd";
import { createEffect, For, Match, mergeProps, onCleanup, onMount, Show, Switch } from "solid-js";

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
import { type ListFromBackend } from "../../types/types.ts";

import { EditListHeader } from "./components/editListHeader/editListHeader.tsx";
import EditListToolsPanel from "./components/editListToolsPanel/editListToolsPanel.tsx";
import { emptyListFromBackend, initStoreEditList, setStoreEditList, storeEditList } from "./editList.store.tsx";
import { addAutoItem } from "./utilities/addAutoItem.ts";
import { checkChanges } from "./utilities/checkChanges.ts";
import {
  createScrollableCollisionsDetector,
  draggedItemData as draggedElementData,
  dragIds,
  onDragEnd,
  onDragStart,
} from "./utilities/dragAndDrop.ts";
import { prepareAndSendListData } from "./utilities/prepareAndSendListData.ts";
import { reachedItemsLimit } from "./utilities/reachedItemsLimit.ts";
import { scroller } from "./utilities/scrollToBottom.ts";
import "./editList.css";

type EditListProps = {
  defaultList?: ListFromBackend;
  requestError?: boolean;
  errorText?: string;
  isListsLimitReached?: boolean;
};

export const EditList = (props: EditListProps) => {
  const mProps: Required<EditListProps> = mergeProps(
    {
      defaultList: emptyListFromBackend,
      requestError: false,
      errorText: "",
      isListsLimitReached: false,
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

    checkChanges(storeEditList.name, storeEditList.purpose, storeEditList.note, storeEditList.elements);
  });

  createEffect(() => {
    const lastItem = storeEditList.elements.at(-1);

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
    <Switch>
      <Match when={mProps.isListsLimitReached}>
        <div>Лимит списков превышен</div>
      </Match>
      <Match when={!mProps.requestError}>
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
                    <For each={storeEditList.elements.slice(0, ITEMS_LIMIT)}>
                      {(element, index) => {
                        const dragData = createSortable(element.dragId);

                        if (element.isImported) {
                          return (
                            <ImportedGroup
                              testId={DEFAULT_TEST_ID}
                              index={index()}
                              id={element.originalList.id}
                              name={element.originalList.name}
                              dragSettings={{
                                dragData,
                                dragProps: {
                                  ref: dragData.ref,
                                  style: storeEditList.draggedItem ? transformStyle(dragData.transform) : {},
                                },
                                dragState: useDragDropContext()?.[0] || null,
                              }}
                            >
                              {element.items}
                            </ImportedGroup>
                          );
                        } else {
                          return (
                            <ListItem
                              index={index()}
                              auto={element.auto}
                              exportedTo={element.exportedTo}
                              dragSettings={{
                                dragData,
                                dragProps: {
                                  ref: dragData.ref,
                                  style: storeEditList.draggedItem ? transformStyle(dragData.transform) : {},
                                },
                                dragState: useDragDropContext()?.[0] || null,
                              }}
                            >
                              {element.items[0].content}
                            </ListItem>
                          );
                        }
                      }}
                    </For>
                  </SortableProvider>
                  <DragOverlay>
                    <Switch>
                      <Match when={draggedElementData().originalList.id === storeEditList.id}>
                        <ListItem index={ITEMS_LIMIT + 1} auto={draggedElementData().auto} isDraggingOverlay={true}>
                          {draggedElementData().items[0].content}
                        </ListItem>
                      </Match>
                      <Match when={draggedElementData().originalList.id !== storeEditList.id}>
                        <ImportedGroup
                          testId={DEFAULT_TEST_ID}
                          index={ITEMS_LIMIT + 1}
                          id={draggedElementData().originalList.id}
                          name={draggedElementData().originalList.name}
                          isDraggingOverlay={true}
                        >
                          {draggedElementData().items}
                        </ImportedGroup>
                      </Match>
                    </Switch>
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
      </Match>
    </Switch>
  );
};
