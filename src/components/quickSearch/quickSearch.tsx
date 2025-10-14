import { For, mergeProps, Show } from "solid-js";

import {
  SEARCH_DIALOG_EMPTY,
  SEARCH_DIALOG_LOADING,
  SEARCH_RESULT,
  SEARCH_RESULTS,
} from "../../../features/testIds.ts";
import { pluralizeRu } from "../../../utilities/pluralizeRussianWords.ts";
import type { SimpleList } from "../../types/types.ts";
import { DropdownListItem } from "../dropdownListItem/dropdownListItem.tsx";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";

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
  children?: SimpleList[];
  loading: boolean;
  query: string;
};

export const QuickSearch = (props: QuickSearchProps) => {
  const mProps: Required<QuickSearchProps> = mergeProps(
    {
      theme: QuickSearchTheme.Primary,
      size: QuickSearchSize.Medium,
      children: [],
    },
    props,
  );

  function getResultPhrase() {
    const firstWord = pluralizeRu(mProps.children.length, ["Найден", "Найдено", "Найдено"]);
    const secondWord = pluralizeRu(mProps.children.length, ["результат", "результата", "результатов"]);

    return `${firstWord} ${mProps.children.length} ${secondWord}`;
  }

  return (
    <div
      class="quickSearch"
      classList={{
        [`quickSearch_${mProps.size}`]: true,
        [`quickSearch_${mProps.theme}`]: true,
      }}
      tabIndex={-1}
      /* Tabindex чтобы сделать элемент псевдофокусабельными для фикса focus-within */
    >
      <Show
        when={!mProps.loading}
        fallback={
          <div class="quickSearch__loader" data-test-id={SEARCH_DIALOG_LOADING}>
            <Icon name={IconName.CircleNotch} size={IconSize.Large} />
          </div>
        }
      >
        <Show
          when={mProps.children.length}
          fallback={
            <span
              class="quickSearch__empty"
              data-test-id={SEARCH_DIALOG_EMPTY}
            >{`По запросу «${mProps.query}» ничего не найдено`}</span>
          }
        >
          <div class="quickSearch__results">
            <ul class="quickSearch__list scrollStyles" data-test-id={SEARCH_RESULTS}>
              <For each={mProps.children}>
                {(list, index) => {
                  return (
                    <DropdownListItem listId={list.id} testId={SEARCH_RESULT} testSubId={index()}>
                      {list.name}
                    </DropdownListItem>
                  );
                }}
              </For>
            </ul>
          </div>
        </Show>

        <Show when={mProps.children.length}>
          <span class="quickSearch__totalResults">{getResultPhrase()}</span>
        </Show>
      </Show>
    </div>
  );
};
