import { Match, mergeProps, Switch } from "solid-js";

import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";
import type { Testable } from "../utilities/testable.ts";

import "./checkbox.css";

export enum CheckboxTheme {
  Primary = "primary",
}

export enum CheckboxSize {
  Small = "small",
  Medium = "medium",
}

type CheckboxProps = {
  theme?: CheckboxTheme;
  size?: CheckboxSize;
  isDisabled?: boolean;
  ariaLabel?: string;
  handleClick?: () => void;
  isChecked?: boolean;
  independent?: boolean;
};

export const Checkbox = (props: Testable<CheckboxProps>) => {
  const mProps: Testable<Required<CheckboxProps>> = mergeProps(
    {
      theme: CheckboxTheme.Primary,
      size: CheckboxSize.Medium,
      isDisabled: false,
      ariaLabel: "",
      handleClick: () => {},
      isChecked: false,
      independent: true,
    },
    props,
  );

  const iconSize = {
    [CheckboxSize.Small]: IconSize.ExtraSmall,
    [CheckboxSize.Medium]: IconSize.Medium,
  };

  return (
    <Switch>
      <Match when={mProps.independent}>
        <label
          class={`checkbox checkbox_${mProps.theme} checkbox_${mProps.size}`}
          classList={{
            checkbox_disabled: mProps.isDisabled,
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <input
            type="checkbox"
            class="checkbox__input"
            disabled={mProps.isDisabled}
            checked={mProps.isChecked}
            onClick={() => {
              mProps.handleClick();
            }}
            {...prepareARIALabel(mProps.ariaLabel)}
          />

          <span class="checkbox__inner">
            <span class="checkbox__icon">
              <Icon name={IconName.Check} size={iconSize[mProps.size]} />
            </span>
          </span>
        </label>
      </Match>
      <Match when={!mProps.independent}>
        <span
          class={`checkbox checkbox_${mProps.theme} checkbox_${mProps.size} checkbox_independent`}
          classList={{
            checkbox_disabled: mProps.isDisabled,
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <input
            type="checkbox"
            class="checkbox__input"
            disabled={mProps.isDisabled}
            checked={mProps.isChecked}
            onClick={() => {
              mProps.handleClick();
            }}
            {...prepareARIALabel(mProps.ariaLabel)}
          />

          <span class="checkbox__inner">
            <span class="checkbox__icon">
              <Icon name={IconName.Check} size={iconSize[mProps.size]} />
            </span>
          </span>
        </span>
      </Match>
    </Switch>
  );
};
