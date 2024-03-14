import { type Component } from "solid-js";
import { IconSize } from "./icon.tsx";

type SpriteProps = {
  size: IconSize;
};

export const Cancel: Component<SpriteProps> = (props) => {
  return (
    <svg
      class={`icon icon_${props.size}`}
      viewBox="0 0 20 20"
      id="cancel"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="cancel-circle-animation"
        r="9"
        cx="-10"
        cy="-10"
        stroke-dasharray="56"
        stroke-dashoffset="0"
        stroke-width="2"
        stroke="red"
        fill="none"
        stroke-linecap="round"
        style={{ transform: "rotateY(-180deg) rotateZ(-90deg)" }}
      />
      <line
        class="cancel2"
        x1="6"
        x2="14"
        y1="6"
        y2="14"
        stroke-width="2"
        stroke="red"
      />
      <line x1="6" x2="14" y1="14" y2="6" stroke-width="2" stroke="red" />
    </svg>
  );
};

export const Trash: Component<SpriteProps> = (props) => {
  return (
    <svg
      class={`icon icon_${props.size}`}
      viewBox="0 0 16 18"
      id="trash"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" />
    </svg>
  );
};
