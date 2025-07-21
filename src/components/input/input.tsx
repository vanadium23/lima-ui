import { createSignal, mergeProps, Show } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { CharCounter } from "../charCounter/charCounter.tsx";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./input.css";

export enum InputTheme {
  Primary = "primary",
  Secondary = "secondary",
}

export enum InputSize {
  Medium = "medium",
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
  isClearable?: boolean;
  label?: string;
  onInput?: (e: InputEvent) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  onClear?: () => void;
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
      isClearable: false,
      label: "",
      onInput: () => {},
      onKeyDown: () => {},
      onClear: () => {},
    },
    props,
  );

  const [getValue, setValue] = createSignal(mProps.defaultValue);

  let inputRef: HTMLInputElement | undefined;

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    setValue(target.value);

    mProps.onInput(e);
  };

  const handleClear = () => {
    setValue("");

    if (inputRef) {
      inputRef.focus();
    }

    mProps.onClear();
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
        ref={inputRef}
        type={mProps.type}
        name={mProps.name}
        class="input__inner"
        disabled={mProps.isDisabled}
        maxlength={mProps.maxLength}
        placeholder={mProps.placeholder}
        required={mProps.isRequired}
        value={getValue()}
        data-test-id={mProps.testId}
        data-test-sub-id={mProps.testSubId}
        autocomplete={mProps.autocomplete}
        aria-label={mProps.label}
        onInput={handleInput}
        onKeyDown={(e) => mProps.onKeyDown(e)}
      />

      <Show
        when={mProps.isClearable && getValue().length > 0 && !mProps.isDisabled}
      >
        <div class="input__clearButton">
          <IconButton
            iconName={IconName.X}
            size={IconButtonSize.MediumEmbedded}
            ariaLabel="Очистить поле"
            theme={IconButtonTheme.Secondary}
            handleClick={handleClear}
            testId={DEFAULT_TEST_ID}
          />
        </div>
      </Show>

      <Show when={mProps.isCountable}>
        <div class="input__controls">
          <Show when={mProps.isCountable}>
            <CharCounter
              value={mProps.maxLength - getValue().length}
              testId={mProps.testId}
              testSubId={mProps.testSubId ?? ""}
            />
          </Show>
        </div>
      </Show>
    </div>
  );
};
