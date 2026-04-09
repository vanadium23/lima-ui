import { createSignal, For, mergeProps, Show } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Button, ButtonTheme } from "../button/button.tsx";
import { Price, PriceTheme } from "../cardPrice/price.tsx";
import { Dialog, DialogTheme } from "../dialog/dialog.tsx";
import { Link } from "../link/link.tsx";
import { PaymentRadioCard } from "../paymentRadioCard/paymentRadioCard.tsx";
import type { Testable } from "../utilities/testable.ts";

import { TariffCardBenefit, type TariffCardBenefitProps } from "./components/tariffCardBenefit/tariffCardBenefit.tsx";
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
  title: string;
  popular?: boolean;
  benefits: TariffCardBenefitProps[];
  price: number;
  salePrice?: number;
  current?: boolean;
};

export const TariffCard = (props: Testable<TariffCardProps>) => {
  const [isPaymentDialogOpen, setPaymentDialogOpen] = createSignal(false);
  const [isFreePaymentDialogOpen, setFreePaymentDialogOpen] = createSignal(false);

  const mProps: Testable<Required<TariffCardProps>> = mergeProps(
    {
      theme: TariffCardTheme.Primary,
      size: TariffCardSize.Medium,
      popular: false,
      salePrice: 0,
      current: false,
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
          <Price theme={PriceTheme.DefaultPrice}>{mProps.price}</Price>
          <span class="tariffCard__unit">/ мес.</span>
        </div>
        <Show when={mProps.salePrice}>
          <div class="tariffCard__prices">
            <Price theme={PriceTheme.OldPrice}>{mProps.price}</Price>
            <Price theme={PriceTheme.SalePrice}>{mProps.salePrice}</Price>
            <span class="tariffCard__unit">/ мес.*</span>
            <span class="tariffCard__legend">*при оплате за год</span>
          </div>
        </Show>
        <Button
          disabled={mProps.current}
          testId={DEFAULT_TEST_ID}
          handleClick={() => (mProps.price === 0 ? setFreePaymentDialogOpen(true) : setPaymentDialogOpen(true))}
        >
          {mProps.current ? "Подключен" : "Перейти"}
        </Button>
      </div>

      <Dialog
        open={isPaymentDialogOpen()}
        onCancel={() => setPaymentDialogOpen(false)}
        title="Выберите вариант подписки"
        testId={DEFAULT_TEST_ID}
        theme={DialogTheme.Primary}
        controls={<Button testId={DEFAULT_TEST_ID}>К оплате</Button>}
      >
        <div class="tariffCard__dialogGrid" role="radiogroup" aria-label="Выберите срок оплаты подписки">
          <PaymentRadioCard
            title="Годовая подписка"
            price={mProps.price}
            salePrice={mProps.salePrice}
            groupName="paymentSubscribePeriod"
            checked={true}
            testId={DEFAULT_TEST_ID}
          />
          <PaymentRadioCard
            title="Ежемесячная подписка"
            price={mProps.price}
            groupName="paymentSubscribePeriod"
            testId={DEFAULT_TEST_ID}
          />
          <div class="trafficCard__dialogDescription">
            Совершая платёж, вы соглашаетесь с{" "}
            <Link href="#" testId={DEFAULT_TEST_ID}>
              условиями оказания услуг
            </Link>
            .<br />
            Подписку можно отменить в любой момент.
          </div>
        </div>
      </Dialog>

      <Dialog
        open={isFreePaymentDialogOpen()}
        onCancel={() => setFreePaymentDialogOpen(false)}
        title="Смена тарифа"
        testId={DEFAULT_TEST_ID}
        theme={DialogTheme.Primary}
        controls={
          <Button theme={ButtonTheme.Dangerous} testId={DEFAULT_TEST_ID}>
            Все равно перейти
          </Button>
        }
      >
        <p class="tariffCard__freeText">
          Перейдя на <b>"{mProps.title}"</b> тариф, вы больше не сможете:
          <br /> — преимущество 1,
          <br /> — преимущество 2,
          <br /> — преимущество 3.
          <br />
          <br /> Автопродление вашей текущей подписки будет остановлено, возможности тарифа «Профессиональный» доступны
          до окончания оплаченного периода.
        </p>
      </Dialog>
    </div>
  );
};
