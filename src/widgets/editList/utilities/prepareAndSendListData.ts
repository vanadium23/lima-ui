import { URL_MY_LISTS } from "../../../../utilities/addresses.ts";
import { soften } from "../../../../utilities/soften.ts";
import { suffixTabTitle } from "../../../../utilities/tabTitle.ts";
import { setLocation } from "../../../state/locationState.ts";
import { EditListFormNames, type Item, type NewList, type SimpleItem, type UpdatedList } from "../../../types/types.ts";
import { type EditListStore, setStoreEditList, storeEditList, updateStoreEditList } from "../editList.store.tsx";
import { createList } from "../services/createList.ts";
import { updateList } from "../services/updateList.ts";

import { checkChanges } from "./checkChanges.ts";

type EditListForm = {
  [EditListFormNames.ListTitle]: HTMLInputElement;
  [EditListFormNames.ListPurpose]: HTMLInputElement;
  [EditListFormNames.ListNote]: HTMLInputElement;
};

export function prepareAndSendListData(event: SubmitEvent) {
  event.preventDefault();

  if (!storeEditList.sendingNow) {
    const target = event.target as HTMLFormElement & EditListForm;

    const elements = Array.from(target.elements) as HTMLInputElement[];
    const inputsValues = prepareListItemsDataForSending(elements, storeEditList);
    const data = {
      name: target[EditListFormNames.ListTitle].value,
      purpose: target[EditListFormNames.ListPurpose].value,
      items: inputsValues,
      note: target[EditListFormNames.ListNote].value,
      noDocumentedReasonForLatestUpdate: true,
    };

    if (storeEditList.id) {
      sendUpdatedList({ ...data, id: storeEditList.id });
    } else {
      sendNewList(data);
    }
  }
}

function prepareListItemsDataForSending(elements: HTMLInputElement[], store: EditListStore) {
  const itemsInputs = elements.filter((element) => {
    return element.name.startsWith(EditListFormNames.ListItem);
  });

  return itemsInputs
    .map((itemInput) => {
      const content = itemInput.value.trim();
      const id = String(itemInput.dataset.id?.trim());

      if (id) {
        return { id, content };
      } else {
        return { content };
      }
    })
    .filter((item, index) => item.content !== "" || index < store.items.length - 1)
    .map((item) => {
      if (!item.id) {
        return item;
      }

      const initialItem = store.initialList.items.find((initialItemCandidate) => {
        return initialItemCandidate.id === item.id;
      });

      if (!initialItem) {
        return item;
      }

      if (isItemUnchanged(item, initialItem)) {
        return { id: item.id };
      }

      return item;
    });
}

function isItemUnchanged(item: SimpleItem, initialItem: Item) {
  return item.id === initialItem.id && item.content === initialItem.content;
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

        checkChanges(storeEditList, setStoreEditList);
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

        checkChanges(storeEditList, setStoreEditList);
      });
    })
    .catch((error) => {
      console.error("There has been a problem with your fetch operation:", error);

      soften(() => {
        setStoreEditList({ error: true, sendingNow: false });
      });
    });
}
