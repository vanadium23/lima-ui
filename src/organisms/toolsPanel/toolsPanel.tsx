import { type Component, type JSX, mergeProps } from "solid-js";
import "./toolsPanel.css";
import type { Testable } from "../../components/utilities/testable.ts";
import { isExpanded } from "../../state/toolsPanelState.ts";
import { logReturn } from "../../../features/utilities/logReturn.ts";

export enum ToolsPanelTheme {
  Primary = "primary",
}

export enum ToolsPanelSize {
  Medium = "medium",
}

type ToolsPanelProps = {
  theme: ToolsPanelTheme;
  size: ToolsPanelSize;
  children: JSX.Element;
};

export const ToolsPanel: Component<Testable<ToolsPanelProps>> = (props) => {
  const mProps: Testable<Required<ToolsPanelProps>> = mergeProps(props);

  return (
    <div
      class={`toolsPanel toolsPanel_${mProps.theme} toolsPanel_${mProps.size}`}
      classList={{
        toolsPanel_expanded: logReturn(isExpanded()),
      }}
      data-test-id={mProps.testId}
    >
      {mProps.children}
    </div>
  );
};
