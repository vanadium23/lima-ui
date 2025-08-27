import { createSignal } from "solid-js";

import { DEFAULT_TEST_ID } from "../../features/testIds.ts";
import { IconName } from "../components/icon/types.ts";
import type { TestId, TestSubId } from "../components/utilities/testable.ts";

export type NotificationData = {
  id: string;
  title: string;
  description: string;
  iconName: IconName;
  type?: "network-error" | "general";
  testId: TestId;
  testSubId: TestSubId;
};

const [notifications, setNotifications] = createSignal<NotificationData[]>([]);

export const notificationState = {
  notifications,

  pushNetworkError: (
    title: string,
    description: string,
    testId: TestId = DEFAULT_TEST_ID,
  ) => {
    const id = Date.now().toString();
    const testSubId =
      notifications().findLast((notification) => notification.testId === testId)
        ?.testSubId || "0";

    const notification: NotificationData = {
      id,
      title,
      description,
      iconName: IconName.GlobeSimpleX,
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

  clearNetworkErrors: () => {
    setNotifications((prev) => prev.filter((n) => n.type !== "network-error"));
  },

  remove: (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  },
};
