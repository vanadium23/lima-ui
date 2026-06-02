import { type JSX, mergeProps } from "solid-js";

import "./marketingReviewCard.css";

export enum MarketingReviewCardTheme {
  Primary = "primary",
}

export enum MarketingReviewCardSize {
  Medium = "medium",
}

type MarketingReviewCardProps = {
  theme?: MarketingReviewCardTheme;
  size?: MarketingReviewCardSize;
  children: JSX.Element;
  thumbnail: JSX.Element;
};

export const MarketingReviewCard = (props: MarketingReviewCardProps) => {
  const mProps: Required<MarketingReviewCardProps> = mergeProps(
    {
      theme: MarketingReviewCardTheme.Primary,
      size: MarketingReviewCardSize.Medium,
    },
    props,
  );

  return (
    <div
      class="marketingReviewCard"
      classList={{
        [`marketingReviewCard_${mProps.size}`]: true,
        [`marketingReviewCard_${mProps.theme}`]: true,
      }}
    >
      <div class="marketingReviewCard_thumbnail">{mProps.thumbnail}</div>
      <div class="marketingReviewCard_content">{mProps.children}</div>
    </div>
  );
};
