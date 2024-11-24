import { type Component, createSignal, mergeProps } from "solid-js";
import "./toggleIconButton.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";

export enum ToggleIconButtonTheme {
  Secondary = "secondary",
}

export enum ToggleIconButtonSize {
  Medium = "medium",
}

type ToggleIconButtonProps = {
  iconName: IconName;
  isDisabled?: boolean;
  ariaLabel: string;
  theme: ToggleIconButtonTheme;
  size: ToggleIconButtonSize;
  defaultIsToggled?: boolean;
  setGlobalToggled: (isToggled: boolean) => void;
};

export const ToggleIconButton: Component<Testable<ToggleIconButtonProps>> = (
  props,
) => {
  const mProps: Testable<Required<ToggleIconButtonProps>> = mergeProps(
    {
      isDisabled: false,
      defaultIsToggled: false,
    },
    props,
  );

  const [getToggled, setToggled] = createSignal(mProps.defaultIsToggled);

  const toggleToggled = () => {
    const isToggled = !getToggled();
    setToggled(isToggled);
    mProps.setGlobalToggled(isToggled);
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
        toggleIconButton_toggled: getToggled(),
      }}
      title={mProps.ariaLabel}
      disabled={mProps.isDisabled}
      aria-label={mProps.ariaLabel}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
      aria-pressed={getToggled()}
    >
      <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
    </button>
  );
};
