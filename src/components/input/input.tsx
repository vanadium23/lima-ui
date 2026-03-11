import { createSignal, mergeProps, Show } from "solid-js";

import { buildClearInputButtonTestId, DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { CharCounter } from "../charCounter/charCounter.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonSize, IconButtonTheme } from "../iconButton/iconButton.tsx";
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
  Email = "email",
  Password = "password",
}

export enum AutocompleteType {
  On = "on",
  Off = "off",
  Email = "email",
  NewPassword = "new-password",
  Password = "password",
}

export type InputProps = {
  theme?: InputTheme;
  size?: InputSize;
  error?: boolean;
  disabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  required?: boolean;
  type?: InputType;
  children?: string;
  autocomplete?: AutocompleteType;
  countable?: boolean;
  clearable?: boolean;
  ariaLabel?: string;
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
      disabled: false,
      error: false,
      required: false,
      type: InputType.Text,
      children: "",
      countable: false,
      clearable: false,
      ariaLabel: "",
      onInput: () => {},
      onKeyDown: () => {},
      onClear: () => {},
    },
    props,
  );

  const [getValue, setValue] = createSignal(mProps.children);
  const [getIsPasswordVisible, setIsPasswordVisible] = createSignal(false);

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

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!getIsPasswordVisible());
  };

  const getInputType = () => {
    if (mProps.type === InputType.Password) {
      return getIsPasswordVisible() ? "text" : "password";
    }

    return mProps.type;
  };

  return (
    <div
      class="input"
      classList={{
        [`input_${mProps.size}`]: true,
        [`input_${mProps.theme}`]: !mProps.disabled,
        input_disabled: mProps.disabled,
        input_error: mProps.error,
      }}
    >
      <input
        ref={inputRef}
        type={getInputType()}
        name={mProps.name}
        class="input__inner"
        disabled={mProps.disabled}
        maxlength={mProps.maxLength}
        placeholder={mProps.placeholder}
        required={mProps.required}
        value={getValue()}
        data-test-id={mProps.testId}
        data-test-sub-id={mProps.testSubId}
        autocomplete={mProps.autocomplete}
        aria-label={mProps.ariaLabel}
        onInput={handleInput}
        onKeyDown={(e) => mProps.onKeyDown(e)}
      />

      <Show when={mProps.clearable && getValue().length > 0 && !mProps.disabled}>
        <div class="input__clearButton">
          <IconButton
            iconName={IconName.X}
            size={IconButtonSize.MediumEmbedded}
            ariaLabel="Очистить поле"
            theme={IconButtonTheme.Secondary}
            handleClick={handleClear}
            testId={buildClearInputButtonTestId(mProps.testId)}
          />
        </div>
      </Show>

      <Show when={mProps.type === InputType.Password}>
        <div class="input__passwordToggle">
          <IconButton
            size={IconButtonSize.MediumEmbedded}
            iconName={getIsPasswordVisible() ? IconName.EyeSlash : IconName.Eye}
            ariaLabel={getIsPasswordVisible() ? "Скрыть пароль" : "Показать пароль"}
            theme={IconButtonTheme.Secondary}
            disabled={mProps.disabled}
            handleClick={togglePasswordVisibility}
            testId={DEFAULT_TEST_ID}
          />
        </div>
      </Show>

      <Show when={mProps.countable}>
        <div class="input__controls">
          <Show when={mProps.countable}>
            <CharCounter testId={mProps.testId} testSubId={mProps.testSubId ?? ""}>
              {mProps.maxLength - getValue().length}
            </CharCounter>
          </Show>
        </div>
      </Show>
    </div>
  );
};
