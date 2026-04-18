import { mergeProps } from "solid-js";

import { Icon, IconSize } from "../../../icon/icon.tsx";
import { IconName } from "../../../icon/types.ts";

import "./tariffCardBenefit.css";

export enum TariffCardBenefitTheme {
  Default = "default",
  Additional = "additional",
}

export enum TariffCardBenefitSize {
  Medium = "medium",
}

export type TariffCardBenefitProps = {
  theme: TariffCardBenefitTheme;
  size?: TariffCardBenefitSize;
  text: string;
};

export const TariffCardBenefit = (props: TariffCardBenefitProps) => {
  const mProps: Required<TariffCardBenefitProps> = mergeProps(
    {
      size: TariffCardBenefitSize.Medium,
    },
    props,
  );

  function icon() {
    if (mProps.theme === TariffCardBenefitTheme.Default) {
      return IconName.SealCheck;
    } else {
      return IconName.Fire;
    }
  }

  return (
    <li
      class="tariffCardBenefit"
      classList={{
        [`tariffCardBenefit_${mProps.size}`]: true,
        [`tariffCardBenefit_${mProps.theme}`]: true,
      }}
    >
      <div class="tariffCardBenefit__icon">
        <Icon name={icon()} size={IconSize.Large} />
      </div>
      <span class="tariffCardBenefit__text">{mProps.text}</span>
    </li>
  );
};
