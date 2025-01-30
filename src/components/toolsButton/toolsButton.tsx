import { mergeProps, Show } from "solid-js";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
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
  componentType?: ToolsButtonComponentType;
  iconName: IconName;
  isDisabled?: boolean;
  theme: ToolsButtonTheme;
  size: ToolsButtonSize;
  handleClick?: () => void;
  text: string;
  openInNewTab?: boolean;
  link?: string;
};

export const ToolsButton = (props: Testable<ToolsButtonProps>) => {
  const mProps: Testable<Required<ToolsButtonProps>> = mergeProps(
    {
      componentType: ToolsButtonComponentType.Button,
      isDisabled: false,
      openInNewTab: false,
      link: "",
      handleClick: () => { },
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
      </Show>
      <Show when={mProps.componentType === ToolsButtonComponentType.Link}>
        <a
          href={!mProps.isDisabled ? mProps.link : "#"}
          target={mProps.openInNewTab ? "_blank" : "_self"}
          rel={mProps.openInNewTab ? "noopener noreferrer" : ""}
          class={`toolsButton toolsButton_${mProps.theme} toolsButton_${mProps.size}`}
          classList={{
            toolsButton_disabled: mProps.isDisabled,
          }}
          aria-disabled={mProps.isDisabled}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <div class="toolsButton__iconWrapper">
            <div class="toolsButton__icon">
              <Icon name={mProps.iconName} size={iconSize[mProps.size]} />
            </div>
          </div>

          <span class="toolsButton__text">{mProps.text}</span>
        </a>
      </Show>
    </>
  );
};
