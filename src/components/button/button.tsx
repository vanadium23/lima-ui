import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import "./button.css";
import type { Testable } from "../utilities/testable.ts";

export enum ButtonTheme {
  Primary = "primary",
  Secondary = "secondary",
  Successful = "successful",
  Dangerous = "dangerous",
}

export enum ButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type ButtonProps = {
  isDisabled?: boolean;
  ariaLabel?: string;
  text: string;
  theme: ButtonTheme;
  size: ButtonSize;
  isLoading?: boolean;
  handleClick?: () => void;
} & Testable;
export const Button: Component<ButtonProps> = (props) => {
  const mProps = mergeProps(
    {
      isDisabled: false,
      isLoading: false,
      ariaLabel: undefined,
      handleClick: () => {},
    },
    props,
  );

  return (
    <button
      type="button"
      class={`button button_${mProps.theme} button_${mProps.size}`}
      classList={{
        button_disabled: mProps.isDisabled,
        button_loading: mProps.isLoading,
      }}
      disabled={mProps.isDisabled}
      aria-disabled={props.isLoading}
      aria-label={mProps.ariaLabel}
      onClick={() => {
        mProps.handleClick();
      }}
      data-test-id={mProps.testId}
    >
      {mProps.text}
    </button>
  );
};
