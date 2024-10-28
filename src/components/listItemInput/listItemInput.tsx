import { type Component, createSignal, mergeProps } from "solid-js";
import "./listItemInput.css";
import type { Testable } from "../utilities/testable.ts";
import {
  CharCounter,
  CharCounterSize,
  CharCounterTheme,
} from "../charCounter/charCounter.tsx";

export enum ListItemInputTheme {
  Primary = "primary",
}

export enum ListItemInputSize {
  Medium = "medium",
}

type ListItemInputProps = {
  theme: ListItemInputTheme;
  size: ListItemInputSize;
  isError?: boolean;
  isDisabled?: boolean;
  placeholder: string;
  name: string;
  maxLength: number;
  isRequired?: boolean;
  defaultValue?: string;
};

export const ListItemInput: Component<Testable<ListItemInputProps>> = (
  props,
) => {
  const mProps: Testable<Required<ListItemInputProps>> = mergeProps(
    {
      isDisabled: false,
      isError: false,
      isRequired: false,
      defaultValue: "",
    },
    props,
  );

  const charCounterSize = {
    [ListItemInputSize.Medium]: CharCounterSize.Medium,
  };

  const [getCounter, setCounter] = createSignal(mProps.defaultValue.length);

  const autoGrow = (element: HTMLTextAreaElement) => {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  };

  return (
    <div
      class={`listItemInput listItemInput_${mProps.theme} listItemInput_${mProps.size}`}
      classList={{
        listItemInput_error: mProps.isError,
        listItemInput_disabled: mProps.isDisabled,
      }}
    >
      <textarea
        name={mProps.name}
        class="listItemInput__inner"
        disabled={mProps.isDisabled}
        maxlength={mProps.maxLength}
        placeholder={mProps.placeholder}
        required={mProps.isRequired}
        value={mProps.defaultValue}
        data-test-id={mProps.testId}
        data-test-sub-id={mProps.testSubId}
        rows={1}
        onInput={(event) => {
          setCounter(event.target.value.length);
          autoGrow(event.target as HTMLTextAreaElement);
        }}
      />
      <div class="listItemInput__controls">
        <CharCounter
          theme={CharCounterTheme.Primary}
          size={charCounterSize[mProps.size]}
          value={mProps.maxLength - getCounter()}
          testId={mProps.testId}
          testSubId={mProps.testSubId ?? ""}
        />
      </div>
    </div>
  );
};
