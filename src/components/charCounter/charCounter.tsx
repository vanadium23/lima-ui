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
  value: number;
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
      class={`charCounter charCounter_${mProps.theme} charCounter_${mProps.size}`}
      data-test-id={buildInputCounterTestId(props.testId)}
      data-test-sub-id={props.testSubId}
    >
      {props.value}
    </span>
  );
};
