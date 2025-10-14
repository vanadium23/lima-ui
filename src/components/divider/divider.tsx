import { mergeProps } from "solid-js";

import "./divider.css";

export enum DividerTheme {
  Primary = "primary",
}

export enum DividerSize {
  Medium = "medium",
}

export enum DividerOrientation {
  Horizontal = "horizontal",
  Vertical = "vertical",
}

type DividerProps = {
  theme?: DividerTheme;
  size?: DividerSize;
  orientation?: DividerOrientation;
};

export const Divider = (props: DividerProps) => {
  const mProps: Required<DividerProps> = mergeProps(
    {
      theme: DividerTheme.Primary,
      size: DividerSize.Medium,
      orientation: DividerOrientation.Horizontal,
    },
    props,
  );

  return (
    <hr
      role="separator"
      aria-orientation={mProps.orientation}
      class="divider"
      classList={{
        [`divider_${mProps.size}`]: true,
        [`divider_${mProps.theme}`]: true,
        [`divider_${mProps.orientation}`]: true,
      }}
    />
  );
};
