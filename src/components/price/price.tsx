import { mergeProps } from "solid-js";

import "./price.css";

export enum PriceTheme {
  DefaultPrice = "defaultPrice",
  OldPrice = "oldPrice",
  SalePrice = "salePrice",
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
      theme: PriceTheme.DefaultPrice,
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
