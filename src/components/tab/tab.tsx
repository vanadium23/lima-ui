import { mergeProps } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./tab.css";

export enum TabTheme {
  Primary = "primary",
}

export enum TabSize {
  Medium = "medium",
}

type TabProps = {
  theme?: TabTheme;
  size?: TabSize;
  children: string;
  handleClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
};

export const Tab = (props: Testable<TabProps>) => {
  const mProps: Testable<Required<TabProps>> = mergeProps(
    {
      theme: TabTheme.Primary,
      size: TabSize.Medium,
      disabled: false,
      selected: false,
      handleClick: () => {},
    },
    props,
  );

  return (
    <button
      type="button"
      role="tab"
      class="tab"
      classList={{
        [`tab_${mProps.size}`]: true,
        [`tab_${mProps.theme}`]: !mProps.disabled,
        tab_disabled: mProps.disabled,
        tab_selected: mProps.selected,
      }}
      aria-selected={mProps.selected}
      disabled={mProps.disabled}
      onClick={() => {
        mProps.handleClick();
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      {mProps.children}
    </button>
  );
};
