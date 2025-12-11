import { type JSX, mergeProps } from "solid-js";

import { buildErrorCloseButtonTestId } from "../../../features/testIds.ts";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonSize, IconButtonTheme } from "../iconButton/iconButton.tsx";
import type { Testable } from "../utilities/testable";

import "./pushNotification.css";

export enum PushNotificationTheme {
  Primary = "primary",
  Dangerous = "dangerous",
  Successful = "successful",
}

export enum PushNotificationSize {
  Medium = "medium",
}

type PushNotificationProps = {
  title: string;
  description: JSX.Element;
  theme: PushNotificationTheme;
  size?: PushNotificationSize;
  iconName: IconName;
  onClose?: () => void;
};

export const PushNotification = (props: Testable<PushNotificationProps>) => {
  const mProps: Testable<Required<PushNotificationProps>> = mergeProps(
    {
      size: PushNotificationSize.Medium,
      onClose: () => {},
    },
    props,
  );

  return (
    <div
      class="pushNotification"
      classList={{
        [`pushNotification_${mProps.size}`]: true,
        [`pushNotification_${mProps.theme}`]: true,
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
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
              handleClick={mProps.onClose}
              testId={buildErrorCloseButtonTestId(mProps.testId)}
              testSubId={mProps.testSubId ?? ""}
            />
          </div>
        </div>
        <span class="pushNotification__text">{mProps.description}</span>
      </div>
    </div>
  );
};
