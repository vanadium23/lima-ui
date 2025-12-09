import { Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";

import { REMOVE_DIALOG_REMOVE_LIST_BUTTON, REMOVE_LIST_DIALOG } from "../../../../../features/testIds.ts";
import { Button, ButtonSize, ButtonTheme } from "../../../../components/button/button.tsx";
import { Dialog } from "../../../../components/dialog/dialog.tsx";
import { TextButton, TextButtonSize, TextButtonTheme } from "../../../../components/textButton/textButton.tsx";
import { storeEditList } from "../../editList.store.tsx";
import { sendListRemove } from "../../utilities/sendListRemove.ts";

type RemoveDialogState = {
  openRemoveDialog: boolean;
};

export const [storeRemoveDialog, setStoreRemoveDialog] = createStore<RemoveDialogState>({
  openRemoveDialog: false,
});

const closeRemoveDialog = () => {
  setStoreRemoveDialog("openRemoveDialog", false);
};

export const RemoveDialog = () => {
  return (
    <Switch>
      <Match when={!storeEditList.hasExportedItems && storeEditList.exportedTo.length === 0}>
        <Dialog
          title="Удаление списка"
          onCancel={closeRemoveDialog}
          controls={
            <Button
              theme={ButtonTheme.Dangerous}
              size={ButtonSize.Medium}
              handleClick={() => {
                sendListRemove();
                closeRemoveDialog();
              }}
              testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
            >
              Удалить
            </Button>
          }
          open={storeRemoveDialog.openRemoveDialog}
          testId={REMOVE_LIST_DIALOG}
          testSubId={REMOVE_LIST_DIALOG}
        >
          <p>
            Список <strong>{storeEditList.name}</strong> будет удален без возможности восстановления.
          </p>
        </Dialog>
      </Match>
      <Match when={storeEditList.hasExportedItems || storeEditList.exportedTo.length >= 1}>
        <Dialog
          title="Удаление списка"
          onCancel={closeRemoveDialog}
          controls={
            <>
              <TextButton
                theme={TextButtonTheme.Dangerous}
                size={TextButtonSize.Medium}
                handleClick={() => {
                  sendListRemove("insertion");
                  closeRemoveDialog();
                }}
                testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
              >
                Удалить этот список
              </TextButton>
              <Button
                theme={ButtonTheme.Dangerous}
                size={ButtonSize.Medium}
                handleClick={() => {
                  sendListRemove("deletion");
                  closeRemoveDialog();
                }}
                testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
              >
                Удалить всё
              </Button>
            </>
          }
          open={storeRemoveDialog.openRemoveDialog}
          testId={REMOVE_LIST_DIALOG}
          testSubId={REMOVE_LIST_DIALOG}
        >
          <p>
            Вы удаляете экспортированный список. Выберите способ удаления:
            <br />
            – Удалить этот список — все экспорты его в другие списки останутся в качестве пунктов тех списков.
            <br />
            – Удалить все — список и все его экспорты будут удалены.
            <br />
            Это действие нельзя отменить.
          </p>
        </Dialog>
      </Match>
    </Switch>
  );
};
