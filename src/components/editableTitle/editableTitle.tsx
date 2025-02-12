import { createEffect, createSignal, mergeProps } from "solid-js";
import { CharCounter } from "../charCounter/charCounter.tsx";
import type { Testable } from "../utilities/testable.ts";
import "./editableTitle.css";

export enum EditableTitleTheme {
  Primary = "primary",
}

export enum EditableTitleSize {
  Medium = "medium",
}

type EditableTitleProps = {
  theme?: EditableTitleTheme;
  size?: EditableTitleSize;
  isError?: boolean;
  isDisabled?: boolean;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  defaultValue?: string;
  dataId?: string;
  onChange?: (value: string) => void;
};

export const EditableTitle = (props: Testable<EditableTitleProps>) => {
  const mProps: Testable<Required<EditableTitleProps>> = mergeProps(
    {
      theme: EditableTitleTheme.Primary,
      size: EditableTitleSize.Medium,
      isDisabled: false,
      isError: false,
      isRequired: false,
      defaultValue: "",
      dataId: "",
      onChange: () => {},
    },
    props,
  );

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
      class={`editableTitle editableTitle_${mProps.theme} editableTitle_${mProps.size}`}
      classList={{
        editableTitle_error: mProps.isError,
        editableTitle_disabled: mProps.isDisabled,
      }}
    >
      <textarea
        ref={(el) => {
          textAreaRef = el;
        }}
        name={mProps.name}
        class="editableTitle__inner"
        disabled={mProps.isDisabled}
        maxlength={mProps.maxLength}
        placeholder={"Название списка"}
        required={mProps.isRequired}
        data-id={mProps.dataId}
        data-test-id={mProps.testId}
        data-test-sub-id={mProps.testSubId}
        rows={1}
        onInput={(event) => {
          const value = event.target.value;
          setCounter(value.length);
          autoGrow(event.target as HTMLTextAreaElement);
          mProps.onChange(value);
        }}
      >
        {mProps.defaultValue}
      </textarea>
      <div class="editableTitle__controls">
        <div class="editableTitle__counter">
          <CharCounter
            value={mProps.maxLength - getCounter()}
            testId={mProps.testId}
            testSubId={mProps.testSubId ?? ""}
          />
        </div>
      </div>
    </div>
  );
};
