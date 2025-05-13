import { type JSX, mergeProps } from "solid-js";

import type { Testable } from "../../components/utilities/testable.ts";
import { panelState } from "../../state/sidebarsStateManager.ts";

import "./toolsPanel.css";

export enum ToolsPanelTheme {
  Primary = "primary",
}

export enum ToolsPanelSize {
  Medium = "medium",
}

type ToolsPanelProps = {
  theme?: ToolsPanelTheme;
  size?: ToolsPanelSize;
  children: JSX.Element;
};

export const ToolsPanel = (props: Testable<ToolsPanelProps>) => {
  const mProps: Testable<Required<ToolsPanelProps>> = mergeProps(
    { theme: ToolsPanelTheme.Primary, size: ToolsPanelSize.Medium },
    props,
  );

  return (
    <div
      class={`toolsPanel toolsPanel_${mProps.theme} toolsPanel_${mProps.size}`}
      classList={{
        toolsPanel_hidden: panelState.isToolsPanelHidden(),
      }}
      data-test-id={mProps.testId}
    >
      {mProps.children}
    </div>
  );
};
