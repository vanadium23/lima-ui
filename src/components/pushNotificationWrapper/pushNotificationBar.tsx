import { For, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { notificationState } from "../../state/pushNotificationStateManager.ts";
import { PushNotification } from "../pushNotification/pushNotification.tsx";

import "./pushNotificationBar.css";

export const PushNotificationBar = () => {
  return (
    <Show when={notificationState.notifications().length > 0}>
      <Portal>
        <div class="pushNotificationBar">
          <For each={notificationState.notifications()}>
            {(notification) => (
              <div class="pushNotificationBar__item">
                <PushNotification
                  title={notification.title}
                  description={notification.description}
                  iconName={notification.iconName}
                  theme={notification.theme}
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
