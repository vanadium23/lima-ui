import { mergeProps } from "solid-js";

import "./marketingNavItem.css";

export enum MarketingNavItemTheme {
  Primary = "primary",
}

export enum MarketingNavItemSize {
  Medium = "medium",
  Small = "small",
}

type MarketingNavItemProps = {
  theme?: MarketingNavItemTheme;
  size?: MarketingNavItemSize;
  children: string;
  href: string;
  active?: boolean;
};

export const MarketingNavItem = (props: MarketingNavItemProps) => {
  const mProps: Required<MarketingNavItemProps> = mergeProps(
    {
      theme: MarketingNavItemTheme.Primary,
      size: MarketingNavItemSize.Medium,
      active: false,
    },
    props,
  );

  return (
    <a
      href={mProps.href}
      role="menuitem"
      class="marketingNavItem"
      classList={{
        [`marketingNavItem_${mProps.size}`]: true,
        [`marketingNavItem_${mProps.theme}`]: true,
        marketingNavItem_active: mProps.active,
      }}
    >
      <span class="marketingNavItem__text">{mProps.children}</span>
    </a>
  );
};
