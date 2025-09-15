import { Match, mergeProps, type Ref, Show, Switch } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./iconButton.css";

export enum IconButtonTheme {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
  Dangerous = "dangerous",
}

export enum IconButtonSize {
  Small = "small",
  MediumEmbedded = "mediumEmbedded",
  Medium = "medium",
  Large = "large",
}

export enum IconButtonType {
  Button = "button",
  Submit = "submit",
  Reset = "reset",
}

export enum IconButtonComponentType {
  Button = "button",
  Link = "link",
}

type IconButtonProps = {
  theme?: IconButtonTheme;
  size?: IconButtonSize;
  componentType?: IconButtonComponentType;
  type?: IconButtonType;
  link?: string;
  iconName: IconName;
  isDisabled?: boolean;
  ariaLabel: string;
  isLoading?: boolean;
  handleClick?: () => void;
  ref?: Ref<HTMLButtonElement>;
};

export const IconButton = (props: Testable<IconButtonProps>) => {
  const mProps: Testable<Required<IconButtonProps>> = mergeProps(
    {
      componentType: IconButtonComponentType.Button,
      type: IconButtonType.Button,
      theme: IconButtonTheme.Primary,
      size: IconButtonSize.Medium,
      isDisabled: false,
      isLoading: false,
      handleClick: () => {},
      link: "",
      ref: () => {},
    },
    props,
  );

  const iconSize = {
    [IconButtonSize.Small]: IconSize.Small,
    [IconButtonSize.MediumEmbedded]: IconSize.Medium,
    [IconButtonSize.Medium]: IconSize.Medium,
    [IconButtonSize.Large]: IconSize.Large,
  };

  return (
    <Switch>
      <Match when={mProps.componentType === IconButtonComponentType.Button}>
        <button
          type={mProps.type}
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
          aria-disabled={mProps.isLoading ? true : undefined}
          aria-label={mProps.ariaLabel}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
          ref={mProps.ref}
        >
          <Show when={mProps.isLoading} fallback={<Icon name={mProps.iconName} size={iconSize[mProps.size]} />}>
            <div class="iconButton__loadingIcon">
              <Icon name={IconName.CircleNotch} size={iconSize[mProps.size]} />
            </div>
          </Show>
        </button>
      </Match>
      <Match when={mProps.componentType === IconButtonComponentType.Link && !mProps.isDisabled}>
        <a
          href={mProps.link}
          class={`iconButton iconButton_${mProps.theme} iconButton_${mProps.size}`}
          title={mProps.ariaLabel}
          aria-label={mProps.ariaLabel}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
        </a>
      </Match>
      <Match when={mProps.componentType === IconButtonComponentType.Link && mProps.isDisabled}>
        <span
          class={`iconButton iconButton_${mProps.theme} iconButton_${mProps.size}`}
          classList={{
            iconButton_disabled: mProps.isDisabled,
          }}
          title={mProps.ariaLabel}
          aria-label={mProps.ariaLabel}
          aria-disabled={mProps.isDisabled}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
        </span>
      </Match>
    </Switch>
  );
};
