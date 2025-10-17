import { For, mergeProps, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { LISTS_LIMIT } from "../../../configuration.ts";
import {
  CREATE_LIST_BUTTON,
  LIST_REMOVAL_ERROR,
  LIST_STRIPE,
  LISTS_LIMIT_REACHED_WARNING,
  NETWORK_ERROR,
  NO_SAVED_LISTS_MESSAGE,
  PAGE_TITLE,
} from "../../../features/testIds.ts";
import { getListLink, URL_CREATE_LIST } from "../../../utilities/addresses.ts";
import { Button, ButtonComponentType } from "../../components/button/button.tsx";
import { ListStripe } from "../../components/listStripe/listStripe.tsx";
import { PageError } from "../../components/pageError/pageError.tsx";
import { Title } from "../../components/title/title.tsx";
import { notificationState } from "../../state/pushNotificationStateManager.ts";
import { isLimitReached, setIsLimitReached } from "../../state/reachListsLimit.ts";
import type { ListBase } from "../../types/types.ts";

import "./lists.css";

type ListsProps = {
  defaultLists: ListBase[];
  listsRequestError: boolean;
};

export const Lists = (props: ListsProps) => {
  const mProps: Required<ListsProps> = mergeProps(props);

  const [store, setStore] = createStore({
    lists: mProps.defaultLists,
    removeError: false,
  });

  function checkListsLimitReached() {
    return store.lists.length >= LISTS_LIMIT;
  }

  function setRemoveError(removeError: boolean) {
    setStore("removeError", removeError);
    notificationState.pushNetworkError(
      "Ошибка удаления",
      "Не удалось удалить список. Попробуйте ещё раз",
      LIST_REMOVAL_ERROR,
    );
  }

  function removingListInStore(listIdToRemove: string) {
    setStore("lists", (lists: ListBase[]) => lists.filter((item) => item.id !== listIdToRemove));
    setIsLimitReached(checkListsLimitReached());
  }

  onMount(() => {
    setIsLimitReached(checkListsLimitReached());
  });

  return (
    <div slot="mainContent" class="lists">
      <div class="lists__title">
        <Title testId={PAGE_TITLE}>Мои списки</Title>
      </div>
      <Show when={store.lists.length === 0 && !mProps.listsRequestError}>
        <span class="lists__emptyWarning" data-test-id={NO_SAVED_LISTS_MESSAGE}>
          У вас еще нет сохраненных списков
        </span>
      </Show>
      <Show
        when={!mProps.listsRequestError}
        fallback={
          <div class="lists__errors">
            <PageError testId={NETWORK_ERROR}>Произошла ошибка соединения с сервером, попробуйте еще раз</PageError>
          </div>
        }
      >
        <ul class="lists__list">
          <For each={store.lists.slice().reverse()}>
            {(list, index) => (
              <li class="lists__item">
                <ListStripe
                  listId={list.id}
                  link={getListLink(list.id)}
                  listTitle={list.name}
                  listPurpose={list.purpose}
                  onRemoveSuccess={removingListInStore}
                  onRemoveError={setRemoveError}
                  testId={LIST_STRIPE}
                  testSubId={index()}
                  exported={Boolean(list.exportedTo?.length)}
                />
              </li>
            )}
          </For>
        </ul>

        <div class="lists__errors">
          <Show when={isLimitReached()}>
            <PageError testId={LISTS_LIMIT_REACHED_WARNING}>Вы использовали лимит в {LISTS_LIMIT} списков</PageError>
          </Show>
        </div>

        <div class="lists__new">
          <Button
            componentType={ButtonComponentType.Link}
            href={URL_CREATE_LIST}
            testId={CREATE_LIST_BUTTON}
            disabled={checkListsLimitReached()}
          >
            Создать
          </Button>
        </div>
      </Show>
    </div>
  );
};
