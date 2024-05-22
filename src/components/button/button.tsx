import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import "./button.css";
import type { Testable } from "../utilities/testable.ts";
import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";

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

export enum ButtonType {
  Button = "button",
  Submit = "submit",
  Reset = "reset",
}

type ButtonProps = {
  type?: ButtonType; //TODO - Подумать Герману как это сделать получше (может Union type)
  isDisabled?: boolean;
  ariaLabel?: string;
  text: string;
  theme: ButtonTheme;
  size: ButtonSize;
  isLoading?: boolean;
  handleClick?: () => void;
};
export const Button: Component<Testable<ButtonProps>> = (props) => {
  const mProps: Testable<Required<ButtonProps>> = mergeProps(
    {
      type: ButtonType.Button,
      isDisabled: false,
      isLoading: false,
      ariaLabel: "",
      handleClick: () => {},
    },
    props,
  );

  return (
    <button
      type={mProps.type}
      class={`button button_${mProps.theme} button_${mProps.size}`}
      classList={{
        button_disabled: mProps.isDisabled,
        button_loading: mProps.isLoading,
      }}
      disabled={mProps.isDisabled}
      aria-disabled={mProps.isLoading}
      {...prepareARIALabel(mProps.ariaLabel)}
      onClick={() => {
        mProps.handleClick();
      }}
      data-test-id={mProps.testId}
    >
      {mProps.text}
    </button>
  );
};
