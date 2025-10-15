import { createEffect, For, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { DEFAULT_TEST_ID, IMPORT_DIALOG, IMPORT_DIALOG_IMPORT_BUTTON } from "../../../../../features/testIds.ts";
import { soften } from "../../../../../utilities/soften.ts";
import { Button, ButtonSize, ButtonTheme } from "../../../../components/button/button.tsx";
import { Dialog } from "../../../../components/dialog/dialog.tsx";
import { ListStripeImport } from "../../../../components/listStripeImport/listStripeImport.tsx";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import type { Item, Items, List } from "../../../../types/types.ts";
import { setStoreEditList } from "../../editList.store.tsx";
import { getLists } from "../../services/getLists.ts";
import { convertItemsToDragItems } from "../../utilities/dragAndDrop.ts";

import "./importDialog.css";

type ImportDialogProps = {
  currentListId: string;
};

type ImportDialogState = {
  listsForImport: List[];
  elementsReadyToImport: Item[];
  loadingListsForImport: boolean;
  openImportDialog: boolean;
};

export const [storeImportDialog, setStoreImportDialog] = createStore<ImportDialogState>({
  listsForImport: [],
  elementsReadyToImport: [],
  loadingListsForImport: false,
  openImportDialog: false,
});

export const openImportDialog = () => {
  setStoreImportDialog("openImportDialog", true);
};

export const ImportDialog = (props: ImportDialogProps) => {
  const getListsForImport = async () => {
    setStoreImportDialog("loadingListsForImport", true);

    try {
      const lists = await getLists();
      const filteredLists = lists.filter((availableList) => availableList.id !== props.currentListId);
      notificationState.clearNetworkErrors();

      setStoreImportDialog({
        listsForImport: filteredLists,
        loadingListsForImport: false,
      });
    } catch (error) {
      console.error("Error loading lists:", error);
      soften(() => {
        setStoreImportDialog({ loadingListsForImport: false, listsForImport: [], openImportDialog: false });

        notificationState.pushNetworkError(
          "Ошибка",
          "Не удалось загрузить списки для импорта, попробуйте еще раз",
          DEFAULT_TEST_ID,
        );
      }, 2000);
    }
  };

  const handleClose = () => {
    setStoreImportDialog({
      loadingListsForImport: false,
      listsForImport: [],
      openImportDialog: false,
    });
  };

  createEffect(() => {
    if (storeImportDialog.openImportDialog) {
      getListsForImport();
    }
  });

  function addToReadyToImport(item: Item) {
    setStoreImportDialog(produce((store) => store.elementsReadyToImport.push(item)));
  }

  function addImportedItems(importedItems: Items) {
    setStoreEditList("items", (items) => items.concat(convertItemsToDragItems(importedItems)));
  }

  return (
    <Dialog
      title="Выбрать списки для импорта"
      onCancel={handleClose}
      loading={storeImportDialog.loadingListsForImport}
      controls={
        <Button
          theme={ButtonTheme.Primary}
          size={ButtonSize.Medium}
          handleClick={() => {
            addImportedItems(storeImportDialog.elementsReadyToImport);
            handleClose();
          }}
          testId={IMPORT_DIALOG_IMPORT_BUTTON}
          disabled={storeImportDialog.elementsReadyToImport.length === 0}
        >
          Импортировать
        </Button>
      }
      open={storeImportDialog.openImportDialog}
      testId={IMPORT_DIALOG}
      testSubId={IMPORT_DIALOG}
    >
      <div class="importDialog">
        <Show when={!storeImportDialog.loadingListsForImport && storeImportDialog.listsForImport.length === 0}>
          <div class="importDialog__emptyMessage">
            Пока здесь пусто, но скоро появятся списки для импорта. Пожалуйста, создайте как минимум два списка для
            начала.
          </div>
        </Show>
        <For each={storeImportDialog.listsForImport}>
          {(list) => (
            <ListStripeImport
              titleHTMLName={list.name}
              testId={DEFAULT_TEST_ID}
              handleReadyToImport={addToReadyToImport}
            >
              {list}
            </ListStripeImport>
          )}
        </For>
      </div>
    </Dialog>
  );
};
