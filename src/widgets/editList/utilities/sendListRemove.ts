import { URL_MY_LISTS } from "../../../../utilities/addresses.ts";
import { soften } from "../../../../utilities/soften.ts";
import { setStoreEditList, storeEditList } from "../editList.store.tsx";
import { removeList } from "../services/removeList.ts";

export function sendListRemove() {
  setStoreEditList({
    removeError: false,
    sendingNow: "deleting",
  });

  removeList(storeEditList.id)
    .then(async () => {
      await soften(() => {
        setStoreEditList("sendingNow", false);
        location.href = URL_MY_LISTS;
      });
    })
    .catch(async (error) => {
      console.error("Error deleting the list:", error);
      await soften(() => {
        setStoreEditList({
          sendingNow: false,
          removeError: true,
        });
      });
    });
}
