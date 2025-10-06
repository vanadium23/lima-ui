import { createEffect, For, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { DEFAULT_TEST_ID, IMPORT_DIALOG, IMPORT_DIALOG_IMPORT_BUTTON } from "../../../features/testIds.ts";
import { Button, ButtonSize, ButtonTheme } from "../../components/button/button.tsx";
import { Dialog } from "../../components/dialog/dialog.tsx";
import { ListStripeImport } from "../../components/listStripeImport/listStripeImport.tsx";
import { notificationState } from "../../state/pushNotificationStateManager.ts";
import type { List } from "../../types/types.ts";
import { getLists } from "../../widgets/editList/services/getLists.ts";
import { soften } from "../../widgets/editList/utilities/soften.ts";

import "./importDialog.css";

type ImportDialogProps = {
  currentListId: string;
  isOpen: boolean;
  onClose: () => void;
};

type ImportDialogState = {
  listsForImport: List[];
  elementsReadyToImport: List[];
  loadingListsForImport: boolean;
};

export const ImportDialog = (props: ImportDialogProps) => {
  const [store, setStore] = createStore<ImportDialogState>({
    listsForImport: [],
    elementsReadyToImport: [],
    loadingListsForImport: false,
  });

  const getListsForImport = async () => {
    setStore("loadingListsForImport", true);

    try {
      const lists = await getLists();
      const filteredLists = lists.filter((availableList) => availableList.id !== props.currentListId);
      notificationState.clearNetworkErrors();

      setStore({
        listsForImport: filteredLists,
        loadingListsForImport: false,
      });
    } catch (error) {
      console.error("Error loading lists:", error);
      soften(() => {
        setStore({ loadingListsForImport: false, listsForImport: [] });
        props.onClose();

        notificationState.pushNetworkError(
          "Ошибка",
          "Не удалось загрузить списки для импорта, попробуйте еще раз",
          DEFAULT_TEST_ID,
        );
      }, 2000);
    }
  };

  const handleClose = () => {
    setStore({
      loadingListsForImport: false,
      listsForImport: [],
    });
    props.onClose();
  };

  createEffect(() => {
    if (props.isOpen) {
      getListsForImport();
    }
  });

  return (
    <Dialog
      title="Выбрать списки для импорта"
      onCancel={handleClose}
      loading={store.loadingListsForImport}
      controls={
        <Button
          theme={ButtonTheme.Primary}
          size={ButtonSize.Medium}
          text={"Импортировать"}
          handleClick={handleClose}
          testId={IMPORT_DIALOG_IMPORT_BUTTON}
          isDisabled={store.elementsReadyToImport.length === 0}
        />
      }
      open={props.isOpen}
      testId={IMPORT_DIALOG}
      testSubId={IMPORT_DIALOG}
    >
      <div class="importDialog">
        <Show when={!store.loadingListsForImport && store.listsForImport.length === 0}>
          <div class="importDialog__emptyMessage">
            Пока здесь пусто, но скоро появятся списки для импорта. Пожалуйста, создайте как минимум два списка для
            начала.
          </div>
        </Show>
        <For each={store.listsForImport}>
          {(list) => (
            <ListStripeImport titleHTMLName={list.name} testId={DEFAULT_TEST_ID}>
              {list}
            </ListStripeImport>
          )}
        </For>
      </div>
    </Dialog>
  );
};
