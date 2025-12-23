import { createSignal, mergeProps } from "solid-js";

import { CharCounter } from "../charCounter/charCounter.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./textarea.css";

export enum TextareaTheme {
  Primary = "primary",
  Secondary = "secondary",
}

export enum TextareaSize {
  Medium = "medium",
}

type TextareaProps = {
  theme?: TextareaTheme;
  size?: TextareaSize;
  error?: boolean;
  disabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  required?: boolean;
  children?: string;
  onChange?: (value: string) => void;
};

export const Textarea = (props: Testable<TextareaProps>) => {
  const mProps: Testable<Required<TextareaProps>> = mergeProps(
    {
      theme: TextareaTheme.Primary,
      size: TextareaSize.Medium,
      disabled: false,
      error: false,
      required: false,
      children: "",
      onChange: () => {},
    },
    props,
  );

  const [getCounter, setCounter] = createSignal(mProps.children.length);

  return (
    <div
      class="textarea"
      classList={{
        [`textarea_${mProps.size}`]: true,
        [`textarea_${mProps.theme}`]: !mProps.disabled,
        textarea_disabled: mProps.disabled,
        textarea_error: mProps.error,
      }}
    >
      <textarea
        name={mProps.name}
        class="textarea__inner scrollStyles"
        disabled={mProps.disabled}
        maxlength={mProps.maxLength}
        placeholder={mProps.placeholder}
        required={mProps.required}
        onInput={(event) => {
          const value = event.target.value;
          setCounter(value.length);
          mProps.onChange(value);
        }}
        data-test-id={mProps.testId}
      >
        {mProps.children}
      </textarea>
      <div class="textarea__controls">
        <CharCounter testId={mProps.testId}>{mProps.maxLength - getCounter()}</CharCounter>
      </div>
    </div>
  );
};
