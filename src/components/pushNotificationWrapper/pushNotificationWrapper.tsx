import { For, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { notificationState } from "../../state/pushNotificationStateManager.ts";
import {
  PushNotification,
  PushNotificationTheme,
} from "../pushNotification/pushNotification.tsx";

import "./pushNotificationWrapper.css";

export const PushNotificationWrapper = () => {
  return (
    <Show when={notificationState.notifications().length > 0}>
      <Portal>
        <div class="pushNotificationWrapper">
          <For each={notificationState.notifications()}>
            {(notification) => (
              <div class="pushNotificationWrapper__item">
                <PushNotification
                  title={notification.title}
                  description={notification.description}
                  iconName={notification.iconName}
                  theme={PushNotificationTheme.Dangerous}
                  onClose={() => notificationState.remove(notification.id)}
                  testId={notification.testId}
                  testSubId={notification.testSubId}
                />
              </div>
            )}
          </For>
        </div>
      </Portal>
    </Show>
  );
};
