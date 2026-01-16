import { mergeProps } from "solid-js";

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
    <span
      class="hintErrorReplaceableText"
      classList={{
        hintErrorReplaceableText_error: mProps.isError,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {mProps.isError ? mProps.errorText : mProps.hintText}
    </span>
  );
};
