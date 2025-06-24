import {
  createSignal,
  type JSXElement,
  mergeProps,
  onCleanup,
  onMount,
} from "solid-js";

import { CharCounter } from "../charCounter/charCounter.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./itemInput.css";

export enum ItemInputTheme {
  Primary = "primary",
}

export enum ItemInputSize {
  Medium = "medium",
}

type ItemInputProps = {
  theme?: ItemInputTheme;
  size?: ItemInputSize;
  isDisabled?: boolean;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  textAreaValue?: string;
  dataId?: string;
  placeholder: string;
  onChange?: (value: string) => void;
  defaultIsError?: boolean;
  controlElements?: JSXElement;
};

export const ItemInput = (props: Testable<ItemInputProps>) => {
  const mProps: Testable<Required<ItemInputProps>> = mergeProps(
    {
      theme: ItemInputTheme.Primary,
      size: ItemInputSize.Medium,
      isDisabled: false,
      defaultIsError: false,
      isRequired: false,
      textAreaValue: "",
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

  const remainingChars = () => mProps.maxLength - mProps.textAreaValue.length;

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
      class={`itemInput itemInput_${mProps.theme} itemInput_${mProps.size}`}
      classList={{
        itemInput_error: hasError() && mProps.textAreaValue === "",
        itemInput_disabled: mProps.isDisabled,
      }}
    >
      <textarea
        ref={textareaRef}
        name={mProps.name}
        class="itemInput__inner"
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
        {mProps.textAreaValue}
      </textarea>
      <div class="itemInput__controls">
        {mProps.controlElements}
        <div
          class="itemInput__counter"
          classList={{ itemInput__counter_visible: remainingChars() <= 10 }}
        >
          <CharCounter
            value={remainingChars()}
            testId={mProps.testId}
            testSubId={mProps.testSubId ?? ""}
          />
        </div>
      </div>
    </div>
  );
};
