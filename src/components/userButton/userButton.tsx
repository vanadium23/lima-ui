import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds";
import type { Testable } from "../utilities/testable";

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
}

export const UserButton = (props: Testable<UserButtonProps>) => {
  const mProps: Testable<Required<UserButtonProps>> = mergeProps(
    {
      theme: UserButtonTheme.Primary,
      size: UserButtonSize.Medium,
    }
    , props
  );

  return (
    <button class='userButton' type='button' data-test-id={DEFAULT_TEST_ID}>
      <span class="userButton__capital">{mProps.userName?.[0]}</span>
      <span class="userButton__userName">{mProps.userName}</span>
    </button>
  );
};