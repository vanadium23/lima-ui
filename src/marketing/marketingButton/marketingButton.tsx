import { type JSX, mergeProps } from "solid-js";

import "./marketingButton.css";

export enum MarketingButtonTheme {
  Primary = "primary",
  Secondary = "secondary",
  Tertiary = "tertiary",
}

export enum MarketingButtonSize {
  Medium = "medium",
  Small = "small",
}

export enum MarketingButtonType {
  Button = "button",
  Submit = "submit",
  Reset = "reset",
}

type MarketingButtonProps = {
  theme?: MarketingButtonTheme;
  size?: MarketingButtonSize;
  form?: string | undefined;
  type?: MarketingButtonType;
  handleClick?: () => void;
  children: JSX.Element;
};

export const MarketingButton = (props: MarketingButtonProps) => {
  const mProps: Required<MarketingButtonProps> = mergeProps(
    {
      theme: MarketingButtonTheme.Primary,
      size: MarketingButtonSize.Medium,
      type: MarketingButtonType.Button,
      form: undefined,
      handleClick: () => {},
    },
    props,
  );

  return (
    <button
      type={mProps.type}
      class="marketingButton"
      classList={{
        [`marketingButton_${mProps.size}`]: true,
        [`marketingButton_${mProps.theme}`]: true,
      }}
      form={mProps.form}
      onClick={() => {
        mProps.handleClick();
      }}
    >
      <span class="marketingButton__text">{mProps.children}</span>
    </button>
  );
};
