import { type Component, createMemo, Show } from "solid-js";
import { mergeProps } from "solid-js";
import "./iconButton.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";

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

export enum IconButtonComponentType {
  Button = "button",
  Link = "link",
}

type IconButtonProps = {
  componentType?: IconButtonComponentType;
  link?: string;
  iconName: IconName;
  isDisabled?: boolean;
  ariaLabel: string;
  theme: IconButtonTheme;
  size: IconButtonSize;
  isLoading?: boolean;
  handleClick?: () => void;
};

export const IconButton: Component<Testable<IconButtonProps>> = (props) => {
  const defaultProps = {
    isDisabled: false,
    isLoading: false,
    handleClick: () => {},
    componentType: IconButtonComponentType.Button,
    link: "",
  };

  const merged = mergeProps(defaultProps, props);
  const mProps = createMemo(() => merged);

  const iconSize = {
    [IconButtonSize.Small]: IconSize.Small,
    [IconButtonSize.Medium]: IconSize.Medium,
    [IconButtonSize.Large]: IconSize.Large,
  };

  return (
    <>
      <Show when={mProps().componentType === IconButtonComponentType.Button}>
        <button
          type="button"
          onClick={() => {
            mProps().handleClick();
          }}
          class={`iconButton iconButton_${mProps().theme} iconButton_${mProps().size}`}
          classList={{
            iconButton_disabled: mProps().isDisabled,
            iconButton_loading: mProps().isLoading,
          }}
          title={mProps().ariaLabel}
          disabled={mProps().isDisabled}
          aria-disabled={mProps().isLoading}
          aria-label={mProps().ariaLabel}
          data-test-id={mProps().testId}
          data-test-sub-id={mProps().testSubId}
        >
          <Icon name={mProps().iconName} size={iconSize[mProps().size]} />
        </button>
      </Show>
      <Show when={mProps().componentType === IconButtonComponentType.Link}>
        <a
          href={mProps().link}
          class={`iconButton iconButton_${mProps().theme} iconButton_${mProps().size}`}
          classList={{
            iconButton_disabled: mProps().isDisabled,
            iconButton_loading: mProps().isLoading,
          }}
          title={mProps().ariaLabel}
          aria-label={mProps().ariaLabel}
          data-test-id={mProps().testId}
          data-test-sub-id={mProps().testSubId}
        >
          <Icon name={mProps().iconName} size={iconSize[mProps().size]} />
        </a>
      </Show>
    </>
  );
};
