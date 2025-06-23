import { mergeProps, onCleanup, Show } from "solid-js";
import { createStore } from "solid-js/store";

import {
  LIST_TITLE_INPUT_LIMIT,
  LISTS_SEARCH_MINIMAL_QUERY,
} from "../../../configuration.ts";
import {
  CLOSE_SEARCH_BUTTON,
  SEARCH_BUTTON,
  SEARCH_DIALOG,
  SEARCH_INPUT,
} from "../../../features/testIds.ts";
import { IconName } from "../../components/icon/icon.tsx";
import {
  IconButton,
  IconButtonTheme,
  IconButtonType,
} from "../../components/iconButton/iconButton.tsx";
import { Input, InputTheme } from "../../components/input/input.tsx";
import { QuickSearch } from "../../components/quickSearch/quickSearch.tsx";
import { searchState } from "../../state/searchState.ts";
import type { SearchList } from "../editList/types.ts";

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

type SearchState = {
  query: string;
  isLoading: boolean;
  lastSubmitted: string;
  results: SearchList[];
};

export const Search = (props: SearchProps) => {
  const mProps: Required<SearchProps> = mergeProps(
    { theme: SearchTheme.Primary, size: SearchSize.Medium },
    props,
  );

  const [state, setState] = createStore<SearchState>({
    query: "",
    isLoading: false,
    lastSubmitted: "",
    results: [],
  });

  let debounceTimer: ReturnType<typeof setTimeout>;
  let abortController: AbortController | null = null;

  const executeSearch = async (
    query: string,
    forceSubmit = false,
    backendURL?: string,
  ) => {
    if (!forceSubmit && query === state.lastSubmitted) return;

    if (abortController) {
      abortController.abort();
    }

    abortController = new AbortController();

    setState({
      query: query,
      lastSubmitted: query,
      isLoading: true,
    });

    try {
      let backend: string;

      if (backendURL) {
        backend = backendURL;
      } else {
        backend = import.meta.env.PUBLIC_API_URL;
      }

      const response = await fetch(`${backend}/search/lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
        signal: abortController.signal,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      setState("results", await response.json());
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
    } finally {
      setState("isLoading", false);
      abortController = null;
    }
  };

  const handleInput = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    setState("query", value);
    clearTimeout(debounceTimer);

    if (value.length >= LISTS_SEARCH_MINIMAL_QUERY) {
      setState("isLoading", true);
      debounceTimer = setTimeout(() => executeSearch(value), 350);
    } else {
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      setState({
        isLoading: false,
        query: "",
        lastSubmitted: "",
        results: [],
      });
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (state.query.length >= LISTS_SEARCH_MINIMAL_QUERY)
      executeSearch(state.query, true);
  };

  onCleanup(() => {
    clearTimeout(debounceTimer);

    if (abortController) {
      abortController.abort();
    }
  });

  return (
    <div
      class={`search search_${mProps.theme} search_${mProps.size}`}
      classList={{
        search_hidden: !searchState.isOpen(),
      }}
    >
      <form class="search__wrapper" onSubmit={handleSubmit}>
        <Input
          theme={InputTheme.Tertiary}
          placeholder={"Поиск..."}
          name={"Поиск"}
          isCountable={false}
          maxLength={LIST_TITLE_INPUT_LIMIT}
          testId={SEARCH_INPUT}
          onInput={handleInput}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <IconButton
          type={IconButtonType.Submit}
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
      </form>

      <Show when={state.query.length >= LISTS_SEARCH_MINIMAL_QUERY}>
        <div class="search__dialog" data-test-id={SEARCH_DIALOG}>
          <QuickSearch
            query={state.query}
            isLoading={state.isLoading}
            lists={state.results}
          />
        </div>
      </Show>
    </div>
  );
};
