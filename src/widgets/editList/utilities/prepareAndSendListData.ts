import { URL_MY_LISTS } from "../../../../utilities/addresses.ts";
import { soften } from "../../../../utilities/soften.ts";
import { suffixTabTitle } from "../../../../utilities/tabTitle.ts";
import { setLocation } from "../../../state/locationState.ts";
import { type ItemData, type NewListData, type UpdatedListData } from "../../../types/types.ts";
import { setStoreEditList, storeEditList, updateStoreEditList } from "../editList.store.tsx";
import { createList } from "../services/createList.ts";
import { updateList } from "../services/updateList.ts";

import { getEditListElementsWithoutAutoItem } from "./getEditListElementsWithoutAutoItem.tsx";

export function prepareAndSendListData(event: SubmitEvent) {
  event.preventDefault();

  if (!storeEditList.sendingNow) {
    const elementsForSending = prepareListElementsDataForSending();
    const data = {
      name: storeEditList.name,
      purpose: storeEditList.purpose,
      items: elementsForSending,
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

function prepareListElementsDataForSending(): ItemData[] {
  return getEditListElementsWithoutAutoItem().map((element) => {
    const isNewItem = !element.items[0].id;

    if (isNewItem) {
      return { content: element.items[0].content };
    }

    /* Ищем среди всех InitialItems тот InitialItem который является текущим Item'ом.*/
    const initialItem = storeEditList.initialList.elements.find((initialElementCandidate) => {
      return initialElementCandidate.id === element.id;
    });

    const itemIsImportedNow = !initialItem;

    if (itemIsImportedNow || element.items[0].content === initialItem.items[0].content) {
      return { id: element.id };
    }

    return { id: element.id, content: element.items[0].content };
  });
}

function sendNewList(data: NewListData) {
  setStoreEditList({
    error: false,
    sendingNow: "saving",
  });

  createList(data)
    .then((updatedListFromBackendAnswer) => {
      soften(() => {
        history.pushState({}, "", `${URL_MY_LISTS}/${updatedListFromBackendAnswer.id}`);
        setLocation(window.location.pathname);
        document.title = suffixTabTitle(updatedListFromBackendAnswer.name);

        updateStoreEditList(updatedListFromBackendAnswer);
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);

      soften(() => {
        setStoreEditList({ error: true, sendingNow: false });
      });
    });
}

function sendUpdatedList(data: UpdatedListData) {
  setStoreEditList({
    error: false,
    sendingNow: "saving",
  });

  updateList(data)
    .then((updatedListFromBackendAnswer) => {
      soften(() => {
        document.title = suffixTabTitle(updatedListFromBackendAnswer.name);

        updateStoreEditList(updatedListFromBackendAnswer);
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);

      soften(() => {
        setStoreEditList({ error: true, sendingNow: false });
      });
    });
}
