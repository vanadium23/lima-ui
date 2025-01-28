import { type Component, type JSX, mergeProps } from "solid-js";
import "./pageError.css";
import type { Testable } from "../utilities/testable.ts";

export enum PageErrorTheme {
  Dangerous = "dangerous",
}

export enum PageErrorSize {
  Medium = "medium",
}

type PageErrorProps = {
  theme?: PageErrorTheme;
  size?: PageErrorSize;
  children: JSX.Element;
};

export const PageError: Component<Testable<PageErrorProps>> = (props) => {
  const mProps: Testable<Required<PageErrorProps>> = mergeProps(
    {
      theme: PageErrorTheme.Dangerous,
      size: PageErrorSize.Medium,
    },
    props,
  );

  return (
    <div
      class={`pageError pageError_${mProps.theme} pageError_${mProps.size}`}
      data-test-id={mProps.testId}
    >
      {mProps.children}
    </div>
  );
};
