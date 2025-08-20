import { For, mergeProps, Show } from "solid-js";

import {
  SEARCH_DIALOG_EMPTY,
  SEARCH_DIALOG_LOADING,
  SEARCH_RESULT,
  SEARCH_RESULTS,
} from "../../../features/testIds.ts";
import { pluralizeRu } from "../../../utilities/pluralizeRussianWords.ts";
import type { DropdownListType } from "../../widgets/editList/types.ts";
import { DropdownListItem } from "../dropdownListItem/dropdownListItem.tsx";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";

import "./quickSearch.css";

export enum QuickSearchTheme {
  Primary = "primary",
}

export enum QuickSearchSize {
  Medium = "medium",
}

export type QuickSearchProps = {
  theme?: QuickSearchTheme;
  size?: QuickSearchSize;
  lists?: DropdownListType[];
  isLoading: boolean;
  query: string;
};

export const QuickSearch = (props: QuickSearchProps) => {
  const mProps: Required<QuickSearchProps> = mergeProps(
    {
      theme: QuickSearchTheme.Primary,
      size: QuickSearchSize.Medium,
      lists: [],
    },
    props,
  );

  function getResultPhrase() {
    const firstWord = pluralizeRu(mProps.lists.length, [
      "Найден",
      "Найдено",
      "Найдено",
    ]);
    const secondWord = pluralizeRu(mProps.lists.length, [
      "результат",
      "результата",
      "результатов",
    ]);

    return `${firstWord} ${mProps.lists.length} ${secondWord}`;
  }

  return (
    <div
      class={`quickSearch quickSearch_${props.theme} quickSearch_${mProps.size}`}
      tabIndex={-1}
      /* Tabindex чтобы сделать элемент псевдофокусабельными для фикса focus-within */
    >
      <Show
        when={!mProps.isLoading}
        fallback={
          <div class="quickSearch__loader" data-test-id={SEARCH_DIALOG_LOADING}>
            <Icon name={IconName.CircleNotch} size={IconSize.Large} />
          </div>
        }
      >
        <Show
          when={mProps.lists.length}
          fallback={
            <span
              class="quickSearch__empty"
              data-test-id={SEARCH_DIALOG_EMPTY}
            >{`По запросу «${mProps.query}» ничего не найдено`}</span>
          }
        >
          <div class="quickSearch__results">
            <ul
              class="quickSearch__list scrollStyles"
              data-test-id={SEARCH_RESULTS}
            >
              <For each={mProps.lists}>
                {(list, index) => {
                  return (
                    <DropdownListItem
                      text={list.name}
                      listId={list.id}
                      testId={SEARCH_RESULT}
                      testSubId={index()}
                    />
                  );
                }}
              </For>
            </ul>
          </div>
        </Show>

        <Show when={mProps.lists.length}>
          <span class="quickSearch__totalResults">{getResultPhrase()}</span>
        </Show>
      </Show>
    </div>
  );
};
