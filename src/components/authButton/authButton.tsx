import { Match, mergeProps, Switch } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import { GoogleIcon } from "./components/icons/googleIcon.tsx";
import { VkIcon } from "./components/icons/vkIcon.tsx";
import { YandexIcon } from "./components/icons/yandexIcon.tsx";
import "./authButton.css";

export type AuthButtonIconName = "google" | "yandex" | "vk";

export type AuthButtonIconProps = {
  disabled?: boolean;
};

export enum AuthButtonTheme {
  Primary = "primary",
}

export enum AuthButtonSize {
  Medium = "medium",
}

type AuthButtonProps = {
  theme?: AuthButtonTheme;
  size?: AuthButtonSize;
  iconName: AuthButtonIconName;
  disabled?: boolean;
  loading?: boolean;
  handleClick?: () => void;
  children: string;
  openInNewTab?: boolean;
  href?: string;
};

export const AuthButton = (props: Testable<AuthButtonProps>) => {
  const mProps: Testable<Required<AuthButtonProps>> = mergeProps(
    {
      theme: AuthButtonTheme.Primary,
      size: AuthButtonSize.Medium,
      disabled: false,
      loading: false,
      openInNewTab: false,
      href: "",
      handleClick: () => {},
    },
    props,
  );

  return (
    <button
      type="button"
      onClick={() => {
        if (!mProps.loading) {
          mProps.handleClick();
        }
      }}
      class="authButton"
      classList={{
        [`authButton_${mProps.size}`]: true,
        [`authButton_${mProps.theme}`]: !mProps.disabled,
        authButton_disabled: mProps.disabled,
        authButton_loading: mProps.loading,
      }}
      aria-disabled={mProps.loading}
      disabled={mProps.disabled}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="authButton__iconWrapper">
        <div class="authButton__icon">
          <Switch>
            <Match when={mProps.loading}>
              <div class="authButton__loadingIcon">
                <Icon name={IconName.CircleNotch} size={IconSize.ExtraExtraLarge} />
              </div>
            </Match>
            <Match when={mProps.iconName === "google"}>
              <GoogleIcon disabled={mProps.disabled} />
            </Match>
            <Match when={mProps.iconName === "yandex"}>
              <YandexIcon disabled={mProps.disabled} />
            </Match>
            <Match when={mProps.iconName === "vk"}>
              <VkIcon disabled={mProps.disabled} />
            </Match>
          </Switch>
        </div>
      </div>

      <span class="authButton__text">{mProps.children}</span>
    </button>
  );
};
