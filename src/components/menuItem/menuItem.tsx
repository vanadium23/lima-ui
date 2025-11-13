import { Match, mergeProps, Switch } from "solid-js";

import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import type { Testable } from "../utilities/testable.ts";

import "./menuItem.css";

export enum MenuItemTheme {
  Primary = "primary",
  Dangerous = "dangerous",
}

export enum MenuItemSize {
  Medium = "medium",
}

export enum MenuItemComponentType {
  Button = "button",
  Link = "link",
}

export type MenuItemProps = {
  theme?: MenuItemTheme;
  size?: MenuItemSize;
  componentType?: MenuItemComponentType;
  href?: string;
  disabled?: boolean | undefined;
  children: string;
  handleClick?: () => void;
  icon: IconName;
};

export const MenuItem = (props: Testable<MenuItemProps>) => {
  const mProps: Testable<Required<MenuItemProps>> = mergeProps(
    {
      theme: MenuItemTheme.Primary,
      size: MenuItemSize.Medium,
      href: "",
      componentType: MenuItemComponentType.Button,
      disabled: false,
      handleClick: () => {},
    },
    props,
  );

  return (
    <li
      role="none"
      class="menuItem"
      classList={{
        [`menuItem_${mProps.size}`]: true,
        [`menuItem_${mProps.theme}`]: !mProps.disabled,
        menuItem_disabled: mProps.disabled,
      }}
    >
      <Switch>
        <Match when={mProps.componentType === MenuItemComponentType.Link && !mProps.disabled}>
          <a
            class="menuItem__button"
            role="menuitem"
            href={mProps.href}
            data-test-id={mProps.testId}
            data-test-sub-id={mProps.testSubId}
          >
            <Icon name={mProps.icon} size={IconSize.Small} />
            <span class="menuItem__text">{mProps.children}</span>
          </a>
        </Match>
        <Match when={mProps.componentType === MenuItemComponentType.Link && mProps.disabled}>
          <span
            class="menuItem__button"
            role="menuitem"
            aria-disabled={mProps.disabled}
            data-test-id={mProps.testId}
            data-test-sub-id={mProps.testSubId}
          >
            <Icon name={mProps.icon} size={IconSize.Small} />
            <span class="menuItem__text">{mProps.children}</span>
          </span>
        </Match>
        <Match when={mProps.componentType === MenuItemComponentType.Button}>
          <button
            type="button"
            class="menuItem__button"
            role="menuitem"
            disabled={mProps.disabled}
            onClick={() => {
              mProps.handleClick();
            }}
            data-test-id={mProps.testId}
            data-test-sub-id={mProps.testSubId}
          >
            <Icon name={mProps.icon} size={IconSize.Small} />
            <span class="menuItem__text">{mProps.children}</span>
          </button>
        </Match>
      </Switch>
    </li>
  );
};
