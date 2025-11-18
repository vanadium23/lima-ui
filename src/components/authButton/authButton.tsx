import { Match, mergeProps, Switch } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import { CustomIcon, type CustomIconName } from "./components/customIcon/customIcon.tsx";
import "./authButton.css";

export enum AuthButtonTheme {
  Primary = "primary",
  Dangerous = "dangerous",
}

export enum AuthButtonSize {
  Medium = "medium",
}

type AuthButtonProps = {
  theme?: AuthButtonTheme;
  size?: AuthButtonSize;
  iconName: CustomIconName;
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

  const iconSize = {
    [AuthButtonSize.Medium]: IconSize.Medium,
  };

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
                <Icon name={IconName.CircleNotch} size={iconSize[mProps.size]} />
              </div>
            </Match>
            <Match when={!mProps.loading}>
              <CustomIcon name={mProps.iconName} size={iconSize[mProps.size]} disabled={mProps.disabled} />
            </Match>
          </Switch>
        </div>
      </div>

      <span class="authButton__text">{mProps.children}</span>
    </button>
  );
};
