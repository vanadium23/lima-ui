import { mergeProps } from "solid-js";

import type { Sortable } from "../../types/types.ts";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
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
  disabled?: boolean;
  handleClick?: () => void;
  dragHandle?: Sortable | null;
};

export const DragHandle = (props: Testable<DragHandleProps>) => {
  const mProps: Testable<Required<DragHandleProps>> = mergeProps(
    {
      theme: DragHandleTheme.Primary,
      size: DragHandleSize.Medium,
      disabled: false,
      handleClick: () => {},
      dragHandle: null,
    },
    props,
  );

  return (
    <button
      type="button"
      class={`dragHandle dragHandle_${mProps.disabled ? "disabled" : mProps.theme} dragHandle_${mProps.size}`}
      disabled={mProps.disabled}
      onClick={() => {
        mProps.handleClick();
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
      aria-label="Перетаскивание"
      title={"Перетаскивание"}
      tabIndex={-1}
      {...mProps.dragHandle?.dragActivators}
    >
      <Icon name={IconName.DotsSixVertical} size={IconSize.Medium} />
    </button>
  );
};
