import { type JSX, mergeProps, Show } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./button.css";

export enum ButtonTheme {
  Primary = "primary",
  Secondary = "secondary",
  Successful = "successful",
  Dangerous = "dangerous",
}

export enum ButtonSize {
  Medium = "medium",
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
  href?: string;
  form?: string | undefined;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  handleClick?: () => void;
  openInNewTab?: boolean;
  children: JSX.Element;
};

export const Button = (props: Testable<ButtonProps>) => {
  const mProps: Testable<Required<ButtonProps>> = mergeProps(
    {
      theme: ButtonTheme.Primary,
      size: ButtonSize.Medium,
      componentType: ButtonComponentType.Button,
      type: ButtonType.Button,
      disabled: false,
      loading: false,
      href: "",
      form: undefined,
      openInNewTab: false,
      handleClick: () => {},
    },
    props,
  );

  const loadingIconSize = {
    [ButtonSize.Medium]: IconSize.Medium,
  };

  return (
    <>
      <Show when={mProps.componentType === ButtonComponentType.Button}>
        <button
          type={mProps.type}
          class="button"
          classList={{
            [`button_${mProps.size}`]: true,
            [`button_${mProps.theme}`]: !mProps.disabled,
            button_disabled: mProps.disabled,
            button_loading: mProps.loading,
          }}
          form={mProps.form}
          disabled={mProps.disabled}
          aria-disabled={mProps.loading ? true : undefined}
          onClick={() => {
            if (!mProps.loading) {
              mProps.handleClick();
            }
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Show when={mProps.loading}>
            <div class="button__loadingIcon">
              <Icon name={IconName.CircleNotch} size={loadingIconSize[mProps.size]} />
            </div>
          </Show>
          <span class="button__text">{mProps.children}</span>
        </button>
      </Show>
      <Show when={mProps.componentType === ButtonComponentType.Link && !mProps.disabled}>
        <a
          href={mProps.href}
          target={mProps.openInNewTab ? "_blank" : "_self"}
          rel={mProps.openInNewTab ? "noopener noreferrer" : ""}
          class="button"
          classList={{
            [`button_${mProps.size}`]: true,
            [`button_${mProps.theme}`]: true,
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <span class="button__text">{mProps.children}</span>
        </a>
      </Show>
      <Show when={mProps.componentType === ButtonComponentType.Link && mProps.disabled}>
        <span
          class="button"
          classList={{
            [`button_${mProps.size}`]: true,
            button_disabled: mProps.disabled,
          }}
          aria-disabled={true}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <span class="button__text">{mProps.children}</span>
        </span>
      </Show>
    </>
  );
};
