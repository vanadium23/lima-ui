import { createEffect, type JSX, mergeProps } from "solid-js";

import { DIALOG_CLOSE_BUTTON } from "../../../features/testIds.ts";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
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
  controls: JSX.Element;
  onCancel: () => void;
  isOpen: boolean;
  title: string;
};

export const Dialog = (props: Testable<DialogProps>) => {
  const mProps: Testable<Required<DialogProps>> = mergeProps(
    {
      theme: DialogTheme.Primary,
      size: DialogSize.Medium,
      isOpen: false,
    },
    props,
  );

  let dialogRef: HTMLDialogElement | undefined;

  createEffect(() => {
    if (mProps.isOpen && dialogRef) {
      dialogRef.showModal();
    }

    if (!mProps.isOpen && dialogRef) {
      closeDialog();
    }
  });

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
    <dialog
      class={`dialog dialog_${mProps.theme} dialog_${mProps.size}`}
      aria-label={mProps.title}
      aria-modal={mProps.isOpen}
      ref={(el) => (dialogRef = el)}
      onClick={closeOnBackDropClick}
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

        <div class="dialog__content">{mProps.children}</div>
        <div class="dialog__controls">{mProps.controls}</div>
      </div>
    </dialog>
  );
};
