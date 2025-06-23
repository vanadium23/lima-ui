import { createSignal, mergeProps, Show } from "solid-js";

import { CharCounter } from "../charCounter/charCounter.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./input.css";

export enum InputTheme {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
}

export enum InputSize {
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
  theme?: InputTheme;
  size?: InputSize;
  isError?: boolean;
  isDisabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  type?: InputType;
  defaultValue?: string;
  autocomplete?: AutocompleteType;
  isCountable?: boolean;
  label?: string;
  onInput?: (e: InputEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
};

export const Input = (props: Testable<InputProps>) => {
  const mProps: Testable<Required<InputProps>> = mergeProps(
    {
      theme: InputTheme.Primary,
      size: InputSize.Medium,
      autocomplete: AutocompleteType.Off,
      isDisabled: false,
      isError: false,
      isRequired: false,
      type: InputType.Text,
      defaultValue: "",
      isCountable: true,
      label: "",
      onInput: () => {},
      onKeyDown: () => {},
    },
    props,
  );

  const [getCounter, setCounter] = createSignal(mProps.defaultValue.length);

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setCounter(target.value.length);
    mProps.onInput(e);
  };

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
        autocomplete={mProps.autocomplete}
        aria-label={mProps.label}
        onInput={handleInput}
        onKeyDown={(e) => mProps.onKeyDown(e)}
      />
      <Show when={mProps.isCountable}>
        {/* Заложено на будущее, когда обертка нужна не только для других контролов, из-за бага при клике в инпут справа без контролов*/}
        <div class="input__controls">
          <Show when={mProps.isCountable}>
            <CharCounter
              value={mProps.maxLength - getCounter()}
              testId={mProps.testId}
              testSubId={mProps.testSubId ?? ""}
            />
          </Show>
        </div>
      </Show>
    </div>
  );
};
