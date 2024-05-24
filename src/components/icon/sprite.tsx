import { type Component } from "solid-js";
import { IconSize } from "./icon.tsx";

type SpriteProps = {
  size: IconSize;
  ariaHidden: boolean;
};

export const Cancel: Component<SpriteProps> = (props) => {
  return (
    <svg
      class={`icon icon_${props.size}`}
      viewBox="0 0 20 20"
      id="cancel"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={props.ariaHidden}
    >
      <circle
        class="svgCancelCircleAnimation"
        r="9"
        cx="-10"
        cy="-10"
        stroke-dasharray="56"
        stroke-dashoffset="0"
        stroke-width="2"
        fill="none"
        stroke-linecap="round"
        style={{ transform: "rotateY(-180deg) rotateZ(-90deg)" }}
      />
      <line
        class="svgCancelLine"
        x1="6"
        x2="14"
        y1="6"
        y2="14"
        stroke-width="2"
      />
      <line
        class="svgCancelLine"
        x1="6"
        x2="14"
        y1="14"
        y2="6"
        stroke-width="2"
      />
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
      aria-hidden={props.ariaHidden}
    >
      <path d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3H0V1H5V0H11V1H16V3H15V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM13 3H3V16H13V3ZM5 14H7V5H5V14ZM9 14H11V5H9V14Z" />
    </svg>
  );
};

export const Chevron: Component<SpriteProps> = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class={`icon icon_${props.size}`}
      id="chevron"
      viewBox="0 -960 960 960"
      aria-hidden={props.ariaHidden}
    >
      <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
    </svg>
  );
};

export const Loading: Component<SpriteProps> = (props) => {
  return (
    <svg
      class={`icon icon_${props.size}`}
      viewBox="0 0 12 12"
      id="loading"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={props.ariaHidden}
    >
      <path d="M6 11.8333C5.20278 11.8333 4.4493 11.6802 3.73958 11.3739C3.02986 11.0677 2.41007 10.6496 1.88021 10.1198C1.35034 9.58992 0.932289 8.97013 0.626039 8.26041C0.319789 7.55068 0.166664 6.79721 0.166664 5.99999C0.166664 5.19305 0.319789 4.43714 0.626039 3.73228C0.932289 3.02742 1.35034 2.41006 1.88021 1.8802C2.41007 1.35034 3.02986 0.932282 3.73958 0.626031C4.4493 0.319781 5.20278 0.166656 6 0.166656C6.16528 0.166656 6.30382 0.222559 6.41562 0.334365C6.52743 0.44617 6.58333 0.584712 6.58333 0.74999C6.58333 0.915268 6.52743 1.05381 6.41562 1.16561C6.30382 1.27742 6.16528 1.33332 6 1.33332C4.70694 1.33332 3.6059 1.78784 2.69687 2.69686C1.78784 3.60589 1.33333 4.70693 1.33333 5.99999C1.33333 7.29305 1.78784 8.39409 2.69687 9.30311C3.6059 10.2121 4.70694 10.6667 6 10.6667C7.29305 10.6667 8.39409 10.2121 9.30312 9.30311C10.2122 8.39409 10.6667 7.29305 10.6667 5.99999C10.6667 5.83471 10.7226 5.69617 10.8344 5.58436C10.9462 5.47256 11.0847 5.41666 11.25 5.41666C11.4153 5.41666 11.5538 5.47256 11.6656 5.58436C11.7774 5.69617 11.8333 5.83471 11.8333 5.99999C11.8333 6.79721 11.6802 7.55068 11.374 8.26041C11.0677 8.97013 10.6496 9.58992 10.1198 10.1198C9.58993 10.6496 8.97257 11.0677 8.26771 11.3739C7.56284 11.6802 6.80694 11.8333 6 11.8333Z" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 0 0"
        to="360 0 0"
        dur="1s"
        repeatCount="indefinite"
      />
    </svg>
  );
};
