import { mergeProps, Show } from "solid-js";

import { SIGN_OUT_BUTTON, USER_BADGE } from "../../../features/testIds.ts";
import { logout } from "../../widgets/auth/services/logout.ts";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton } from "../iconButton/iconButton.tsx";

import "./userBadge.css";

export enum UserBadgeTheme {
  Primary = "primary",
}

export enum UserBadgeSize {
  Medium = "medium",
}

type UserBadgeProps = {
  children: string;
  tariff: "base" | "professional"; /* TODO Когда вмержится ET-144 можно будет оттуда подтянуть тип */
  error?: boolean;
  theme?: UserBadgeTheme;
  size?: UserBadgeSize;
};

export const UserBadge = (props: UserBadgeProps) => {
  const mProps: Required<UserBadgeProps> = mergeProps(
    {
      theme: UserBadgeTheme.Primary,
      size: UserBadgeSize.Medium,
      error: false,
    },
    props,
  );

  return (
    <div
      class="userBadge"
      classList={{
        [`userBadge_${mProps.size}`]: true,
        [`userBadge_${mProps.theme}`]: true,
      }}
    >
      <a class="userBadge__link" href="/account" data-test-id={USER_BADGE}>
        <span class="userBadge__capital">{mProps.children?.[0]}</span>
        <span class="userBadge__wrapper">
          <span class="userBadge__userName">{mProps.children}</span>
          <span class="userBadge__tariffWrapper">
            <span class="userBadge__tariff">{mProps.tariff === "base" ? "Базовый" : "Профессиональный"}</span>
            <Show when={mProps.error}>
              <span class="userBadge__error">
                <Icon name={IconName.Warning} size={IconSize.ExtraSmall} />
              </span>
            </Show>
          </span>
        </span>
      </a>
      <IconButton
        iconName={IconName.SignOut}
        ariaLabel="Выйти из аккаунта"
        testId={SIGN_OUT_BUTTON}
        handleClick={logout}
      />
    </div>
  );
};
