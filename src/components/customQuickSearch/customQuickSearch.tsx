import { For, mergeProps, Show } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import { SearchItem } from "../searchItem/searchItem.tsx";
import {
  TextButton,
  TextButtonComponentType,
} from "../textButton/textButton.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./customQuickSearch.css";

export enum CustomQuickSearchTheme {
  Primary = "primary",
}

export enum CustomQuickSearchSize {
  Medium = "medium",
}

type SearchList = {
  name: string;
  link: string;
};

export type CustomQuickSearchProps = {
  theme?: CustomQuickSearchTheme;
  size?: CustomQuickSearchSize;
  lists?: SearchList[];
  isLoading: boolean;
  query: string;
};

export const CustomQuickSearch = (props: Testable<CustomQuickSearchProps>) => {
  const mProps: Testable<Required<CustomQuickSearchProps>> = mergeProps(
    {
      theme: CustomQuickSearchTheme.Primary,
      size: CustomQuickSearchSize.Medium,
      query: "Тест",
      lists: [],
    },
    props,
  );

  function getResultWord(num: number): string {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return `Найдено ${num} результатов. Смотреть все`;
    }

    if (lastDigit === 1) {
      return `Найден ${num} результат. Смотреть все`;
    } else if (lastDigit >= 2 && lastDigit <= 4) {
      return `Найдено ${num} результата. Смотреть все`;
    } else {
      return `Найдено ${num} результатов. Смотреть все`;
    }
  }

  return (
    <div
      class={`quickSearch quickSearch_${props.theme} quickSearch__${mProps.size}`}
    >
      <Show
        when={!mProps.isLoading}
        fallback={
          <div class="quickSearch__loader">
            <Icon name={IconName.CircleNotch} size={IconSize.Large} />
          </div>
        }
      >
        <Show
          when={mProps.lists.length}
          fallback={
            <span class="quickSearch__empty">{`По запросу «${mProps.query}» ничего не найдено`}</span>
          }
        >
          <div class="quickSearch__results">
            <ul class="quickSearch__list scrollStyles">
              <For each={mProps.lists}>
                {(list) => {
                  return (
                    <SearchItem
                      text={list.name}
                      link={list.link}
                      testId={DEFAULT_TEST_ID}
                    />
                  );
                }}
              </For>
            </ul>
          </div>
        </Show>

        <Show when={mProps.lists.length}>
          <TextButton
            componentType={TextButtonComponentType.Link}
            link={`/lists/?search=${encodeURIComponent(mProps.query)}`}
            text={`${getResultWord(mProps.lists.length)}`}
            testId={DEFAULT_TEST_ID}
          />
        </Show>
      </Show>
    </div>
  );
};
