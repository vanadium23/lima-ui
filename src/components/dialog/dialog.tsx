import { type Component, createEffect, type JSX, mergeProps } from "solid-js";
import type { Testable } from "../utilities/testable.ts";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Button, ButtonSize, ButtonTheme } from "../button/button.tsx";
import "./dialog.css";
import {
  TextButton,
  TextButtonSize,
  TextButtonTheme,
} from "../textButton/textButton.tsx";

export enum DialogTheme {
  Primary = "primary",
}

export enum DialogSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type DialogProps = {
  size: DialogSize;
  children: JSX.Element;
  theme: DialogTheme;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
  title: string;
};

export const Dialog: Component<Testable<DialogProps>> = (props) => {
  const mProps: Testable<Required<DialogProps>> = mergeProps(
    {
      isOpen: false,
      link: "",
      onConfirm: () => {},
      onCancel: () => {},
    },
    props,
  );

  let dialogRef: HTMLDialogElement | undefined = undefined;

  createEffect(() => {
    if (mProps.isOpen && dialogRef) {
      dialogRef.showModal(); // Открываем диалог через showModal()
    }
  });

  // Функция для закрытия диалога
  const closeDialog = () => {
    if (dialogRef) {
      dialogRef.close(); // Закрываем диалог вручную
    }
  };

  return (
    <dialog
      class={`dialog dialog_${mProps.theme} dialog_${mProps.size}`}
      aria-label={mProps.title}
      aria-modal={mProps.isOpen}
      ref={(el) => (dialogRef = el)}
    >
      <h2 class="dialog__title">{mProps.title}</h2>
      <div class="dialog__content">{mProps.children}</div>
      <div class="dialog__controls">
        <TextButton
          theme={TextButtonTheme.Primary}
          size={TextButtonSize.Medium}
          testId={DEFAULT_TEST_ID}
          text={"Вернуться"}
          handleClick={() => {
            mProps.onCancel();
            closeDialog();
          }}
        ></TextButton>
        <Button
          theme={ButtonTheme.Dangerous}
          size={ButtonSize.Medium}
          testId={DEFAULT_TEST_ID}
          text={"Удалить"}
          handleClick={() => {
            mProps.onConfirm();
            closeDialog();
          }}
        ></Button>
      </div>
    </dialog>
  );
};
