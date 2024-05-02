import { type Component, Match, Switch } from "solid-js";
import "./icon.css";
import { Cancel, Chevron, Trash } from "./sprite.tsx";

export enum IconName {
  Cancel = "cancel",
  Trash = "trash",
  Chevron = "chevron",
}

export enum IconSize {
  x7 = "x7",
  x9 = "x9",
  x10 = "x10",
  x11 = "x11",
  x12 = "x12",
}

type IconProps = {
  name: IconName;
  size: IconSize;
};

export const Icon: Component<IconProps> = (props) => {
  return (
    <Switch>
      <Match when={props.name === IconName.Trash}>
        {/* TODO Придумать как сделать здесь красивый цикл */}
        <Trash size={props.size} ariaHidden={true} />
      </Match>
      <Match when={props.name === IconName.Cancel}>
        <Cancel size={props.size} ariaHidden={true} />
      </Match>
      <Match when={props.name === IconName.Chevron}>
        <Chevron size={props.size} ariaHidden={true} />
      </Match>
    </Switch>
  );
};
