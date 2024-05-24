import { type Component, Match, Switch } from "solid-js";
import "./icon.css";
import { Cancel, Chevron, Trash, Loading } from "./sprite.tsx";

// GERMAN Слишком сложно добавлять иконки, надо в 50 мест написать название иконки

export enum IconName {
  Cancel = "cancel",
  Trash = "trash",
  Chevron = "chevron",
  Loading = "loading",
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
      {/* GERMAN Придумать как сделать здесь красивый цикл */}
      <Match when={props.name === IconName.Trash}>
        <Trash size={props.size} ariaHidden={true} />
      </Match>
      <Match when={props.name === IconName.Cancel}>
        <Cancel size={props.size} ariaHidden={true} />
      </Match>
      <Match when={props.name === IconName.Chevron}>
        <Chevron size={props.size} ariaHidden={true} />
      </Match>
      <Match when={props.name === IconName.Loading}>
        <Loading size={props.size} ariaHidden={true} />
      </Match>
    </Switch>
  );
};
