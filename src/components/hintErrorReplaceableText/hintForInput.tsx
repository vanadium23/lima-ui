import { mergeProps } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./hintForInput.css";

export enum HintForInputTheme {
  Primary = "primary",
}

export enum HintForInputSize {
  Medium = "medium",
}

export type HintForInputProps = {
  theme?: HintForInputTheme;
  size?: HintForInputSize;
  hintText: string;
  errorText?: string | undefined;
  isError?: boolean;
};

export const HintForInput = (props: Testable<HintForInputProps>) => {
  const mProps: Testable<Required<HintForInputProps>> = mergeProps(
    {
      theme: HintForInputTheme.Primary,
      size: HintForInputSize.Medium,
      errorText: "",
      isError: false,
    },
    props,
  );

  return (
    <span
      class="hintForInput"
      classList={{
        [`hintForInput_${mProps.size}`]: true,
        [`hintForInput_${mProps.theme}`]: !mProps.isError,
        hintForInput_error: mProps.isError,
      }}
      aria-live="polite"
      aria-atomic="true"
    >
      {mProps.isError ? mProps.errorText : mProps.hintText}
    </span>
  );
};
