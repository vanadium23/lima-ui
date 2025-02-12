import { createSignal, mergeProps } from "solid-js";
import { CharCounter } from "../charCounter/charCounter.tsx";
import type { Testable } from "../utilities/testable.ts";
import "./textarea.css";

export enum TextareaTheme {
  Primary = "primary",
  Secondary = "secondary",
}

export enum TextareaSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type TextareaProps = {
  theme?: TextareaTheme;
  size?: TextareaSize;
  isError?: boolean;
  isDisabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

export const Textarea = (props: Testable<TextareaProps>) => {
  const mProps: Testable<Required<TextareaProps>> = mergeProps(
    {
      theme: TextareaTheme.Primary,
      size: TextareaSize.Medium,
      isDisabled: false,
      isError: false,
      isRequired: false,
      defaultValue: "",
      onChange: () => {},
    },
    props,
  );

  const [getCounter, setCounter] = createSignal(mProps.defaultValue.length);

  return (
    <div
      class={`textarea textarea_${mProps.theme} textarea_${mProps.size}`}
      classList={{
        textarea_error: mProps.isError,
        textarea_disabled: mProps.isDisabled,
      }}
    >
      <textarea
        name={mProps.name}
        class="textarea__inner"
        disabled={mProps.isDisabled}
        maxlength={mProps.maxLength}
        placeholder={mProps.placeholder}
        required={mProps.isRequired}
        onInput={(event) => {
          const value = event.target.value;
          setCounter(value.length);
          mProps.onChange(value);
        }}
        data-test-id={mProps.testId}
      >
        {mProps.defaultValue}
      </textarea>
      <div class="textarea__controls">
        <CharCounter
          value={mProps.maxLength - getCounter()}
          testId={mProps.testId}
        />
      </div>
    </div>
  );
};
