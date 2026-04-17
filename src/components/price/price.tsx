import { mergeProps } from "solid-js";

import "./price.css";

export enum PriceTheme {
  Default = "default",
  Old = "old",
  Sale = "sale",
}

export enum PriceSize {
  Small = "small",
  Medium = "medium",
}

type PriceProps = {
  theme: PriceTheme;
  size?: PriceSize;
  children: number;
};

export const Price = (props: PriceProps) => {
  const mProps: Required<PriceProps> = mergeProps(
    {
      theme: PriceTheme.Default,
      size: PriceSize.Medium,
    },
    props,
  );

  return (
    <span
      class="price"
      classList={{
        [`price_${mProps.size}`]: true,
        [`price_${mProps.theme}`]: true,
      }}
    >{`${mProps.children}₽`}</span>
  );
};
