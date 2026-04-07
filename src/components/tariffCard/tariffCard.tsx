import { createSignal, For, mergeProps, Show } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Button } from "../button/button.tsx";
import { Dialog } from "../dialog/dialog.tsx";
import type { Testable } from "../utilities/testable.ts";

import { TariffCardBenefit, type TariffCardBenefitProps } from "./components/tariffCardBenefit/tariffCardBenefit.tsx";
import { TariffCardPrice, TariffCardPriceTheme } from "./components/tariffCardPrice/tariffCardPrice.tsx";
import { TariffCardTag } from "./components/tariffCardTag/tariffCardTag.tsx";
import "./tariffCard.css";

export enum TariffCardTheme {
  Primary = "primary",
  Secondary = "secondary",
}

export enum TariffCardSize {
  Medium = "medium",
}

type TariffCardProps = {
  theme?: TariffCardTheme;
  size?: TariffCardSize;
  popular?: boolean;
  handleClick?: () => void;
  title: string;
  benefits: TariffCardBenefitProps[];
  monthPrice: string;
  yearPrice?: string;
  current?: boolean;
};

export const TariffCard = (props: Testable<TariffCardProps>) => {
  const [isDialogOpen, setDialogOpen] = createSignal(false);

  const mProps: Testable<Required<TariffCardProps>> = mergeProps(
    {
      theme: TariffCardTheme.Primary,
      size: TariffCardSize.Medium,
      popular: false,
      yearPrice: "",
      current: false,
      handleClick: () => {},
    },
    props,
  );

  return (
    <div
      class="tariffCard"
      classList={{
        [`tariffCard_${mProps.size}`]: true,
        [`tariffCard_${mProps.theme}`]: true,
        [`tariffCard_popular`]: mProps.popular,
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="tariffCard__top">
        <div class="tariffCard__header">
          <span class="tariffCard__title">{mProps.title}</span>
          <TariffCardTag active={mProps.popular}>Популярный</TariffCardTag>
        </div>
        <ul class="tariffCard__benefits">
          <For each={mProps.benefits}>
            {(benefit) => <TariffCardBenefit theme={benefit.theme} text={benefit.text} />}
          </For>
        </ul>
      </div>
      <div class="tariffCard__bottom">
        <div class="tariffCard__prices">
          <TariffCardPrice theme={TariffCardPriceTheme.DefaultPrice}>{mProps.monthPrice}</TariffCardPrice>
          <span class="tariffCard__unit">/ мес.</span>
        </div>
        <Show when={mProps.yearPrice}>
          <div class="tariffCard__prices">
            <TariffCardPrice theme={TariffCardPriceTheme.OldPrice}>{mProps.monthPrice}</TariffCardPrice>
            <TariffCardPrice theme={TariffCardPriceTheme.SalePrice}>{mProps.yearPrice}</TariffCardPrice>
            <span class="tariffCard__unit">/ мес.*</span>
            <span class="tariffCard__legend">*при оплате за год</span>
          </div>
        </Show>
        <Button disabled={mProps.current} testId={DEFAULT_TEST_ID} handleClick={() => setDialogOpen(true)}>
          {mProps.current ? "Подключен" : "Перейти"}
        </Button>
      </div>

      <Dialog open={isDialogOpen()} onCancel={() => setDialogOpen(false)} title={mProps.title} testId={DEFAULT_TEST_ID}>
        <div />
      </Dialog>
    </div>
  );
};
