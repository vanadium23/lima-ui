import { type Component } from "solid-js";
import "./icon.css";
import * as icons from "./sprite.tsx";
import { Dynamic } from "solid-js/web";

// GERMAN Слишком сложно добавлять иконки, надо в 50 мест написать название иконки

export enum IconName {
  Cancel = "Cancel",
  Trash = "Trash",
  Chevron = "Chevron",
  Loading = "Loading",
  Home = "Home",
  AddGroup = "AddGroup",
}

export enum IconSize {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

type IconProps = {
  name: IconName;
  size: IconSize;
};

export const Icon: Component<IconProps> = (props) => {
  return (
    <Dynamic
      component={icons[props.name]}
      size={props.size}
      ariaHidden={true}
    />
  );
};
