import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import "./iconButton.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";

export enum IconButtonTheme {
  Primary = "primary",
  Secondary = "secondary",
  Successful = "successful",
  Dangerous = "dangerous",
}

export enum IconButtonSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type IconButtonProps = {
  iconName: IconName;
  isDisabled?: boolean;
  ariaLabel: string;
  theme: IconButtonTheme;
  size: IconButtonSize;
  isLoading?: boolean;
  handleClick?: () => void;
};

export const IconButton: Component<IconButtonProps> = (props) => {
  const mProps: Required<IconButtonProps> = mergeProps(
    {
      isDisabled: false,
      isLoading: false,
      handleClick: () => {},
    },
    props,
  );

  const iconSize = {
    [IconButtonSize.Small]: IconSize.x7,
    [IconButtonSize.Medium]: IconSize.x10,
    [IconButtonSize.Large]: IconSize.x12,
  };

  return (
    <button
      type="button"
      onClick={() => {
        mProps.handleClick();
      }}
      class={`iconButton iconButton_${mProps.theme} iconButton_${mProps.size}`}
      classList={{
        iconButton_disabled: mProps.isDisabled,
        iconButton_loading: mProps.isLoading,
      }}
      disabled={mProps.isDisabled}
      aria-disabled={mProps.isLoading}
      aria-label={mProps.ariaLabel}
    >
      <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
    </button>
  );
};
