import { mergeProps } from "solid-js";
import { Icon, IconName, IconSize } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";
import "./dragHandle.css";

export enum DragHandleTheme {
  Primary = "primary",
}

export enum DragHandleSize {
  Medium = "medium",
}

type DragHandleProps = {
  theme?: DragHandleTheme;
  size?: DragHandleSize;
  isDisabled?: boolean;
  handleClick?: () => void;
  icon: IconName;
};

export const DragHandle = (props: Testable<DragHandleProps>) => {
  const mProps: Testable<Required<DragHandleProps>> = mergeProps(
    {
      theme: DragHandleTheme.Primary,
      size: DragHandleSize.Medium,
      isDisabled: false,
      isLoading: false,
      handleClick: () => {},
    },
    props,
  );

  return (
    <button
      type="button"
      class={`dragHandle dragHandle_${mProps.theme} dragHandle_${mProps.size}`}
      classList={{
        dragHandle_disabled: mProps.isDisabled,
      }}
      disabled={mProps.isDisabled}
      onClick={() => {
        mProps.handleClick();
      }}
      data-test-id={mProps.testId}
      aria-label="Перетаскивание"
      title={"Перетаскивание"}
      tabIndex={-1}
    >
      <Icon name={mProps.icon} size={IconSize.Medium} />
    </button>
  );
};
