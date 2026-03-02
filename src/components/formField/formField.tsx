import { mergeProps } from "solid-js";

import {
  HintForInput,
  type HintForInputProps,
  HintForInputSize,
  HintForInputTheme,
} from "../hintForInput/hintForInput.tsx";
import { AutocompleteType, Input, type InputProps, InputSize, InputTheme, InputType } from "../input/input.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./formField.css";

export type FormFieldProps = {
  labelText: string;
  inputTheme?: InputTheme;
  inputSize?: InputSize;
  children?: string;
} & Omit<InputProps, "theme" | "size" | "children" | "ariaLabel" | "error"> &
  HintForInputProps;

export const FormField = (props: Testable<FormFieldProps>) => {
  const mProps = mergeProps(
    {
      hintText: "",
      errorText: "",
      isError: false,
      disabled: false,
      required: false,
      countable: false,
      clearable: false,
      inputTheme: InputTheme.Primary,
      inputSize: InputSize.Medium,
      type: InputType.Text,
      autocomplete: AutocompleteType.Off,
      onInput: () => {},
      onKeyDown: () => {},
      onClear: () => {},
      hintTheme: HintForInputTheme.Primary,
      hintSize: HintForInputSize.Medium,
      testSubId: "",
    },
    props,
  );

  return (
    <label class="formField">
      <span class="formField__labelText">{mProps.labelText}</span>
      <Input
        theme={mProps.inputTheme}
        size={mProps.inputSize}
        error={mProps.isError}
        disabled={mProps.disabled}
        placeholder={mProps.placeholder}
        name={mProps.name}
        maxLength={mProps.maxLength}
        required={mProps.required}
        type={mProps.type}
        autocomplete={mProps.autocomplete}
        countable={mProps.countable}
        clearable={mProps.clearable}
        onInput={mProps.onInput}
        onKeyDown={mProps.onKeyDown}
        onClear={mProps.onClear}
        testId={mProps.testId}
        testSubId={mProps.testSubId}
      >
        {mProps.children?.toString() ?? ""}
      </Input>
      <HintForInput
        hintTheme={mProps.hintTheme}
        hintSize={mProps.hintSize}
        hintText={mProps.hintText}
        errorText={mProps.errorText}
        isError={mProps.isError}
        testId={mProps.testId}
        testSubId={mProps.testSubId}
      />
    </label>
  );
};
