import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import "./removeIconButton.css";
import {
  IconButton,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import { IconName } from "../icon/icon.tsx";

type RemoveIconButtonProps = {
  removeItem: () => void;
};

export const RemoveIconButton: Component<RemoveIconButtonProps> = (props) => {
  const [getIconName, setIconName] = createSignal(IconName.Trash);

  let removeTimer: NodeJS.Timeout;
  const runRemove = () => {
    if (getIconName() !== IconName.Cancel) {
      setIconName(IconName.Cancel);
      removeTimer = setTimeout(() => {
        props.removeItem();
      }, 5000);
    } else {
      setIconName(IconName.Trash);
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
    />
  );
};
