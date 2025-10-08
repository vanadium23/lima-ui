import { mergeProps, Show } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { prepareARIALabel } from "../utilities/prepareARIALabel.ts";
import type { Testable } from "../utilities/testable.ts";

import "./textButton.css";

export enum TextButtonTheme {
  Primary = "primary",
  Dangerous = "dangerous",
}

export enum TextButtonSize {
  Medium = "medium",
}

type TextButtonProps = {
  theme?: TextButtonTheme;
  size?: TextButtonSize;
  disabled?: boolean;
  ariaLabel?: string;
  children: string;
  loading?: boolean;
  handleClick?: () => void;
};

export const TextButton = (props: Testable<TextButtonProps>) => {
  const mProps: Testable<Required<TextButtonProps>> = mergeProps(
    {
      theme: TextButtonTheme.Primary,
      size: TextButtonSize.Medium,
      disabled: false,
      loading: false,
      ariaLabel: "",
      handleClick: () => {},
    },
    props,
  );

  const loadingIconSize = {
    [TextButtonSize.Medium]: IconSize.Medium,
  };

  return (
    <button
      type="button"
      class={`textButton textButton_${mProps.disabled ? "disabled" : mProps.theme} textButton_${mProps.size}`}
      classList={{
        textButton_loading: mProps.loading,
      }}
      disabled={mProps.disabled}
      aria-disabled={mProps.loading ? true : undefined}
      {...prepareARIALabel(mProps.ariaLabel)}
      onClick={() => {
        if (!mProps.loading) {
          mProps.handleClick();
        }
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <Show when={mProps.loading}>
        <div class="textButton__loadingIcon">
          <Icon name={IconName.CircleNotch} size={loadingIconSize[mProps.size]} />
        </div>
      </Show>
      <span class="textButton__text">{mProps.children}</span>
    </button>
  );
};
