import { createStore } from "solid-js/store";

import { REMOVE_DIALOG_REMOVE_LIST_BUTTON, REMOVE_LIST_DIALOG } from "../../../../../features/testIds.ts";
import { Button, ButtonSize, ButtonTheme } from "../../../../components/button/button.tsx";
import { Dialog } from "../../../../components/dialog/dialog.tsx";
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
    <Dialog
      title="Удаление списка"
      onCancel={closeRemoveDialog}
      controls={
        <Button
          theme={ButtonTheme.Dangerous}
          size={ButtonSize.Medium}
          text={"Удалить"}
          handleClick={() => {
            sendListRemove();
            closeRemoveDialog();
          }}
          testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
        />
      }
      isOpen={storeRemoveDialog.openRemoveDialog}
      testId={REMOVE_LIST_DIALOG}
      testSubId={REMOVE_LIST_DIALOG}
    >
      <p>
        Список <strong>{storeEditList.name}</strong> будет удален без возможности восстановления.
      </p>
    </Dialog>
  );
};
