import { type JSX, mergeProps } from "solid-js";

import "./marketingTitle.css";

export enum MarketingTitleTheme {
  Primary = "primary",
}

export enum MarketingTitleSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export enum MarketingTitlePosition {
  Left = "left",
  Center = "center",
}

type MarketingTitleProps = {
  theme?: MarketingTitleTheme;
  size?: MarketingTitleSize;
  position?: MarketingTitlePosition;
  children: JSX.Element;
};

export const MarketingTitle = (props: MarketingTitleProps) => {
  const mProps: Required<MarketingTitleProps> = mergeProps(
    {
      theme: MarketingTitleTheme.Primary,
      size: MarketingTitleSize.Medium,
      position: MarketingTitlePosition.Left,
    },
    props,
  );

  return (
    <h1
      class="marketingTitle"
      classList={{
        [`marketingTitle_${mProps.size}`]: true,
        [`marketingTitle_${mProps.theme}`]: true,
        [`marketingTitle_${mProps.position}`]: true,
      }}
    >
      {mProps.children}
    </h1>
  );
};
