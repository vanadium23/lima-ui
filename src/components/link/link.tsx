import { mergeProps } from "solid-js";
import { Dynamic } from "solid-js/web";

import type { Testable } from "../utilities/testable.ts";

import "./link.css";

export enum LinkTheme {
  Primary = "primary",
}

export enum LinkSize {
  Small = "small",
  Medium = "medium",
}

type LinkProps = {
  theme?: LinkTheme;
  size?: LinkSize;
  href: string;
  children: string;
  disabled?: boolean;
};

export const Link = (props: Testable<LinkProps>) => {
  const mProps: Testable<Required<LinkProps>> = mergeProps(
    {
      theme: LinkTheme.Primary,
      size: LinkSize.Medium,
      disabled: false,
    },
    props,
  );

  return (
    <Dynamic
      component={mProps.disabled ? "span" : "a"}
      href={!mProps.disabled ? mProps.href : undefined}
      class={`link link_${mProps.disabled ? "disabled" : mProps.theme} link_${mProps.size}`}
      aria-disabled={mProps.disabled}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      {mProps.children}
    </Dynamic>
  );
};
