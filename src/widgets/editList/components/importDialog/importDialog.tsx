import { createEffect, For, Show, untrack } from "solid-js";
import { createStore } from "solid-js/store";

import { DEFAULT_TEST_ID, IMPORT_DIALOG, IMPORT_DIALOG_IMPORT_BUTTON } from "../../../../../features/testIds.ts";
import { soften } from "../../../../../utilities/soften.ts";
import { Button, ButtonSize, ButtonTheme, ButtonType } from "../../../../components/button/button.tsx";
import { Dialog } from "../../../../components/dialog/dialog.tsx";
import { ListStripeImport } from "../../../../components/listStripeImport/listStripeImport.tsx";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import { type ImportDialogItem, type ImportDialogList, type ItemId, type ListId } from "../../../../types/types.ts";
import { getLists } from "../../services/getLists.ts";
import { addImportItems } from "../../utilities/addImportItems.ts";
import { pasteImportItemsAfter, pasteImportItemsBefore } from "../../utilities/pasteImportItems.ts";

import { ImportDialogCounter, isImportDialogLimitReached } from "./components/importDialogCounter.tsx";
import "./importDialog.css";

type ImportDialogProps = {
  currentListId: string;
};

type ImportDialogState = {
  listsForImport: ImportDialogList[];
  loadingListsForImport: boolean;
  openImportDialog: boolean;
  pasteMethod?: "before" | "after" | "end";
  pasteIndex?: number;
  itemsCache: Record<ItemId, ImportDialogItem>;
  listsCache: Record<ListId, ImportDialogList>;
  checkedItemsCount: Record<ListId, number>;
};

export const [storeImportDialog, setStoreImportDialog] = createStore<ImportDialogState>({
  listsForImport: [],
  loadingListsForImport: false,
  openImportDialog: false,
  pasteMethod: "end",
  itemsCache: {},
  listsCache: {},
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

    const checkedInputs = target.querySelectorAll<HTMLInputElement>("input[type='checkbox']:checked");
    const checkedItemsIds: string[] = [];
    const ignoredGroupIds = new Set<string>();

    checkedInputs.forEach((input) => {
      const dataId = input.dataset.id;
      const groupId = input.dataset.groupId;

      if (dataId?.startsWith("list")) {
        checkedItemsIds.push(dataId);
        ignoredGroupIds.add(dataId);
      } else if (dataId) {
        if (!groupId || !ignoredGroupIds.has(groupId)) {
          checkedItemsIds.push(dataId);
        }
      }
    });

    const checkedItems: ImportDialogItem[] = checkedItemsIds
      .map((id) => storeImportDialog.itemsCache[id] ?? storeImportDialog.listsCache[id])
      .filter((item): item is ImportDialogItem => Boolean(item));

    if (storeImportDialog.pasteMethod === "after" && storeImportDialog.pasteIndex) {
      pasteImportItemsAfter(storeImportDialog.pasteIndex, checkedItems);
    } else if (storeImportDialog.pasteMethod === "before" && storeImportDialog.pasteIndex) {
      pasteImportItemsBefore(storeImportDialog.pasteIndex, checkedItems);
    } else if (storeImportDialog.pasteMethod === "end") {
      addImportItems(checkedItems);
    }

    console.log(checkedItems);

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
          {(list) => {
            setStoreImportDialog(
              "listsCache",
              untrack(() => list.id),
              untrack(() => list),
            );

            return (
              <ListStripeImport titleHTMLName={list.name} testId={DEFAULT_TEST_ID}>
                {list}
              </ListStripeImport>
            );
          }}
        </For>
      </form>
    </Dialog>
  );
};
