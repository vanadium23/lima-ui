import {
  createSignal,
  type JSXElement,
  mergeProps,
  onCleanup,
  onMount,
  Show,
} from "solid-js";

import { CharCounter } from "../charCounter/charCounter.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./cyberInput.css";

export enum CyberInputTheme {
  Primary = "primary",
  Secondary = "secondary",
}

export enum CyberInputSize {
  Medium = "medium",
  ExtraLarge = "extraLarge",
}

type ItemInputProps = {
  theme?: CyberInputTheme;
  size?: CyberInputSize;
  isDisabled?: boolean;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  defaultValue?: string;
  dataId?: string;
  placeholder: string;
  onChange?: (value: string) => void;
  defaultIsError?: boolean;
  controlElements?: JSXElement;
};

export const CyberInput = (props: Testable<ItemInputProps>) => {
  /* Компонент так называется ради шутки, потому что мы искали название для
  этого наполовину Input'а, наполовину Textarea'а, который при этом имеет
  динамическую высоту и кучу встроенных модулей, таких как выпадающее меню и т.д.
  Ну и конечно, чтобы немного отдать дань уважению Джонни Сильверхенду xD */
  const mProps: Testable<Required<ItemInputProps>> = mergeProps(
    {
      theme: CyberInputTheme.Primary,
      size: CyberInputSize.Medium,
      isDisabled: false,
      defaultIsError: false,
      isRequired: false,
      defaultValue: "",
      dataId: "",
      onChange: () => {},
      controlElements: null,
    },
    props,
  );

  const [hasError, setHasError] = createSignal(mProps.defaultIsError);

  let textareaRef: HTMLTextAreaElement | undefined;

  const autoGrow = (element: HTMLTextAreaElement) => {
    requestAnimationFrame(() => {
      element.style.height = "auto";
      element.style.height = `${element.scrollHeight}px`;
    });
  };

  const handleResize = () => {
    if (textareaRef) {
      autoGrow(textareaRef);
    }
  };

  const remainingChars = () => mProps.maxLength - mProps.defaultValue.length;

  onMount(() => {
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
  });

  onCleanup(() => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleResize);
  });

  return (
    <div
      class={`cyberInput cyberInput_${mProps.theme} cyberInput_${mProps.size}`}
      classList={{
        cyberInput_error: hasError() && mProps.defaultValue === "",
        cyberInput_disabled: mProps.isDisabled,
      }}
    >
      <textarea
        ref={textareaRef}
        name={mProps.name}
        class="cyberInput__inner"
        disabled={mProps.isDisabled}
        maxlength={mProps.maxLength}
        placeholder={mProps.placeholder}
        required={mProps.isRequired}
        data-id={mProps.dataId}
        data-test-id={mProps.testId}
        data-test-sub-id={mProps.testSubId}
        rows={1}
        onInvalid={() => setHasError(true)}
        onInput={(event) => {
          autoGrow(event.target);
          mProps.onChange(event.target.value);
        }}
      >
        {mProps.defaultValue}
      </textarea>
      <div class="cyberInput__controls">
        {mProps.controlElements}
        <Show when={remainingChars() <= 10}>
          <div class="cyberInput__counter">
            <CharCounter
              value={remainingChars()}
              testId={mProps.testId}
              testSubId={mProps.testSubId ?? ""}
            />
          </div>
        </Show>
      </div>
    </div>
  );
};
