import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import "./basicInput.css";

export enum InputTheme {
  Primary = "primary",
  Secondary = "secondary",
}

export enum InputSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type InputProps = {
  theme: InputTheme;
  size: InputSize;
  isError?: boolean;
  isDisabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  isReadonly?: boolean;
  isRequired?: boolean;
  type?: "text" | "password";
  defaultValue?: string;
};

export const BasicInput: Component<InputProps> = (props) => {
  const mProps = mergeProps(
    {
      isDisabled: false,
      isReadonly: false,
      isError: false,
      isRequired: false,
      type: "text",
      defaultValue: "",
    },
    props,
  );

  return (
    <div
      class={`input input_${mProps.theme} input_${mProps.size}`}
      classList={{
        input_error: mProps.isError,
        input_disabled: mProps.isDisabled,
      }}
    >
      <input
        type={mProps.type}
        name={mProps.name}
        class="input__inner"
        disabled={mProps.isDisabled}
        maxlength={mProps.maxLength}
        placeholder={mProps.placeholder}
        required={mProps.isRequired}
        readonly={mProps.isReadonly}
        value={mProps.defaultValue}
      />
    </div>
  );
};
