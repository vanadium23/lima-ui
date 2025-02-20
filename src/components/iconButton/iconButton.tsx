import { mergeProps, Show } from "solid-js";

import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./iconButton.css";

export enum IconButtonTheme {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Successful = "successful",
  Dangerous = "dangerous",
}

export enum IconButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum IconButtonComponentType {
  Button = "button",
  Link = "link",
}

type IconButtonProps = {
  theme?: IconButtonTheme;
  size?: IconButtonSize;
  componentType?: IconButtonComponentType;
  link?: string;
  iconName: IconName;
  isDisabled?: boolean;
  ariaLabel: string;
  isLoading?: boolean;
  handleClick?: () => void;
};

export const IconButton = (props: Testable<IconButtonProps>) => {
  const mProps: Testable<Required<IconButtonProps>> = mergeProps(
    {
      theme: IconButtonTheme.Primary,
      size: IconButtonSize.Medium,
      isDisabled: false,
      isLoading: false,
      handleClick: () => { },
      componentType: IconButtonComponentType.Button,
      link: "",
    },
    props,
  );

  const iconSize = {
    [IconButtonSize.Small]: IconSize.Small,
    [IconButtonSize.Medium]: IconSize.Medium,
    [IconButtonSize.Large]: IconSize.Large,
  };

  return (
    <>
      <Show when={mProps.componentType === IconButtonComponentType.Button}>
        <button
          type="button"
          onClick={() => {
            if (!mProps.isLoading) {
              mProps.handleClick();
            }
          }}
          class={`iconButton iconButton_${mProps.theme} iconButton_${mProps.size}`}
          classList={{
            iconButton_disabled: mProps.isDisabled,
            iconButton_loading: mProps.isLoading,
          }}
          title={mProps.ariaLabel}
          disabled={mProps.isDisabled}
          aria-disabled={mProps.isLoading}
          aria-label={mProps.ariaLabel}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Show
            when={mProps.isLoading}
            fallback={
              <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
            }
          >
            <div class="iconButton__loadingIcon">
              <Icon name={IconName.CircleNotch} size={iconSize[mProps.size]} />
            </div>
          </Show>
        </button>
      </Show>
      <Show when={mProps.componentType === IconButtonComponentType.Link}>
        <a
          href={!mProps.isLoading && !mProps.isDisabled ? mProps.link : "#"}
          class={`iconButton iconButton_${mProps.theme} iconButton_${mProps.size}`}
          classList={{
            iconButton_disabled: mProps.isDisabled,
            iconButton_loading: mProps.isLoading,
          }}
          title={mProps.ariaLabel}
          aria-label={mProps.ariaLabel}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
        </a>
      </Show>
    </>
  );
};
