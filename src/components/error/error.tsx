import { type JSX, mergeProps } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./error.css";

export enum ErrorTheme {
  Dangerous = "dangerous",
}

export enum ErrorSize {
  Medium = "medium",
}

type ErrorProps = {
  theme?: ErrorTheme;
  size?: ErrorSize;
  children: JSX.Element;
};

export const Error = (props: Testable<ErrorProps>) => {
  const mProps: Testable<Required<ErrorProps>> = mergeProps(
    {
      theme: ErrorTheme.Dangerous,
      size: ErrorSize.Medium,
    },
    props,
  );

  return (
    <div
      class="error"
      classList={{
        [`error_${mProps.size}`]: true,
        [`error_${mProps.theme}`]: true,
      }}
      data-test-id={mProps.testId}
    >
      {mProps.children}
    </div>
  );
};
