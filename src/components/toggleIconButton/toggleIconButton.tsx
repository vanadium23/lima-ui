import { mergeProps } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./toggleIconButton.css";

export enum ToggleIconButtonTheme {
  Secondary = "secondary",
}

export enum ToggleIconButtonSize {
  Medium = "medium",
}

type ToggleIconButtonProps = {
  theme?: ToggleIconButtonTheme;
  size?: ToggleIconButtonSize;
  iconName: IconName;
  disabled?: boolean;
  ariaLabel: string;
  toggled: boolean;
  setGlobalToggled: (isToggled: boolean) => void;
  id?: string;
};

export const ToggleIconButton = (props: Testable<ToggleIconButtonProps>) => {
  const mProps: Testable<Required<ToggleIconButtonProps>> = mergeProps(
    {
      theme: ToggleIconButtonTheme.Secondary,
      size: ToggleIconButtonSize.Medium,
      disabled: false,
      id: "",
    },
    props,
  );

  const toggleToggled = () => {
    if (!mProps.disabled) {
      mProps.setGlobalToggled(!mProps.toggled);
    }
  };

  const iconSize = {
    [ToggleIconButtonSize.Medium]: IconSize.Medium,
  };

  return (
    <button
      type="button"
      onClick={toggleToggled}
      class={`toggleIconButton toggleIconButton_${mProps.disabled ? "disabled" : mProps.theme} toggleIconButton_${mProps.size}`}
      classList={{
        toggleIconButton_toggled: mProps.toggled,
      }}
      title={mProps.ariaLabel}
      disabled={mProps.disabled}
      aria-label={mProps.ariaLabel}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
      aria-pressed={mProps.toggled}
      id={mProps.id}
    >
      <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
    </button>
  );
};
