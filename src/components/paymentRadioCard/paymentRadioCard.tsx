import { Match, mergeProps, Show, Switch } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { Price, PriceSize, PriceTheme } from "../price/price.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./paymentRadioCard.css";

export enum PaymentRadioCardTheme {
  Primary = "primary",
}

export enum PaymentRadioCardSize {
  Medium = "medium",
}

type PaymentRadioCardProps = {
  theme?: PaymentRadioCardTheme;
  size?: PaymentRadioCardSize;
  title: string;
  price: number;
  salePrice?: number;
  groupName: string;
  checked?: boolean;
  onChange?: (value: string) => void;
};

export const PaymentRadioCard = (props: Testable<PaymentRadioCardProps>) => {
  const mProps: Testable<Required<PaymentRadioCardProps>> = mergeProps(
    {
      theme: PaymentRadioCardTheme.Primary,
      size: PaymentRadioCardSize.Medium,
      salePrice: 0,
      checked: false,
      onChange: () => {},
    },
    props,
  );

  const yearPrice = () => mProps.salePrice * 12;

  return (
    <label
      class="paymentRadioCard"
      classList={{
        [`paymentRadioCard_${mProps.size}`]: true,
        [`paymentRadioCard_${mProps.theme}`]: true,
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <input
        class="paymentRadioCard__input"
        type="radio"
        name={mProps.groupName}
        value={String(mProps.salePrice || mProps.price)}
        checked={mProps.checked}
        onChange={() => mProps.onChange(String(mProps.salePrice || mProps.price))}
      />
      <span class="paymentRadioCard__header">
        <span class="paymentRadioCard__title">{mProps.title}</span>

        <span class="paymentRadioCard__indicator">
          <Icon name={IconName.CheckCircle} size={IconSize.Medium} />
        </span>
      </span>
      <span class="paymentRadioCard__inner">
        <Switch>
          <Match when={mProps.salePrice > 0}>
            <span class="paymentRadioCard__value">
              <Price theme={PriceTheme.Default} size={PriceSize.Small}>
                {yearPrice()}
              </Price>
              <span class="paymentRadioCard__unit">/ год с автопродлением</span>
            </span>
          </Match>
          <Match when={mProps.salePrice === 0}>
            <span class="paymentRadioCard__value">
              <Price theme={PriceTheme.Default} size={PriceSize.Small}>
                {mProps.price}
              </Price>
              <span class="paymentRadioCard__unit">/ мес. с автопродлением</span>
            </span>
          </Match>
        </Switch>
        <Show when={mProps.salePrice > 0}>
          <span class="paymentRadioCard__sale">
            <span class="paymentRadioCard__value">
              <span class="paymentRadioCard__unit">Выгодно: </span>
              <Price theme={PriceTheme.Old} size={PriceSize.Small}>
                {mProps.price}
              </Price>
              <Price theme={PriceTheme.Sale} size={PriceSize.Small}>
                {mProps.salePrice}
              </Price>
              <span class="paymentRadioCard__unit">/ мес.* </span>
            </span>
            <span class="paymentRadioCard__legend">*при оплате за год</span>
          </span>
        </Show>
      </span>
    </label>
  );
};
