import { type Component, mergeProps } from "solid-js";
import "./checkbox.css";
import type { Testable } from "../utilities/testable.ts";
import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";

export enum CheckboxTheme {
  Primary = "primary",
}

export enum CheckboxSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type CheckboxProps = {
  isDisabled?: boolean;
  ariaLabel?: string;
  theme: CheckboxTheme;
  size: CheckboxSize;
  handleClick?: () => void;
  checked?: boolean;
};

export const Checkbox: Component<Testable<CheckboxProps>> = (props) => {
  const mProps: Testable<Required<CheckboxProps>> = mergeProps(
    {
      isDisabled: false,
      ariaLabel: "",
      handleClick: () => {},
      checked: false,
    },
    props,
  );

  const loadingIconSize = {
    [CheckboxSize.Small]: IconSize.Small,
    [CheckboxSize.Medium]: IconSize.Medium,
    [CheckboxSize.Large]: IconSize.Large,
  };

  return (
    <label
      class={`checkbox checkbox_${mProps.theme} checkbox_${mProps.size}`}
      classList={{
        checkbox_disabled: mProps.isDisabled,
      }}
      data-test-id={mProps.testId}
    >
      <input
        type="checkbox"
        class="checkbox__input"
        disabled={mProps.isDisabled}
        checked={mProps.checked}
        onClick={() => {
          mProps.handleClick();
        }}
        {...prepareARIALabel(mProps.ariaLabel)}
      />
      <span class="checkbox__inner">
        <span class="checkbox__icon">
          <Icon name={IconName.Check} size={loadingIconSize[mProps.size]} />
        </span>
      </span>
    </label>
  );
};
