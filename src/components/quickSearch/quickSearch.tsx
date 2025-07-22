import { For, mergeProps, Show } from "solid-js";

import {
  SEARCH_DIALOG_EMPTY,
  SEARCH_DIALOG_LOADING,
  SEARCH_RESULT,
} from "../../../features/testIds.ts";
import type { SearchList } from "../../widgets/editList/types.ts";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import { SearchItem } from "../searchItem/searchItem.tsx";

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
  lists?: SearchList[];
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

  function getResultWord(num: number): string {
    const lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `Найдено ${num} результатов`;
    }

    const lastDigit = num % 10;

    if (lastDigit === 1) {
      return `Найден ${num} результат`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `Найдено ${num} результата`;
    } else {
      return `Найдено ${num} результатов`;
    }
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
            <ul class="quickSearch__list scrollStyles">
              <For each={mProps.lists}>
                {(list, index) => {
                  return (
                    <SearchItem
                      text={list.name}
                      link={list.id}
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
          <span class="quickSearch__totalResults">
            {getResultWord(mProps.lists.length)}
          </span>
        </Show>
      </Show>
    </div>
  );
};
