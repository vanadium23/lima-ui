import { mergeProps } from "solid-js";

import { IconName, IconValues } from "./types.ts";
import "./icon.css";

export enum IconSize {
  ExtraSmall = "extraSmall",
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type IconProps = {
  name: IconName;
  size?: IconSize;
  role?: "img" | undefined /*TODO Необходимо описать в FE-документации*/;
  ariaLabel?: string | undefined;
};

export const Icon = (props: IconProps) => {
  const mProps: Required<IconProps> = mergeProps(
    {
      size: IconSize.Medium,
      role: undefined,
      ariaLabel: undefined,
    },
    props,
  );

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-id={IconValues[mProps.name]}
      class={`icon icon_${mProps.size}`}
      aria-hidden={!mProps.role}
      aria-label={mProps.ariaLabel}
      role={mProps.role}
      fill="currentColor"
      viewBox="0 0 256 256"
    >
      <path d={mProps.name} />
    </svg>
  );
};
