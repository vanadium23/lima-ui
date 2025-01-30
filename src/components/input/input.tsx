import { createSignal, mergeProps, Show } from "solid-js";
import {
  CharCounter,
  CharCounterSize,
  CharCounterTheme,
} from "../charCounter/charCounter.tsx";
import type { Testable } from "../utilities/testable.ts";
import "./input.css";

export enum InputTheme {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
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

export enum AutocompleteType {
  On = "on",
  Off = "off",
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
  autocomplete?: AutocompleteType; //TODO - Подумать Герману как это сделать получше (может Union type)
  isCountable?: boolean;
  label?: string;
};

export const Input = (props: Testable<InputProps>) => {
  const mProps: Testable<Required<InputProps>> = mergeProps(
    {
      autocomplete: AutocompleteType.Off,
      isDisabled: false,
      isError: false,
      isRequired: false,
      type: InputType.Text,
      defaultValue: "",
      isCountable: true,
      label: "",
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
        autocomplete={mProps.autocomplete}
        aria-label={mProps.label}
      />
      <div class="input__controls">
        <Show when={mProps.isCountable}>
          <CharCounter
            theme={CharCounterTheme.Primary}
            size={charCounterSize[mProps.size]}
            value={mProps.maxLength - getCounter()}
            testId={mProps.testId}
            testSubId={mProps.testSubId ?? ""}
          />
        </Show>
      </div>
    </div>
  );
};
