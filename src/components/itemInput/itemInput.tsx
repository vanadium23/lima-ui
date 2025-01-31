import {
  createEffect,
  createSignal,
  mergeProps
} from "solid-js";
import {
  CharCounter,
  CharCounterSize,
  CharCounterTheme,
} from "../charCounter/charCounter.tsx";
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
  isError?: boolean;
  isDisabled?: boolean;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  defaultValue?: string;
  dataId?: string;
  placeholder: string;
};

export const ItemInput = (props: Testable<ItemInputProps>) => {
  const mProps: Testable<Required<ItemInputProps>> = mergeProps(
    {
      theme: ItemInputTheme.Primary,
      size: ItemInputSize.Medium,
      isDisabled: false,
      isError: false,
      isRequired: false,
      defaultValue: "",
      dataId: "",
    },
    props,
  );

  const charCounterSize = {
    [ItemInputSize.Medium]: CharCounterSize.Medium,
  };

  const [getCounter, setCounter] = createSignal(mProps.defaultValue.length);

  const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = "auto"; // Если удалить многострочный текст, то без этой строки не уменьшится высота
    element.style.height = `${element.scrollHeight}px`;
  };

  let textAreaRef: HTMLTextAreaElement | undefined; // Используем `undefined` вместо `null`

  createEffect(() => {
    if (textAreaRef) {
      // Применяем autoGrow сразу после монтирования компонента с уже существующим контентом
      autoGrow(textAreaRef);
    }
  });

  return (
    <div
      class={`itemInput itemInput_${mProps.theme} itemInput_${mProps.size}`}
      classList={{
        itemInput_error: mProps.isError,
        itemInput_disabled: mProps.isDisabled,
      }}
    >
      <textarea
        ref={(el) => {
          textAreaRef = el;
        }}
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
        onInput={(event) => {
          setCounter(event.target.value.length);
          autoGrow(event.target as HTMLTextAreaElement);
        }}
      >
        {mProps.defaultValue}
      </textarea>
      <div class="itemInput__controls">
        <div class="itemInput__counter">
          <CharCounter
            theme={CharCounterTheme.Primary}
            size={charCounterSize[mProps.size]}
            value={mProps.maxLength - getCounter()}
            testId={mProps.testId}
            testSubId={mProps.testSubId ?? ""}
          />
        </div>
      </div>
    </div>
  );
};
