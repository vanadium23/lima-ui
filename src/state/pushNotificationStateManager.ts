import { createSignal } from "solid-js";

import { IconName } from "../components/icon/icon.tsx";

export type NotificationData = {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
};

const [notifications, setNotifications] = createSignal<NotificationData[]>([]);

export const notificationState = {
  notifications,

  pushNetworkError: (title: string, description: string) => {
    const id = Date.now().toString();
    const notification: NotificationData = {
      id,
      title,
      description,
      iconName: IconName.GlobeSimpleX,
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      notificationState.remove(id);
    }, 15000);

    return id;
  },

  remove: (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  },
};
