import { mergeProps } from "solid-js";

import { Icon, IconName, IconSize } from "../icon/icon.tsx";
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
  isDisabled?: boolean;
  ariaLabel: string;
  isToggled: boolean;
  setGlobalToggled: (isToggled: boolean) => void;
  id?: string;
};

export const ToggleIconButton = (props: Testable<ToggleIconButtonProps>) => {
  const mProps: Testable<Required<ToggleIconButtonProps>> = mergeProps(
    {
      theme: ToggleIconButtonTheme.Secondary,
      size: ToggleIconButtonSize.Medium,
      isDisabled: false,
      id: "",
    },
    props,
  );

  const toggleToggled = () => {
    if (!mProps.isDisabled) {
      mProps.setGlobalToggled(!mProps.isToggled);
    }
  };

  const iconSize = {
    [ToggleIconButtonSize.Medium]: IconSize.Medium,
  };

  return (
    <button
      type="button"
      onClick={toggleToggled}
      class={`toggleIconButton toggleIconButton_${mProps.theme} toggleIconButton_${mProps.size}`}
      classList={{
        toggleIconButton_disabled: mProps.isDisabled,
        toggleIconButton_toggled: mProps.isToggled,
      }}
      title={mProps.ariaLabel}
      disabled={mProps.isDisabled}
      aria-label={mProps.ariaLabel}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
      aria-pressed={mProps.isToggled}
      id={mProps.id}
    >
      <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
    </button>
  );
};
