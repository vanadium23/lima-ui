import { URL_MY_LISTS } from "../../../../utilities/addresses.ts";
import { soften } from "../../../../utilities/soften.ts";
import { suffixTabTitle } from "../../../../utilities/tabTitle.ts";
import { setLocation } from "../../../state/locationState.ts";
import { type NewList, type UpdatedList } from "../../../types/types.ts";
import { setStoreEditList, storeEditList, updateStoreEditList } from "../editList.store.tsx";
import { createList } from "../services/createList.ts";
import { updateList } from "../services/updateList.ts";

export function prepareAndSendListData(event: SubmitEvent) {
  event.preventDefault();

  if (!storeEditList.sendingNow) {
    const inputsValues = prepareListItemsDataForSending();
    const data = {
      name: storeEditList.name,
      purpose: storeEditList.purpose,
      items: inputsValues,
      note: storeEditList.note,
      noDocumentedReasonForLatestUpdate: true,
    };

    if (storeEditList.id) {
      sendUpdatedList({ ...data, id: storeEditList.id });
    } else {
      sendNewList(data);
    }
  }
}

function prepareListItemsDataForSending() {
  function removeAutoItem() {
    return storeEditList.items.filter((item) => !item.auto);
  }

  return removeAutoItem().map((item) => {
    const isNewItem = !item.id;

    if (isNewItem) {
      return { content: item.content };
    }

    /* Ищем среди всех InitialItems тот InitialItem который является текущим Item'ом.*/
    const initialItem = storeEditList.initialList.items.find((initialItemCandidate) => {
      return initialItemCandidate.id === item.id;
    });

    const itemIsImported = !initialItem;

    if (itemIsImported || item.content === initialItem.content) {
      return { id: item.id };
    }

    return item;
  });
}

function sendNewList(data: NewList) {
  setStoreEditList({
    error: false,
    sendingNow: "saving",
  });

  createList(data)
    .then((newList) => {
      soften(() => {
        history.pushState({}, "", `${URL_MY_LISTS}/${newList.id}`);
        setLocation(window.location.pathname);
        document.title = suffixTabTitle(newList.name);

        updateStoreEditList(newList);
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);

      soften(() => {
        setStoreEditList({ error: true, sendingNow: false });
      });
    });
}

function sendUpdatedList(data: UpdatedList) {
  setStoreEditList({
    error: false,
    sendingNow: "saving",
  });

  updateList(data)
    .then((updatedList) => {
      soften(() => {
        document.title = suffixTabTitle(updatedList.name);

        updateStoreEditList(updatedList);
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);

      soften(() => {
        setStoreEditList({ error: true, sendingNow: false });
      });
    });
}
