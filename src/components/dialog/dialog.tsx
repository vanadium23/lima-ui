import { type Component, createEffect, type JSX, mergeProps } from "solid-js";
import { Button, ButtonSize, ButtonTheme } from "../button/button.tsx";
import "./dialog.css";
import {
  TextButton,
  TextButtonSize,
  TextButtonTheme,
} from "../textButton/textButton.tsx";
import {
  DIALOG,
  DIALOG_DELETE_BUTTON,
  DIALOG_RETURN_BUTTON,
} from "../../../features/testIds.ts";
import type { Testable } from "../utilities/testable.ts";

export enum DialogTheme {
  Primary = "primary",
}

export enum DialogSize {
  Medium = "medium",
}

type DialogProps = {
  size: DialogSize;
  children: JSX.Element;
  theme: DialogTheme;
  onConfirm?: () => void;
  onCancel?: () => void;
  isOpen: boolean;
  title: string;
};

export const Dialog: Component<Testable<DialogProps>> = (props) => {
  const mProps: Testable<Required<DialogProps>> = mergeProps(
    {
      isOpen: false,
      onConfirm: () => {},
      onCancel: () => {},
    },
    props,
  );

  let dialogRef: HTMLDialogElement | undefined;

  createEffect(() => {
    if (mProps.isOpen && dialogRef) {
      dialogRef.showModal();
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
      data-test-id={DIALOG}
      data-test-sub-id={mProps.testId}
    >
      <div class="dialog__wrapper">
        <h2 class="dialog__title">{mProps.title}</h2>
        <div class="dialog__content">{mProps.children}</div>
        <div class="dialog__controls">
          <TextButton
            theme={TextButtonTheme.Primary}
            size={TextButtonSize.Medium}
            text={"Вернуться"}
            handleClick={() => {
              mProps.onCancel();
              closeDialog();
            }}
            testId={DIALOG_RETURN_BUTTON}
            testSubId={mProps.testId}
          ></TextButton>
          <Button
            theme={ButtonTheme.Dangerous}
            size={ButtonSize.Medium}
            text={"Удалить"}
            handleClick={() => {
              mProps.onConfirm();
              closeDialog();
            }}
            testId={DIALOG_DELETE_BUTTON}
            testSubId={mProps.testId}
          ></Button>
        </div>
      </div>
    </dialog>
  );
};
