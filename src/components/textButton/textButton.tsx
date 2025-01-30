import { mergeProps, Show } from "solid-js";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";
import type { Testable } from "../utilities/testable.ts";
import "./textButton.css";

export enum TextButtonTheme {
  Primary = "primary",
}

export enum TextButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
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
  componentType?: TextButtonComponentType;
  link?: string;
  type?: TextButtonType; //GERMAN - Подумать Герману как это сделать получше (может Union type)
  isDisabled?: boolean;
  ariaLabel?: string;
  text: string;
  theme: TextButtonTheme;
  size: TextButtonSize;
  isLoading?: boolean;
  handleClick?: () => void;
};

export const TextButton = (props: Testable<TextButtonProps>) => {
  const mProps: Testable<Required<TextButtonProps>> = mergeProps(
    {
      componentType: TextButtonComponentType.Button,
      type: TextButtonType.Button,
      isDisabled: false,
      isLoading: false,
      ariaLabel: "",
      link: "",
      handleClick: () => { },
    },
    props,
  );

  const loadingIconSize = {
    [TextButtonSize.Small]: IconSize.Small,
    [TextButtonSize.Medium]: IconSize.Medium,
    [TextButtonSize.Large]: IconSize.Large,
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
          aria-disabled={mProps.isLoading}
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
      <Show when={mProps.componentType === TextButtonComponentType.Link}>
        <a
          href={!mProps.isLoading && !mProps.isDisabled ? mProps.link : "#"}
          class={`textButton textButton_${mProps.theme} textButton_${mProps.size}`}
          classList={{
            textButton_disabled: mProps.isDisabled,
            textButton_loading: mProps.isLoading,
          }}
          aria-disabled={mProps.isLoading}
          {...prepareARIALabel(mProps.ariaLabel)}
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
        </a>
      </Show>
    </>
  );
};
