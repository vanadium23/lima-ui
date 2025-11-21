import { createEffect, For, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { DEFAULT_TEST_ID, IMPORT_DIALOG, IMPORT_DIALOG_IMPORT_BUTTON } from "../../../../../features/testIds.ts";
import { soften } from "../../../../../utilities/soften.ts";
import { Button, ButtonSize, ButtonTheme, ButtonType } from "../../../../components/button/button.tsx";
import { Dialog } from "../../../../components/dialog/dialog.tsx";
import { ListStripeImport } from "../../../../components/listStripeImport/listStripeImport.tsx";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import { type Item, type List } from "../../../../types/types.ts";
import { getLists } from "../../services/getLists.ts";
import { addImportItems } from "../../utilities/addImportItems.ts";
import { pasteImportItemsAfter, pasteImportItemsBefore } from "../../utilities/pasteImportItems.ts";

import { ImportDialogCounter, isImportDialogLimitReached } from "./components/importDialogCounter.tsx";
import "./importDialog.css";

type ImportDialogProps = {
  currentListId: string;
};

type ImportDialogState = {
  listsForImport: List[];
  loadingListsForImport: boolean;
  openImportDialog: boolean;
  pasteMethod?: "before" | "after" | "end";
  pasteIndex?: number;
  itemsCache: Record<Item["id"], Item>;
  checkedItemsCount: Record<List["id"], number>;
};

export const [storeImportDialog, setStoreImportDialog] = createStore<ImportDialogState>({
  listsForImport: [],
  loadingListsForImport: false,
  openImportDialog: false,
  pasteMethod: "end",
  itemsCache: {},
  checkedItemsCount: {},
});

export const openImportDialogPasteEnd = () => {
  setStoreImportDialog({ openImportDialog: true, pasteMethod: "end" });
};

export const openImportDialogPasteBefore = (pasteIndex: number) => {
  setStoreImportDialog({ openImportDialog: true, pasteMethod: "before", pasteIndex: pasteIndex });
};

export const openImportDialogPasteAfter = (pasteIndex: number) => {
  setStoreImportDialog({ openImportDialog: true, pasteMethod: "after", pasteIndex: pasteIndex });
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
        setStoreImportDialog({
          loadingListsForImport: false,
          listsForImport: [],
          openImportDialog: false,
        });

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
      pasteMethod: "end",
      checkedItemsCount: {},
    });
  };

  createEffect(() => {
    if (storeImportDialog.openImportDialog) {
      void getListsForImport();
    }
  });

  const addImportedItems = (event: SubmitEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;

    const formData = new FormData(target);

    const checkedItemsIds: string[] = [];

    for (const [checkboxNameHTML, value] of formData.entries()) {
      if (value === "on") {
        checkedItemsIds.push(checkboxNameHTML);
      }
    }

    const checkedItems: Item[] = checkedItemsIds
      .map((id) => storeImportDialog.itemsCache[id])
      .filter((item): item is Item => Boolean(item));

    if (storeImportDialog.pasteMethod === "after" && storeImportDialog.pasteIndex) {
      pasteImportItemsAfter(storeImportDialog.pasteIndex, checkedItems);
    } else if (storeImportDialog.pasteMethod === "before" && storeImportDialog.pasteIndex) {
      pasteImportItemsBefore(storeImportDialog.pasteIndex, checkedItems);
    } else if (storeImportDialog.pasteMethod === "end") {
      addImportItems(checkedItems);
    }

    handleClose();
  };

  return (
    <Dialog
      title="Выбрать списки для импорта"
      onCancel={handleClose}
      loading={storeImportDialog.loadingListsForImport}
      controls={
        <>
          <ImportDialogCounter testId={DEFAULT_TEST_ID} />
          <Button
            theme={ButtonTheme.Primary}
            type={ButtonType.Submit}
            size={ButtonSize.Medium}
            form="importDialog"
            testId={IMPORT_DIALOG_IMPORT_BUTTON}
            disabled={isImportDialogLimitReached()}
          >
            Импортировать
          </Button>
        </>
      }
      open={storeImportDialog.openImportDialog}
      testId={IMPORT_DIALOG}
      testSubId={IMPORT_DIALOG}
    >
      <form class="importDialog" id="importDialog" method="post" onSubmit={addImportedItems}>
        <Show when={!storeImportDialog.loadingListsForImport && storeImportDialog.listsForImport.length === 0}>
          <div class="importDialog__emptyMessage">
            Пока здесь пусто, но скоро появятся списки для импорта. Пожалуйста, создайте как минимум два списка для
            начала.
          </div>
        </Show>
        <For each={storeImportDialog.listsForImport}>
          {(list) => (
            <ListStripeImport titleHTMLName={list.name} testId={DEFAULT_TEST_ID}>
              {list}
            </ListStripeImport>
          )}
        </For>
      </form>
    </Dialog>
  );
};
