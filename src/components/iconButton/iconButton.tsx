import type { Component } from "solid-js";
import { mergeProps } from "solid-js";
import "./iconButton.css";
import { Icon } from "../icon/icon.tsx";

type IconButtonProps = {
  isDisabled?: boolean;
  ariaLabel: string;
  theme?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  handleClick: () => void;
};

export const IconButton: Component<IconButtonProps> = (props) => {
  const mProps = mergeProps(
    { theme: "primary", size: "small", isDisabled: false, isLoading: false },
    props,
  );

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
      aria-label={mProps.ariaLabel}
    >
      <Icon type="cross" />
    </button>
  );
};
