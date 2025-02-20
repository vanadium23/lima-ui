import { type JSX, mergeProps } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./pageError.css";

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

export const PageError = (props: Testable<PageErrorProps>) => {
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
