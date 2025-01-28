import { type JSX, mergeProps } from "solid-js";
import "./title.css";
import type { Testable } from "../utilities/testable.ts";

export enum TitleTheme {
  Primary = "primary",
}

export enum TitleSize {
  Medium = "medium",
}

type TitleProps = {
  theme?: TitleTheme;
  size?: TitleSize;
  children: JSX.Element;
};

export const Title = (props: Testable<TitleProps>) => {
  const mProps: Testable<Required<TitleProps>> = mergeProps(
    {
      theme: TitleTheme.Primary,
      size: TitleSize.Medium,
    },
    props,
  );

  return (
    <h1
      class={`title title_${mProps.theme} title_${mProps.size}`}
      data-test-id={mProps.testId}
    >
      {mProps.children}
    </h1>
  );
};
