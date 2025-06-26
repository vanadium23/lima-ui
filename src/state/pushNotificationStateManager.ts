import { createSignal } from "solid-js";

import { IconName } from "../components/icon/icon.tsx";

export type NotificationData = {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
  type?: "network-error" | "general";
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
      type: "network-error",
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      notificationState.remove(id);
    }, 15000);

    return id;
  },

  clearNetworkErrors: () => {
    setNotifications((prev) => prev.filter((n) => n.type !== "network-error"));
  },

  remove: (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  },
};
