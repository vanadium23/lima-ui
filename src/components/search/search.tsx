import { mergeProps, Show } from "solid-js";

import { DEFAULT_TEST_ID, SEARCH_BUTTON } from "../../../features/testIds.ts";
import { LISTS } from "../../../utilities/addresses.ts";
import { location } from "../../state/locationState.ts";
import { searchState } from "../../state/searchState.ts";
import { CustomQuickSearch } from "../customQuickSearch/customQuickSearch.tsx";
import { IconName } from "../icon/icon.tsx";
import { IconButton, IconButtonTheme } from "../iconButton/iconButton.tsx";
import { Input, InputTheme } from "../input/input.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./search.css";

export enum SearchTheme {
  Primary = "primary",
}

export enum SearchSize {
  Medium = "medium",
}

type SearchProps = {
  theme?: SearchTheme;
  size?: SearchSize;
};

export const Search = (props: Testable<SearchProps>) => {
  const mProps: Testable<Required<SearchProps>> = mergeProps(
    {
      theme: SearchTheme.Primary,
      size: SearchSize.Medium,
    },
    props,
  );

  return (
    <div
      class={`search search_${mProps.theme} search_${mProps.size}`}
      classList={{
        search_hidden: !searchState.isOpen(),
      }}
    >
      <div class="search__wrapper">
        <Input
          theme={InputTheme.Tertiary}
          placeholder={"Поиск..."}
          name={"Поиск"}
          isCountable={false}
          maxLength={80}
          testId={DEFAULT_TEST_ID}
        />
        <IconButton
          iconName={IconName.MagnifyingGlass}
          ariaLabel={"Начать поиск"}
          testId={SEARCH_BUTTON}
          theme={IconButtonTheme.Tertiary}
        />
        <div class="search__mobileClose">
          <IconButton
            iconName={IconName.X}
            ariaLabel={"Закрыть поиск"}
            testId={SEARCH_BUTTON}
            theme={IconButtonTheme.Tertiary}
            handleClick={searchState.close}
          />
        </div>
      </div>

      <Show when={location() !== LISTS}>
        <div class="search__dialog">
          <CustomQuickSearch
            query={""}
            isLoading={false}
            testId={DEFAULT_TEST_ID}
          />
        </div>
      </Show>
    </div>
  );
};
