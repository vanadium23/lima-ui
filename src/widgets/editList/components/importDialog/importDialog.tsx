import { createEffect, For, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { ITEMS_LIMIT } from "../../../../../configuration.ts";
import { DEFAULT_TEST_ID, IMPORT_DIALOG, IMPORT_DIALOG_IMPORT_BUTTON } from "../../../../../features/testIds.ts";
import { soften } from "../../../../../utilities/soften.ts";
import { Button, ButtonSize, ButtonTheme, ButtonType } from "../../../../components/button/button.tsx";
import { Dialog } from "../../../../components/dialog/dialog.tsx";
import { ListStripeImport } from "../../../../components/listStripeImport/listStripeImport.tsx";
import { notificationState } from "../../../../state/pushNotificationStateManager.ts";
import { type EditListElement, type EditListType, type ItemId, type ListId } from "../../../../types/types.ts";
import { getListsForImporting } from "../../services/getListsForImporting.ts";
import { addImportItems } from "../../utilities/addImportItems.ts";
import { convertEditListToImportedListElement } from "../../utilities/convertItemsFromBackendToEditListItems.ts";
import { pasteImportedItemsAfter, pasteImportedItemsBefore } from "../../utilities/pasteImportItems.ts";

import { ElementCounter } from "./components/elementCounter/elementCounter.tsx";
import { getCheckedImportItemsCount } from "./utilities/getCheckedImportItemsCount.tsx";
import { getTotalCheckedItemsCount } from "./utilities/getTotalCheckedItemsCount.tsx";
import { isImportDialogLimitReached } from "./utilities/isImportDialogLimitReached.tsx";
import "./importDialog.css";

type ImportDialogProps = {
  currentListId: string;
};

type ImportDialogState = {
  listsForImport: EditListType[];
  loadingListsForImport: boolean;
  openImportDialog: boolean;
  pasteMethod?: "before" | "after" | "end";
  pasteIndex?: number;
  itemsCache: Record<ItemId, EditListElement>;
  listsCache: Record<ListId, EditListType>;
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
      const filteredLists: EditListType[] = (await getListsForImporting(props.currentListId))
        .map((list) => {
          setStoreImportDialog("listsCache", list.id, list);

          return list;
        })
        .map((list) => {
          return {
            ...list,
            elements: list.elements.filter((element) => !element.isImported),
          };
        });

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
    const checkedItemsIds: (ListId | ItemId)[] = [];
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

    const checkedItems: EditListElement[] = checkedItemsIds
      .map((id) => {
        const item = storeImportDialog.itemsCache[id];

        if (item) return { ...item, isImported: true };

        const list = storeImportDialog.listsCache[id];

        if (list) return convertEditListToImportedListElement(list);

        return undefined;
      })
      .filter((element): element is EditListElement => Boolean(element));

    if (storeImportDialog.pasteMethod === "after" && storeImportDialog.pasteIndex !== undefined) {
      pasteImportedItemsAfter(storeImportDialog.pasteIndex, checkedItems);
    } else if (storeImportDialog.pasteMethod === "before" && storeImportDialog.pasteIndex !== undefined) {
      pasteImportedItemsBefore(storeImportDialog.pasteIndex, checkedItems);
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
          <ElementCounter testId={DEFAULT_TEST_ID} isLimitReached={isImportDialogLimitReached()} maxCount={ITEMS_LIMIT}>
            {getTotalCheckedItemsCount()}
          </ElementCounter>
          <Button
            theme={ButtonTheme.Primary}
            type={ButtonType.Submit}
            size={ButtonSize.Medium}
            form="importDialog"
            testId={IMPORT_DIALOG_IMPORT_BUTTON}
            disabled={isImportDialogLimitReached() || getCheckedImportItemsCount() === 0}
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
