import { createEffect, createSignal, type JSX, Match, mergeProps, Show, Switch } from "solid-js";
import { Portal } from "solid-js/web";

import { DIALOG_CLOSE_BUTTON } from "../../../features/testIds.ts";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonSize, IconButtonTheme } from "../iconButton/iconButton.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./dialog.css";

export enum DialogTheme {
  Primary = "primary",
}

export enum DialogSize {
  Medium = "medium",
}

type DialogProps = {
  theme?: DialogTheme;
  size?: DialogSize;
  children: JSX.Element;
  controls?: JSX.Element;
  onCancel: () => void;
  open: boolean;
  title: string;
  loading?: boolean;
};

export const Dialog = (props: Testable<DialogProps>) => {
  const mProps: Testable<Required<DialogProps>> = mergeProps(
    {
      theme: DialogTheme.Primary,
      size: DialogSize.Medium,
      open: false,
      controls: undefined,
      loading: false,
    },
    props,
  );

  let dialogRef: HTMLDialogElement | undefined;

  const [shouldRender, setShouldRender] = createSignal(false);

  createEffect(() => {
    const isOpen = mProps.open;

    if (isOpen) {
      setShouldRender(true);
    } else if (dialogRef) {
      dialogRef.close();
    }
  });

  const setDialogRef = (el: HTMLDialogElement) => {
    dialogRef = el;
    queueMicrotask(() => {
      dialogRef?.showModal();
    });
  };

  const handleDialogClose = () => {
    // Размонтируем только после закрытия
    setShouldRender(false);
  };

  const closeDialog = () => {
    if (dialogRef) {
      dialogRef.close();
    }
  };

  function closeOnBackDropClick({
    currentTarget,
    target,
  }: MouseEvent & { currentTarget: HTMLDialogElement; target: EventTarget }) {
    const isClickedOnBackDrop = target === currentTarget;

    if (isClickedOnBackDrop) {
      closeDialog();
      mProps.onCancel();
    }
  }

  return (
    <Show when={shouldRender()}>
      <Portal>
        <dialog
          class="dialog"
          classList={{
            [`dialog_${mProps.size}`]: true,
            [`dialog_${mProps.theme}`]: true,
          }}
          aria-label={mProps.title}
          aria-modal={"true"}
          ref={setDialogRef}
          onClick={closeOnBackDropClick}
          onClose={handleDialogClose}
          data-test-id={mProps.testId}
          data-test-sub-id={mProps.testSubId}
        >
          <div class="dialog__wrapper">
            <div class="dialog__header">
              <h2 class="dialog__title">{mProps.title}</h2>
              <IconButton
                theme={IconButtonTheme.Primary}
                size={IconButtonSize.MediumEmbedded}
                iconName={IconName.X}
                ariaLabel={`Закрыть диалоговое окно ${mProps.title}`}
                handleClick={() => {
                  mProps.onCancel();
                  closeDialog();
                }}
                testId={DIALOG_CLOSE_BUTTON}
                testSubId={mProps.testSubId ?? ""}
              />
            </div>
            <Switch>
              <Match when={mProps.loading}>
                <div class="dialog__loadingIconWrapper">
                  <div class="dialog__loadingIcon">
                    <Icon name={IconName.CircleNotch} size={IconSize.Large} />
                  </div>
                </div>
              </Match>
              <Match when={!mProps.loading}>
                <div class="dialog__content scrollStyles">{mProps.children}</div>
              </Match>
            </Switch>

            <Show when={mProps.controls}>
              <div class="dialog__controls">{mProps.controls}</div>
            </Show>
          </div>
        </dialog>
      </Portal>
    </Show>
  );
};
