import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds";
import { Icon, IconName, IconSize } from "../icon/icon";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton";
import type { Testable } from "../utilities/testable";

import "./pushNotification.css";

export enum PushNotificationTheme {
  Dangerous = "dangerous",
}

export enum PushNotificationSize {
  Medium = "medium",
}

type PushNotification = {
  isOpen?: boolean;
  title: string;
  description: string;
  theme?: PushNotificationTheme;
  size?: PushNotificationSize;
  iconName: IconName;
  onClose?: () => void;
};

export const PushNotification = (props: Testable<PushNotification>) => {
  const mProps: Testable<Required<PushNotification>> = mergeProps(
    {
      isOpen: true,
      theme: PushNotificationTheme.Dangerous,
      size: PushNotificationSize.Medium,
      onClose: () => {},
    },
    props,
  );

  const handleClose = () => {
    mProps.onClose?.();
  };

  return (
    <div
      class={`pushNotification pushNotification_${mProps.theme} pushNotification_${mProps.size}`}
    >
      <div class="pushNotification__iconWrapper">
        <div class="pushNotification__icon">
          <Icon name={mProps.iconName} size={IconSize.Large} />
        </div>
      </div>
      <div class="pushNotification__inner">
        <div class="pushNotification__header">
          <span class="pushNotification__title">{mProps.title}</span>
          <div class="pushNotification__close">
            <IconButton
              theme={IconButtonTheme.Primary}
              size={IconButtonSize.MediumEmbedded}
              iconName={IconName.X}
              ariaLabel={`Закрыть уведомление ${mProps.title}`}
              handleClick={handleClose}
              testId={DEFAULT_TEST_ID}
              testSubId={mProps.testSubId ?? ""}
            />
          </div>
        </div>
        <span class="pushNotification__text">{mProps.description}</span>
      </div>
    </div>
  );
};
