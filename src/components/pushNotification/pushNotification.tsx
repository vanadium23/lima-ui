import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds";
import { Icon, IconName } from "../icon/icon";
import { IconButton, IconButtonSize, IconButtonTheme } from "../iconButton/iconButton";
import type { Testable } from "../utilities/testable";

import "./pushNotification.css";

enum PushNotificationTheme {
  Dangerous = "dangerous",
}

type PushNotification = {
  image: string,
  isOpen: string,
  title: string,
  description: string,
  theme: PushNotificationTheme
  onCloseNotification: () => void;
}

export const PushNotification = (props: Testable<PushNotification>) => {
  const mProps: Testable<Required<PushNotification>> = mergeProps({
    isOpen: false,
    title: "Ошибка",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.Dolore, beatae.",
    onCloseNotification: () => { },
    theme: "dangerous"
  }, props);

  return (
    <div class="pushNotification">
      <div class="pushNotification__wrapper">
        <div class={`pushNotification__icon pushNotification__icon_${mProps.theme}`}>
          <Icon name={IconName.GlobeSimpleX} />
        </div>
        <div class="pushNotification__body">
          <h4 class="pushNotification__title">{mProps.title}</h4>
          <p class="pushNotification__description">{mProps.description}</p>
        </div>
      </div>
      <div class="pushNotification__closeBtn">
        <IconButton
          theme={IconButtonTheme.Primary}
          size={IconButtonSize.MediumEmbedded}
          iconName={IconName.X}
          ariaLabel={`Закрыть диалоговое окно ${mProps.title}`}
          handleClick={() => {
            mProps.onCloseNotification();
          }}
          testId={DEFAULT_TEST_ID}
          testSubId={mProps.testSubId ?? ""} />
      </div>
    </div>
  );
};