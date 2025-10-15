import { mergeProps } from "solid-js";

import { buildInputCounterTestId } from "../../../features/testIds.ts";
import type { Testable } from "../utilities/testable.ts";

import "./charCounter.css";

export enum CharCounterTheme {
  Primary = "primary",
}

export enum CharCounterSize {
  Medium = "medium",
}

type CharCounterProps = {
  theme?: CharCounterTheme;
  size?: CharCounterSize;
  children: number;
};

export const CharCounter = (props: Testable<CharCounterProps>) => {
  const mProps: Testable<Required<CharCounterProps>> = mergeProps(
    {
      theme: CharCounterTheme.Primary,
      size: CharCounterSize.Medium,
    },
    props,
  );

  return (
    <span
      class="charCounter"
      classList={{
        [`charCounter_${mProps.theme}`]: true,
        [`charCounter_${mProps.size}`]: true,
      }}
      data-test-id={buildInputCounterTestId(props.testId)}
      data-test-sub-id={props.testSubId}
    >
      {props.children}
    </span>
  );
};
