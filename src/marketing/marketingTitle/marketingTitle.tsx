import { type JSX, mergeProps } from "solid-js";
import { Dynamic } from "solid-js/web";

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

export enum MarketingTitleTag {
  h1 = "h1",
  h2 = "h2",
  h3 = "h3",
  h4 = "h4",
  h5 = "h5",
}

type MarketingTitleProps = {
  tag?: MarketingTitleTag;
  theme?: MarketingTitleTheme;
  size?: MarketingTitleSize;
  position?: MarketingTitlePosition;
  children: JSX.Element;
};

export const MarketingTitle = (props: MarketingTitleProps) => {
  const mProps: Required<MarketingTitleProps> = mergeProps(
    {
      tag: MarketingTitleTag.h1,
      theme: MarketingTitleTheme.Primary,
      size: MarketingTitleSize.Medium,
      position: MarketingTitlePosition.Left,
    },
    props,
  );

  return (
    <Dynamic
      component={mProps.tag}
      class="marketingTitle"
      classList={{
        [`marketingTitle_${mProps.size}`]: true,
        [`marketingTitle_${mProps.theme}`]: true,
        [`marketingTitle_${mProps.position}`]: true,
      }}
    >
      {mProps.children}
    </Dynamic>
  );
};
