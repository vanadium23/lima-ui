import { Match, mergeProps, Switch } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./hintErrorReplaceableText.css";

export type HintErrorReplaceableTextProps = {
  hintText: string;
  errorText?: string | undefined;
  isError?: boolean;
};

export const HintErrorReplaceableText = (props: Testable<HintErrorReplaceableTextProps>) => {
  const mProps: Testable<Required<HintErrorReplaceableTextProps>> = mergeProps(
    {
      errorText: "",
      isError: false,
    },
    props,
  );

  return (
    <Switch>
      <Match when={!mProps.isError}>
        <span class="hintErrorReplaceableText__hint">{mProps.hintText}</span>
      </Match>
      <Match when={mProps.isError}>
        <span class="hintErrorReplaceableText__error" aria-live="polite" aria-atomic="true">
          {mProps.errorText}
        </span>
      </Match>
    </Switch>
  );
};
