import { type JSX, mergeProps } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./title.css";

export enum TitleTheme {
  Primary = "primary",
}

export enum TitleSize {
  Medium = "medium",
}

export enum TitlePosition {
  Left = "left",
  Center = "center",
}

type TitleProps = {
  theme?: TitleTheme;
  size?: TitleSize;
  position?: TitlePosition;
  children: JSX.Element;
};

export const Title = (props: Testable<TitleProps>) => {
  const mProps: Testable<Required<TitleProps>> = mergeProps(
    {
      theme: TitleTheme.Primary,
      size: TitleSize.Medium,
      position: TitlePosition.Left,
    },
    props,
  );

  return (
    <h1
      class={`title title_${mProps.theme} title_${mProps.size} title_${mProps.position}`}
      data-test-id={mProps.testId}
    >
      {mProps.children}
    </h1>
  );
};
