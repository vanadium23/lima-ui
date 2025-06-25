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
    <Portal>
      <div class="pushNotificationWrapper">
        <Show when={notificationState.notifications().length > 0}>
          <For each={notificationState.notifications()}>
            {(notification) => (
              <div class="pushNotificationWrapper__item">
                <PushNotification
                  title={notification.title}
                  description={notification.description}
                  iconName={notification.iconName}
                  theme={PushNotificationTheme.Dangerous}
                  onClose={() => notificationState.remove(notification.id)}
                  testId="notification"
                  testSubId={notification.id}
                />
              </div>
            )}
          </For>
        </Show>
      </div>
    </Portal>
  );
};
