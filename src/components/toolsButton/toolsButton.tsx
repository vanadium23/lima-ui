import { Match, mergeProps, Show, Switch } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./toolsButton.css";

export enum ToolsButtonTheme {
  Primary = "primary",
  Dangerous = "dangerous",
}

export enum ToolsButtonSize {
  Medium = "medium",
}

export enum ToolsButtonComponentType {
  Button = "button",
  Link = "link",
}

type ToolsButtonProps = {
  theme?: ToolsButtonTheme;
  size?: ToolsButtonSize;
  componentType?: ToolsButtonComponentType;
  iconName: IconName;
  disabled?: boolean;
  loading?: boolean;
  handleClick?: () => void;
  children: string;
  openInNewTab?: boolean;
  href?: string;
};

export const ToolsButton = (props: Testable<ToolsButtonProps>) => {
  const mProps: Testable<Required<ToolsButtonProps>> = mergeProps(
    {
      theme: ToolsButtonTheme.Primary,
      size: ToolsButtonSize.Medium,
      componentType: ToolsButtonComponentType.Button,
      disabled: false,
      loading: false,
      openInNewTab: false,
      href: "",
      handleClick: () => {},
    },
    props,
  );

  const iconSize = {
    [ToolsButtonSize.Medium]: IconSize.Medium,
  };

  return (
    <>
      <Show when={mProps.componentType === ToolsButtonComponentType.Button}>
        <button
          type="button"
          onClick={() => {
            if (!mProps.loading) {
              mProps.handleClick();
            }
          }}
          class="toolsButton"
          classList={{
            [`toolsButton_${mProps.size}`]: true,
            [`toolsButton_${mProps.theme}`]: !mProps.disabled,
            toolsButton_disabled: mProps.disabled,
            toolsButton_loading: mProps.loading,
          }}
          aria-disabled={mProps.loading}
          disabled={mProps.disabled}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <div class="toolsButton__iconWrapper">
            <div class="toolsButton__icon">
              <Switch>
                <Match when={mProps.loading}>
                  <div class="toolsButton__loadingIcon">
                    <Icon name={IconName.CircleNotch} size={iconSize[mProps.size]} />
                  </div>
                </Match>
                <Match when={!mProps.loading}>
                  <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
                </Match>
              </Switch>
            </div>
          </div>

          <span class="toolsButton__text">{mProps.children}</span>
        </button>
      </Show>
      <Show when={mProps.componentType === ToolsButtonComponentType.Link && !mProps.disabled}>
        <a
          href={mProps.href}
          target={mProps.openInNewTab ? "_blank" : "_self"}
          rel={mProps.openInNewTab ? "noopener noreferrer" : ""}
          class="toolsButton"
          classList={{
            [`toolsButton_${mProps.size}`]: true,
            [`toolsButton_${mProps.theme}`]: true,
          }}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <div class="toolsButton__iconWrapper">
            <div class="toolsButton__icon">
              <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
            </div>
          </div>

          <span class="toolsButton__text">{mProps.children}</span>
        </a>
      </Show>
      <Show when={mProps.componentType === ToolsButtonComponentType.Link && mProps.disabled}>
        <span
          class="toolsButton"
          classList={{
            [`toolsButton_${mProps.size}`]: true,
            toolsButton_disabled: mProps.disabled,
          }}
          aria-disabled={mProps.disabled}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <div class="toolsButton__iconWrapper">
            <div class="toolsButton__icon">
              <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
            </div>
          </div>

          <span class="toolsButton__text">{mProps.children}</span>
        </span>
      </Show>
    </>
  );
};
