import { type Component, mergeProps, Show } from "solid-js";
import "./switch.css";
import type { Testable } from "../utilities/testable.ts";
import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";

export enum SwitchTheme {
  Primary = "primary",
}

export enum SwitchSize {
  Medium = "medium",
}

type SwitchProps = {
  isDisabled?: boolean;
  ariaLabel?: string;
  text?: string;
  theme: SwitchTheme;
  size: SwitchSize;
  handleClick?: () => void;
  isChecked?: boolean;
};

export const Switch: Component<Testable<SwitchProps>> = (props) => {
  const mProps: Testable<Required<SwitchProps>> = mergeProps(
    {
      isDisabled: false,
      ariaLabel: "",
      handleClick: () => {},
      isChecked: false,
      text: "",
    },
    props,
  );

  return (
    <label
      class={`switch switch_${mProps.theme} switch_${mProps.size}`}
      classList={{
        switch_disabled: mProps.isDisabled,
      }}
      data-test-id={mProps.testId}
    >
      <input
        type="checkbox"
        class="switch__input"
        disabled={mProps.isDisabled}
        checked={mProps.isChecked}
        onClick={() => {
          mProps.handleClick();
        }}
        {...prepareARIALabel(mProps.ariaLabel)}
      />
      <span class="switch__inner" />
      <Show when={mProps.text}>
        <span class="switch__text">{mProps.text}</span>
      </Show>
    </label>
  );
};
