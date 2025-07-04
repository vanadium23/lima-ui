import { mergeProps } from "solid-js";

import { USER_BUTTON } from "../../../features/testIds";

import "./userButton.css";

export enum UserButtonTheme {
  Primary = "primary",
}

export enum UserButtonSize {
  Medium = "medium",
}

type UserButtonProps = {
  userName: string;
  theme?: UserButtonTheme;
  size?: UserButtonSize;
};

export const UserButton = (props: UserButtonProps) => {
  const mProps: Required<UserButtonProps> = mergeProps(
    {
      theme: UserButtonTheme.Primary,
      size: UserButtonSize.Medium,
    },
    props,
  );

  return (
    <button class="userButton" type="button" data-test-id={USER_BUTTON}>
      <span class="userButton__capital">{mProps.userName?.[0]}</span>
      <span class="userButton__userName">{mProps.userName}</span>
    </button>
  );
};
