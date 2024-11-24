import { type Component, mergeProps } from "solid-js";
import "./toolsButton.css";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";

export enum ToolsButtonTheme {
  Primary = "primary",
  Dangerous = "dangerous",
}

export enum ToolsButtonSize {
  Medium = "medium",
}

type ToolsButtonProps = {
  iconName: IconName;
  isDisabled?: boolean;
  theme: ToolsButtonTheme;
  size: ToolsButtonSize;
  handleClick?: () => void;
  text: string;
};

export const ToolsButton: Component<Testable<ToolsButtonProps>> = (props) => {
  const mProps: Testable<Required<ToolsButtonProps>> = mergeProps(
    {
      isDisabled: false,
      handleClick: () => {},
    },
    props,
  );

  const iconSize = {
    [ToolsButtonSize.Medium]: IconSize.Medium,
  };

  return (
    <button
      type="button"
      onClick={() => {
        mProps.handleClick();
      }}
      class={`toolsButton toolsButton_${mProps.theme} toolsButton_${mProps.size}`}
      classList={{
        toolsButton_disabled: mProps.isDisabled,
      }}
      disabled={mProps.isDisabled}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="toolsButton__iconWrapper">
        <div class="toolsButton__icon">
          <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
        </div>
      </div>

      <span class="toolsButton__text">{mProps.text}</span>
    </button>
  );
};
