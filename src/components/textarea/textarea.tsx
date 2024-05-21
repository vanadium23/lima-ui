import { type Component, createSignal, mergeProps } from "solid-js";
import "./textarea.css";
import {
  CharCounter,
  CharCounterSize,
  CharCounterTheme,
} from "../charCounter/charCounter.tsx";

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
  theme: TextareaTheme;
  size: TextareaSize;
  isError?: boolean;
  isDisabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  defaultValue?: string;
};

export const Textarea: Component<TextareaProps> = (props) => {
  const mProps: Required<TextareaProps> = mergeProps(
    {
      isDisabled: false,
      isError: false,
      isRequired: false,
      defaultValue: "",
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
        value={mProps.defaultValue}
        onInput={(event) => setCounter(event.target.value.length)}
      />
      <div class="textarea__controls">
        <CharCounter
          theme={CharCounterTheme.Primary}
          size={CharCounterSize.ExtraSmall}
          value={mProps.maxLength - getCounter()}
          testId={""} // TODO Посмотреть Герману ЕЩЁ повнимательней что здесь происходит
          testSubId={""} //TODO И здесь
        />
      </div>
    </div>
  );
};
