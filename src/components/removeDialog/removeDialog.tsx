import { createEffect, createSignal, Match, mergeProps, Switch } from "solid-js";

import { REMOVE_DIALOG_REMOVE_LIST_BUTTON, REMOVE_LIST_DIALOG } from "../../../features/testIds.ts";
import type { DeletionMethod } from "../../widgets/editList/services/removeList.ts";
import { Button, ButtonSize, ButtonTheme } from "../button/button.tsx";
import { Dialog } from "../dialog/dialog.tsx";
import { TextButton, TextButtonSize, TextButtonTheme } from "../textButton/textButton.tsx";

type RemoveDialogProps = {
  hasExported: boolean;
  listName: string;
  sendListRemove: (deletionMethod?: DeletionMethod) => void;
  open: boolean;
  onCancel: () => void;
};

export const RemoveDialog = (props: RemoveDialogProps) => {
  const mProps: Required<RemoveDialogProps> = mergeProps(props);

  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = createSignal(false);

  createEffect(() => {
    setIsRemoveDialogOpen(mProps.open);
  });

  return (
    <Switch>
      <Match when={!mProps.hasExported}>
        <Dialog
          title="Удаление списка"
          onCancel={() => {
            setIsRemoveDialogOpen(false);
            mProps.onCancel();
          }}
          controls={
            <Button
              theme={ButtonTheme.Dangerous}
              size={ButtonSize.Medium}
              handleClick={() => {
                mProps.sendListRemove();
                setIsRemoveDialogOpen(false);
              }}
              testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
            >
              Удалить
            </Button>
          }
          open={isRemoveDialogOpen()}
          testId={REMOVE_LIST_DIALOG}
          testSubId={REMOVE_LIST_DIALOG}
        >
          <p>
            Список <strong>{mProps.listName}</strong> будет удален без возможности восстановления.
          </p>
        </Dialog>
      </Match>
      <Match when={mProps.hasExported}>
        <Dialog
          title="Удаление списка"
          onCancel={() => {
            setIsRemoveDialogOpen(false);
            mProps.onCancel();
          }}
          controls={
            <>
              <TextButton
                theme={TextButtonTheme.Dangerous}
                size={TextButtonSize.Medium}
                handleClick={() => {
                  mProps.sendListRemove("insertion");
                  setIsRemoveDialogOpen(false);
                }}
                testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
              >
                Удалить этот список
              </TextButton>
              <Button
                theme={ButtonTheme.Dangerous}
                size={ButtonSize.Medium}
                handleClick={() => {
                  mProps.sendListRemove("deletion");
                  setIsRemoveDialogOpen(false);
                }}
                testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
              >
                Удалить всё
              </Button>
            </>
          }
          open={isRemoveDialogOpen()}
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
