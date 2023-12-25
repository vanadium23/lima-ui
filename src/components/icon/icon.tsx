import type { Component } from "solid-js";
import Sprite from "./sprite.svg?url";
import "./icon.css";

type IconProps = {
  type: "cross" | "warning";
};

export const Icon: Component<IconProps> = (props) => {
  return (
    <svg class="icon icon_4x" aria-hidden="true">
      <use href={Sprite + "#" + props.type} />
    </svg>
  );
};
