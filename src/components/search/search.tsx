import { mergeProps, Show } from "solid-js";

import { LIST_TITLE_INPUT_LIMIT } from "../../../configuration.ts";
import {
  CLOSE_SEARCH_BUTTON,
  SEARCH_BUTTON,
  SEARCH_DIALOG,
  SEARCH_INPUT,
} from "../../../features/testIds.ts";
import { LISTS } from "../../../utilities/addresses.ts";
import { location } from "../../state/locationState.ts";
import { searchState } from "../../state/searchState.ts";
import { IconName } from "../icon/icon.tsx";
import { IconButton, IconButtonTheme } from "../iconButton/iconButton.tsx";
import { Input, InputTheme } from "../input/input.tsx";
import { QuickSearch } from "../quickSearch/quickSearch.tsx";

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

export const Search = (props: SearchProps) => {
  const mProps: Required<SearchProps> = mergeProps(
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
          maxLength={LIST_TITLE_INPUT_LIMIT}
          testId={SEARCH_INPUT}
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
            testId={CLOSE_SEARCH_BUTTON}
            theme={IconButtonTheme.Tertiary}
            handleClick={searchState.close}
          />
        </div>
      </div>

      <Show when={location() !== LISTS}>
        <div class="search__dialog" data-test-id={SEARCH_DIALOG}>
          <QuickSearch query={""} isLoading={false} />
        </div>
      </Show>
    </div>
  );
};
