import { mergeProps, Show } from "solid-js";

import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";
import type { Testable } from "../utilities/testable.ts";

import "./textButton.css";

export enum TextButtonTheme {
  Primary = "primary",
  Dangerous = "dangerous",
}

export enum TextButtonSize {
  Medium = "medium",
}

export enum TextButtonType {
  Button = "button",
  Submit = "submit",
  Reset = "reset",
}

export enum TextButtonComponentType {
  Button = "button",
  Link = "link",
}

type TextButtonProps = {
  theme?: TextButtonTheme;
  size?: TextButtonSize;
  componentType?: TextButtonComponentType;
  link?: string;
  type?: TextButtonType; //GERMAN - Подумать Герману как это сделать получше (может Union type)
  isDisabled?: boolean;
  ariaLabel?: string;
  text: string;
  isLoading?: boolean;
  handleClick?: () => void;
};

export const TextButton = (props: Testable<TextButtonProps>) => {
  const mProps: Testable<Required<TextButtonProps>> = mergeProps(
    {
      theme: TextButtonTheme.Primary,
      size: TextButtonSize.Medium,
      componentType: TextButtonComponentType.Button,
      type: TextButtonType.Button,
      isDisabled: false,
      isLoading: false,
      ariaLabel: "",
      link: "",
      handleClick: () => {},
    },
    props,
  );

  const loadingIconSize = {
    [TextButtonSize.Medium]: IconSize.Medium,
  };

  return (
    <>
      <Show when={mProps.componentType === TextButtonComponentType.Button}>
        <button
          type={mProps.type}
          class={`textButton textButton_${mProps.theme} textButton_${mProps.size}`}
          classList={{
            textButton_disabled: mProps.isDisabled,
            textButton_loading: mProps.isLoading,
          }}
          disabled={mProps.isDisabled}
          aria-disabled={mProps.isLoading ? true : undefined}
          {...prepareARIALabel(mProps.ariaLabel)}
          onClick={() => {
            if (!mProps.isLoading) {
              mProps.handleClick();
            }
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Show when={mProps.isLoading}>
            <div class="textButton__loadingIcon">
              <Icon
                name={IconName.CircleNotch}
                size={loadingIconSize[mProps.size]}
              />
            </div>
          </Show>
          <span class="textButton__text">{mProps.text}</span>
        </button>
      </Show>
      <Show
        when={
          mProps.componentType === TextButtonComponentType.Link &&
          !mProps.isDisabled
        }
      >
        <a
          href={mProps.link}
          class={`textButton textButton_${mProps.theme} textButton_${mProps.size}`}
          {...prepareARIALabel(mProps.ariaLabel)}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <span class="textButton__text">{mProps.text}</span>
        </a>
      </Show>
      <Show
        when={
          mProps.componentType === TextButtonComponentType.Link &&
          mProps.isDisabled
        }
      >
        <span
          class={`textButton textButton_${mProps.theme} textButton_${mProps.size}`}
          classList={{
            textButton_disabled: mProps.isDisabled,
          }}
          aria-disabled={mProps.isDisabled}
          {...prepareARIALabel(mProps.ariaLabel)}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <span class="textButton__text">{mProps.text}</span>
        </span>
      </Show>
    </>
  );
};
