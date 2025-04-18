import { createSignal, type JSXElement, mergeProps, onMount } from "solid-js";

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
  childComponent?: JSXElement,
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
      onChange: () => { },
      childComponent: null,
    },
    props,
  );

  const [hasError, setHasError] = createSignal(mProps.defaultIsError);

  let textareaRef: HTMLTextAreaElement | undefined;

  const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  onMount(() => {
    if (textareaRef) {
      requestAnimationFrame(() => {
        autoGrow(textareaRef);
      });
    }
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
        {mProps.childComponent}
        <div class="itemInput__counter">
          <CharCounter
            value={mProps.maxLength - mProps.textAreaValue.length}
            testId={mProps.testId}
            testSubId={mProps.testSubId ?? ""}
          />
        </div>
      </div>
    </div>
  );
};
