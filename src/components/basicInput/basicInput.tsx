import { type Component, createSignal, mergeProps } from "solid-js";
import "./basicInput.css";
import type { Testable } from "../utilities/testable.ts";
import {
  CharCounter,
  CharCounterSize,
  CharCounterTheme,
} from "../charCounter/charCounter.tsx";

export enum InputTheme {
  Primary = "primary",
  Secondary = "secondary",
}

export enum InputSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum InputType {
  Text = "text",
  Password = "password",
}

type InputProps = {
  theme: InputTheme;
  size: InputSize;
  isError?: boolean;
  isDisabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  type?: InputType;
  defaultValue?: string;
};

export const BasicInput: Component<Testable<InputProps>> = (props) => {
  const mProps: Testable<Required<InputProps>> = mergeProps(
    {
      isDisabled: false,
      isError: false,
      isRequired: false,
      type: InputType.Text,
      defaultValue: "",
    },
    props,
  );

  const charCounterSize = {
    [InputSize.Small]: CharCounterSize.Small,
    [InputSize.Medium]: CharCounterSize.Medium,
    [InputSize.Large]: CharCounterSize.Large,
  };

  const [getCounter, setCounter] = createSignal(mProps.defaultValue.length);

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
        value={mProps.defaultValue}
        data-test-id={mProps.testId}
        data-test-sub-id={mProps.testSubId}
        onInput={(event) => setCounter(event.target.value.length)}
      />
      <div class="input__controls">
        <CharCounter
          theme={CharCounterTheme.Primary}
          size={charCounterSize[mProps.size]}
          value={mProps.maxLength - getCounter()}
          testId={mProps.testId}
          testSubId={mProps.testSubId || ""} // TODO Посмотреть Герману повнимательней что здесь происходит
        />
      </div>
    </div>
  );
};
