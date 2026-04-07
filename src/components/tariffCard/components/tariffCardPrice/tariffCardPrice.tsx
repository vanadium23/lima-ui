import { type JSX, mergeProps } from "solid-js";

import "./tariffCardPrice.css";

export enum TariffCardPriceTheme {
  DefaultPrice = "defaultPrice",
  OldPrice = "oldPrice",
  SalePrice = "salePrice",
}

export enum TariffCardPriceSize {
  Medium = "medium",
}

type TariffCardPriceProps = {
  theme: TariffCardPriceTheme;
  size?: TariffCardPriceSize;
  children: JSX.Element;
};

export const TariffCardPrice = (props: TariffCardPriceProps) => {
  const mProps: Required<TariffCardPriceProps> = mergeProps(
    {
      theme: TariffCardPriceTheme.DefaultPrice,
      size: TariffCardPriceSize.Medium,
    },
    props,
  );

  return (
    <span
      class="tariffCardPrice"
      classList={{
        [`tariffCardPrice_${mProps.size}`]: true,
        [`tariffCardPrice_${mProps.theme}`]: true,
      }}
    >{`${mProps.children}₽`}</span>
  );
};
