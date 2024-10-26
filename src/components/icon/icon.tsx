import { type Component } from "solid-js";
import "./icon.css";
import * as icons from "./sprite.tsx";
import { Dynamic } from "solid-js/web";

export enum IconName {
  Cancel = "Cancel",
  Trash = "Trash",
  Chevron = "Chevron",
  Loading = "Loading",
  Home = "Home",
  AddGroup = "AddGroup",
  Edit = "Edit",
  Check = "Check",
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
