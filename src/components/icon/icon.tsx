import { type Component, createEffect } from "solid-js";
import "./icon.css";
import { Cancel, Trash } from "./sprite.tsx";

export enum IconName {
  Cancel = "cancel",
  Trash = "trash",
}

export enum IconSize {
  x7 = "x7",
  x10 = "x10",
  x12 = "x12",
}

type IconProps = {
  name: IconName;
  size: IconSize;
};

const icons = {
  [IconName.Cancel]: Cancel,
  [IconName.Trash]: Trash,
};

export const Icon: Component<IconProps> = (props) => {
  let Sprite = icons[props.name];

  createEffect(() => {
    Sprite = icons[props.name];
  });

  return (
    <svg class={`icon icon_${props.size}`} aria-hidden="true">
      <Sprite size={props.size} />
    </svg>
  );
};
