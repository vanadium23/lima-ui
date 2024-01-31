import type { Component } from "solid-js";
import Sprite from "./sprite.svg?url";
import "./icon.css";

export enum IconName {
  Cancel = "cancel",
  Trash = "trash",
}

type IconProps = {
  name: IconName;
};

export const Icon: Component<IconProps> = (props) => {
  return (
    <svg class="icon icon_4x" aria-hidden="true">
      <use href={Sprite + "#" + props.name} />
    </svg>
  );
};
