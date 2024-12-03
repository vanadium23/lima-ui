import { type Component, mergeProps } from "solid-js";
import "./divider.css";
import type { Testable } from "../utilities/testable.ts";

export enum DividerTheme {
  Primary = "primary",
}

export enum DividerSize {
  Medium = "medium",
}

export enum DividerOrientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

type DividerProps = {
  orientation?: DividerOrientation;
  theme: DividerTheme;
  size: DividerSize;
};

export const Divider: Component<Testable<DividerProps>> = (props) => {
  const mProps: Testable<Required<DividerProps>> = mergeProps(
    {
      orientation: DividerOrientation.Horizontal,
    },
    props,
  );

  return (
    <hr
      role="separator"
      aria-orientation={mProps.orientation}
      class={`divider divider_${mProps.theme} divider_${mProps.size} divider_${mProps.orientation}`}
      data-test-id={mProps.testId}
    />
  );
};
