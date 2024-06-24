import type { Component } from "solid-js";
import "./profileButton.css";

type profileButtonProps = {
  text: string;
  url: string;
};

export const ProfileButton: Component<profileButtonProps> = (props) => {
  return (
    <a href={props.url} class="profileButton">
      {props.text}
    </a>
  );
};
