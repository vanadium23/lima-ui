import { type Component } from "solid-js";
import Sprite from "./sprite.svg?url";
import "./icon.css";

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

export const Icon: Component<IconProps> = (props) => {
  return (
    <svg class={`icon icon_${props.size}`} aria-hidden="true">
      <use href={Sprite + "#" + props.name} />
    </svg>
  );
};
