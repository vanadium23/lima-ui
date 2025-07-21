import { Match, mergeProps, Switch } from "solid-js";

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
  link: string;
  text: string;
  isDisabled?: boolean;
};

export const Link = (props: Testable<LinkProps>) => {
  const mProps: Testable<Required<LinkProps>> = mergeProps(
    {
      theme: LinkTheme.Primary,
      size: LinkSize.Medium,
      isDisabled: false,
    },
    props,
  );

  return (
    <Switch>
      <Match when={!mProps.isDisabled}>
        <a
          href={mProps.link}
          class={`link link_${mProps.theme} link_${mProps.size}`}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          {mProps.text}
        </a>
      </Match>
      <Match when={mProps.isDisabled}>
        <span
          class={`link link_${mProps.theme} link_${mProps.size} link_disabled`}
          aria-disabled={mProps.isDisabled}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          {mProps.text}
        </span>
      </Match>
    </Switch>
  );
};
