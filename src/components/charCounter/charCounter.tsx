import { type Component } from "solid-js";
import "./charCounter.css";
import type { Testable } from "../utilities/testable.ts";
import { buildInputCounterTestId } from "../../../features/testIds.ts";

export enum CharCounterTheme {
  Primary = "primary",
}

export enum CharCounterSize {
  ExtraSmall = "extraSmall",
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type CharCounterProps = {
  theme: CharCounterTheme;
  size: CharCounterSize;
  value: number;
};

export const CharCounter: Component<Testable<CharCounterProps>> = (props) => {
  return (
    <span
      class={`charCounter charCounter_${props.theme} charCounter_${props.size}`}
      data-test-id={buildInputCounterTestId(props.testId)}
      data-test-sub-id={props.testSubId}
    >
      {props.value}
    </span>
  );
};
