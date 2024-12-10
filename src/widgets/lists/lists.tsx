import { type Component, For, mergeProps, Show } from "solid-js";
import "./lists.css";
import {
  ListStripe,
  ListStripeSize,
  ListStripeTheme,
} from "../../components/listStripe/listStripe";
import {
  Button,
  ButtonComponentType,
  ButtonSize,
  ButtonTheme,
} from "../../components/button/button.tsx";
import {
  CREATE_LIST_BUTTON,
  LIST_REMOVAL_ERROR,
  LISTS_LIMIT_REACHED_WARNING,
  NETWORK_ERROR,
  NO_SAVED_LISTS_MESSAGE,
} from "../../../features/testIds.ts";
import {
  PageError,
  PageErrorSize,
  PageErrorTheme,
} from "../../components/pageError/pageError.tsx";
import { createStore } from "solid-js/store";
import { LISTS_LIMIT } from "../../../configuration.ts";

type ListsProps = {
  defaultLists: Array<{ name: string; id: string; purpose: string }>;
  listsRequestError: boolean;
};

export const Lists: Component<ListsProps> = (props) => {
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
  }

  function removingListInStore(listIdToRemove: string) {
    setStore("lists", (lists) =>
      lists.filter((item) => item.id !== listIdToRemove),
    );
  }

  return (
    <div slot="mainContent" class="lists">
      <Show when={store.lists.length === 0 && !mProps.listsRequestError}>
        <span class="lists__emptyWarning" data-test-id={NO_SAVED_LISTS_MESSAGE}>
          У вас еще нет сохраненных списков
        </span>
      </Show>
      <Show when={checkListsLimitReached()}>
        <PageError
          size={PageErrorSize.Medium}
          theme={PageErrorTheme.Dangerous}
          testId={LISTS_LIMIT_REACHED_WARNING}
        >
          Вы использовали лимит в {LISTS_LIMIT} списков
        </PageError>
      </Show>
      <Show when={store.removeError}>
        <PageError
          size={PageErrorSize.Medium}
          theme={PageErrorTheme.Dangerous}
          testId={LIST_REMOVAL_ERROR}
        >
          Не удалось удалить список. Попробуйте ещё раз.
        </PageError>
      </Show>

      <Show
        when={!mProps.listsRequestError}
        fallback={
          <PageError
            size={PageErrorSize.Medium}
            theme={PageErrorTheme.Dangerous}
            testId={NETWORK_ERROR}
          >
            Произошла ошибка соединения с сервером, попробуйте еще раз
          </PageError>
        }
      >
        <ul class="lists__list">
          <For each={store.lists.slice().reverse()}>
            {(list) => (
              <li class="lists__item">
                <ListStripe
                  defaultListId={list.id}
                  theme={ListStripeTheme.Primary}
                  size={ListStripeSize.Medium}
                  link={`./${list.id}`}
                  editLink={`./${list.id}/edit`}
                  listTitle={list.name}
                  listPurpose={list.purpose}
                  staticOnRemoveSuccess={removingListInStore}
                  staticOnRemoveError={setRemoveError}
                />
              </li>
            )}
          </For>
        </ul>
      </Show>

      <div class="lists__new">
        <Button
          componentType={ButtonComponentType.Link}
          link={"/lists/create"}
          text="Создать"
          size={ButtonSize.Medium}
          theme={ButtonTheme.Primary}
          testId={CREATE_LIST_BUTTON}
          isDisabled={checkListsLimitReached()}
        />
      </div>
    </div>
  );
};
