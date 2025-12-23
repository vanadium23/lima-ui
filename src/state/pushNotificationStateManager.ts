import { createSignal, type JSX } from "solid-js";

import { DEFAULT_TEST_ID } from "../../features/testIds.ts";
import { IconName } from "../components/icon/types.ts";
import { PushNotificationTheme } from "../components/pushNotification/pushNotification.tsx";
import type { TestId, TestSubId } from "../components/utilities/testable.ts";

export type NotificationType = "network-error" | "info" | "success";

export type NotificationData = {
  id: string;
  title: string;
  description: JSX.Element;
  theme: PushNotificationTheme;
  iconName: IconName;
  type?: NotificationType;
  testId: TestId;
  testSubId: TestSubId;
};

const [notifications, setNotifications] = createSignal<NotificationData[]>([]);

export const notificationState = {
  notifications,

  pushMessageToLocalStorage: (
    type: NotificationType,
    title: string,
    description: string,
    testId: TestId = DEFAULT_TEST_ID,
  ) => {
    const id = Date.now().toString();
    const testSubId = notifications().findLast((notification) => notification.testId === testId)?.testSubId || "0";

    const notification: NotificationData = {
      id,
      title,
      description,
      iconName: type === "success" ? IconName.CheckCircle : IconName.GlobeSimpleX,
      theme: type === "success" ? PushNotificationTheme.Successful : PushNotificationTheme.Dangerous,
      type,
      testId,
      testSubId: `${Number(testSubId) + 1}`,
    };

    localStorage.setItem("notification", JSON.stringify(notification));
  },

  popMessageFromLocalStorage: () => {
    const notificationRaw = localStorage.getItem("notification");

    if (notificationRaw) {
      const notification = JSON.parse(notificationRaw) as NotificationData;

      setNotifications((prev) => [...prev, notification]);

      setTimeout(() => {
        notificationState.remove(notification.id);
      }, 15000);

      localStorage.removeItem("notification");
    }
  },

  pushNetworkError: (title: string, description: string, testId: TestId = DEFAULT_TEST_ID) => {
    const id = Date.now().toString();
    const testSubId = notifications().findLast((notification) => notification.testId === testId)?.testSubId || "0";

    const notification: NotificationData = {
      id,
      title,
      description,
      iconName: IconName.GlobeSimpleX,
      theme: PushNotificationTheme.Dangerous,
      type: "network-error",
      testId,
      testSubId: `${Number(testSubId) + 1}`,
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      notificationState.remove(id);
    }, 15000);

    return id;
  },

  pushInfo: (title: string, description: JSX.Element, testId: TestId = DEFAULT_TEST_ID) => {
    const id = Date.now().toString();
    const testSubId = notifications().findLast((notification) => notification.testId === testId)?.testSubId || "0";

    const notification: NotificationData = {
      id,
      title,
      description,
      iconName: IconName.Info,
      theme: PushNotificationTheme.Primary,
      type: "info",
      testId,
      testSubId: `${Number(testSubId) + 1}`,
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
