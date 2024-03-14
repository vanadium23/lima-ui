import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import "./removeIconButton.css";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import { IconName } from "../icon/icon.tsx";
import type { Testable } from "../utilities/testable.ts";

type RemoveIconButtonProps = {
  removeItem: () => void;
  onTimerStart: () => void;
  onTimerCancel: () => void;
  isDisabled: boolean;
};

export const RemoveIconButton: Component<Testable<RemoveIconButtonProps>> = (
  props,
) => {
  const [getIconName, setIconName] = createSignal(IconName.Trash);

  let removeTimer: NodeJS.Timeout;
  const runRemove = () => {
    if (getIconName() !== IconName.Cancel) {
      setIconName(IconName.Cancel);
      props.onTimerStart();

      removeTimer = setTimeout(() => {
        props.removeItem();
      }, 5000);
    } else {
      setIconName(IconName.Trash);
      props.onTimerCancel();
      clearTimeout(removeTimer);
    }
  };

  return (
    <IconButton
      iconName={getIconName()}
      ariaLabel={"Remove Item"}
      theme={IconButtonTheme.Dangerous}
      size={IconButtonSize.Medium}
      handleClick={runRemove}
      isDisabled={props.isDisabled}
      testId={props.testId}
      testSubId={props.testSubId ?? ""}
    />
  );
};
