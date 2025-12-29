import { createEffect, createSignal, Match, mergeProps, Switch } from "solid-js";

import { REMOVE_DIALOG_REMOVE_LIST_BUTTON, REMOVE_LIST_DIALOG } from "../../../features/testIds.ts";
import type { DeletionMethod } from "../../widgets/editList/services/removeList.ts";
import { Button, ButtonSize, ButtonTheme } from "../button/button.tsx";
import { Dialog } from "../dialog/dialog.tsx";
import { TextButton, TextButtonSize, TextButtonTheme } from "../textButton/textButton.tsx";
import type { Testable } from "../utilities/testable.ts";

type RemoveListDialogProps = {
  hasExported: boolean;
  listName: string;
  sendListRemove: (deletionMethod?: DeletionMethod) => void;
  open: boolean;
  onCancel: () => void;
};

export const RemoveListDialog = (props: Testable<RemoveListDialogProps>) => {
  const mProps: Testable<Required<RemoveListDialogProps>> = mergeProps(props);

  const [isRemoveListDialogOpen, setIsRemoveListDialogOpen] = createSignal(false);

  createEffect(() => {
    setIsRemoveListDialogOpen(mProps.open);
  });

  return (
    <Switch>
      <Match when={!mProps.hasExported}>
        <Dialog
          title="Удаление списка"
          onCancel={() => {
            setIsRemoveListDialogOpen(false);
            mProps.onCancel();
          }}
          controls={
            <Button
              theme={ButtonTheme.Dangerous}
              size={ButtonSize.Medium}
              handleClick={() => {
                mProps.sendListRemove();
                setIsRemoveListDialogOpen(false);
              }}
              testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
              testSubId={mProps.testSubId || "0"}
            >
              Удалить
            </Button>
          }
          open={isRemoveListDialogOpen()}
          testId={mProps.testId}
          testSubId={mProps.testSubId || "0"}
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
            setIsRemoveListDialogOpen(false);
            mProps.onCancel();
          }}
          controls={
            <>
              <TextButton
                theme={TextButtonTheme.Dangerous}
                size={TextButtonSize.Medium}
                handleClick={() => {
                  mProps.sendListRemove("insertion");
                  setIsRemoveListDialogOpen(false);
                }}
                testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
                testSubId={mProps.testSubId || "0"}
              >
                Удалить этот список
              </TextButton>
              <Button
                theme={ButtonTheme.Dangerous}
                size={ButtonSize.Medium}
                handleClick={() => {
                  mProps.sendListRemove("deletion");
                  setIsRemoveListDialogOpen(false);
                }}
                testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
                testSubId={mProps.testSubId || "0"}
              >
                Удалить всё
              </Button>
            </>
          }
          open={isRemoveListDialogOpen()}
          testId={REMOVE_LIST_DIALOG}
          testSubId={mProps.testSubId || "0"}
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
