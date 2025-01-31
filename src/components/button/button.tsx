import { mergeProps, Show } from "solid-js";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";
import "./button.css";

export enum ButtonTheme {
  Primary = "primary",
  Secondary = "secondary",
  Successful = "successful",
  Dangerous = "dangerous",
}

export enum ButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum ButtonType {
  Button = "button",
  Submit = "submit",
  Reset = "reset",
}

export enum ButtonComponentType {
  Button = "button",
  Link = "link",
}

type ButtonProps = {
  theme?: ButtonTheme;
  size?: ButtonSize;
  componentType?: ButtonComponentType;
  link?: string;
  type?: ButtonType; //GERMAN - Подумать Герману как это сделать получше (может Union type)
  isDisabled?: boolean;
  text: string;
  isLoading?: boolean;
  handleClick?: () => void;
  openInNewTab?: boolean;
};

export const Button = (props: Testable<ButtonProps>) => {
  const mProps: Testable<Required<ButtonProps>> = mergeProps(
    {
      theme: ButtonTheme.Primary,
      size: ButtonSize.Medium,
      componentType: ButtonComponentType.Button,
      type: ButtonType.Button,
      isDisabled: false,
      isLoading: false,
      link: "",
      openInNewTab: false,
      handleClick: () => { },
    },
    props,
  );

  const loadingIconSize = {
    [ButtonSize.Small]: IconSize.Small,
    [ButtonSize.Medium]: IconSize.Medium,
    [ButtonSize.Large]: IconSize.Large,
  };

  return (
    <>
      <Show when={mProps.componentType === ButtonComponentType.Button}>
        <button
          type={mProps.type}
          class={`button button_${mProps.theme} button_${mProps.size}`}
          classList={{
            button_disabled: mProps.isDisabled,
            button_loading: mProps.isLoading,
          }}
          disabled={mProps.isDisabled}
          aria-disabled={mProps.isLoading}
          onClick={() => {
            if (!mProps.isLoading) {
              mProps.handleClick();
            }
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Show when={mProps.isLoading}>
            <div class="button__loadingIcon">
              <Icon
                name={IconName.CircleNotch}
                size={loadingIconSize[mProps.size]}
              />
            </div>
          </Show>
          <span class="button__text">{mProps.text}</span>
        </button>
      </Show>
      <Show when={mProps.componentType === ButtonComponentType.Link}>
        <a
          href={!mProps.isLoading && !mProps.isDisabled ? mProps.link : "#"}
          target={mProps.openInNewTab ? "_blank" : "_self"}
          rel={mProps.openInNewTab ? "noopener noreferrer" : ""}
          class={`button button_${mProps.theme} button_${mProps.size}`}
          classList={{
            button_disabled: mProps.isDisabled,
            button_loading: mProps.isLoading,
          }}
          aria-disabled={mProps.isLoading || mProps.isDisabled}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Show when={mProps.isLoading}>
            <div class="button__loadingIcon">
              <Icon
                name={IconName.CircleNotch}
                size={loadingIconSize[mProps.size]}
              />
            </div>
          </Show>
          <span class="button__text">{mProps.text}</span>
        </a>
      </Show>
    </>
  );
};