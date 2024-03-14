import { type Component, Switch, Match } from "solid-js";
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

export const Icon: Component<IconProps> = (props) => {
  return (
    <svg class={`icon icon_${props.size}`} aria-hidden="true">
      <Switch>
        <Match when={props.name === IconName.Trash}>
          <Trash size={props.size} />
        </Match>
        <Match when={props.name === IconName.Cancel}>
          <Cancel size={props.size} />
        </Match>
      </Switch>
    </svg>
  );
};
