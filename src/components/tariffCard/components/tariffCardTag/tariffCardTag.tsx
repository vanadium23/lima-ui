import { type JSX, mergeProps } from "solid-js";

import "./tariffCardTag.css";

export enum TariffCardTagTheme {
  Primary = "primary",
}

export enum TariffCardTagSize {
  Medium = "medium",
}

type TariffCardTagProps = {
  theme?: TariffCardTagTheme;
  size?: TariffCardTagSize;
  active: boolean;
  children: JSX.Element;
};

export const TariffCardTag = (props: TariffCardTagProps) => {
  const mProps: Required<TariffCardTagProps> = mergeProps(
    {
      theme: TariffCardTagTheme.Primary,
      size: TariffCardTagSize.Medium,
    },
    props,
  );

  return (
    <span
      class="tariffCardTag"
      classList={{
        [`tariffCardTag_${mProps.size}`]: true,
        [`tariffCardTag_${mProps.theme}`]: true,
        [`tariffCardTag_hidden`]: !mProps.active,
      }}
    >
      {mProps.children}
    </span>
  );
};
