import { type Component, type JSX, mergeProps } from "solid-js";
import "./toolsPanel.css";
import type { Testable } from "../../components/utilities/testable.ts";
import { isHidden } from "../../state/toolsPanelState.ts";

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

export const ToolsPanel: Component<Testable<ToolsPanelProps>> = (props) => {
  const mProps: Testable<Required<ToolsPanelProps>> = mergeProps(
    { theme: ToolsPanelTheme.Primary, size: ToolsPanelSize.Medium },
    props,
  );

  return (
    <div
      class={`toolsPanel toolsPanel_${mProps.theme} toolsPanel_${mProps.size}`}
      classList={{
        toolsPanel_hidden: isHidden(),
      }}
      data-test-id={mProps.testId}
    >
      {mProps.children}
    </div>
  );
};
