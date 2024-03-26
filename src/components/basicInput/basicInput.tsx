import { type Component, createSignal, mergeProps } from "solid-js";
import "./basicInput.css";
import type { Testable } from "../utilities/testable.ts";
import { buildInputCounterTestId } from "../../../features/testIds.ts";

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
  isReadonly?: boolean;
  isRequired?: boolean;
  type?: InputType;
  defaultValue?: string;
};

export const BasicInput: Component<Testable<InputProps>> = (props) => {
  const mProps: Testable<Required<InputProps>> = mergeProps(
    {
      isDisabled: false,
      isReadonly: false,
      isError: false,
      isRequired: false,
      type: InputType.Text,
      defaultValue: "",
    },
    props,
  );

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
        readonly={mProps.isReadonly}
        value={mProps.defaultValue}
        data-test-id={mProps.testId}
        data-test-sub-id={mProps.testSubId}
        onInput={(event) => setCounter(event.target.value.length)}
      />
      <div class="input__controls">
        <span
          class="input__counter"
          data-test-id={buildInputCounterTestId(mProps.testId)}
          data-test-sub-id={mProps.testSubId}
        >
          {mProps.maxLength - getCounter()}
        </span>
      </div>
    </div>
  );
};
