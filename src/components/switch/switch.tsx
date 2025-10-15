import { mergeProps, Show } from "solid-js";

import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";
import type { Testable } from "../utilities/testable.ts";

import "./switch.css";

export enum SwitchTheme {
  Primary = "primary",
}

export enum SwitchSize {
  Medium = "medium",
}

type SwitchProps = {
  theme?: SwitchTheme;
  size?: SwitchSize;
  disabled?: boolean;
  ariaLabel?: string;
  children?: string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
};

export const Switch = (props: Testable<SwitchProps>) => {
  const mProps: Testable<Required<SwitchProps>> = mergeProps(
    {
      theme: SwitchTheme.Primary,
      size: SwitchSize.Medium,
      disabled: false,
      ariaLabel: "",
      onChange: () => {},
      checked: false,
      children: "",
    },
    props,
  );

  return (
    <label
      class="switch"
      classList={{
        [`switch_${mProps.size}`]: true,
        [`switch_${mProps.theme}`]: !mProps.disabled,
        switch_disabled: mProps.disabled,
      }}
      data-test-id={mProps.testId}
    >
      <input
        type="checkbox"
        class="switch__input"
        disabled={mProps.disabled}
        checked={mProps.checked}
        onChange={(e) => {
          mProps.onChange(e.currentTarget.checked);
        }}
        {...prepareARIALabel(mProps.ariaLabel)}
      />
      <span class="switch__inner" />
      <Show when={mProps.children}>
        <span class="switch__text">{mProps.children}</span>
      </Show>
    </label>
  );
};
