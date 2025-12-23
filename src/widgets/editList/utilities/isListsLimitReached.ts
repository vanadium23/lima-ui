import { LISTS_LIMIT } from "../../../../configuration.ts";
import { DEFAULT_TEST_ID } from "../../../../features/testIds.ts";
import { getLists } from "../../../services/getLists.ts";
import { notificationState } from "../../../state/pushNotificationStateManager.ts";

export async function isListsLimitReached() {
  try {
    const lists = await getLists();
    notificationState.clearNetworkErrors();

    return lists.length >= LISTS_LIMIT;
  } catch (error) {
    console.error("Error loading lists:", error);

    notificationState.pushNetworkError("Ошибка", "Не удалось загрузить списки, попробуйте еще раз", DEFAULT_TEST_ID);

    return false;
  }
}
