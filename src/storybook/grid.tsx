import { type ValidComponent } from "solid-js";
import { Dynamic } from "solid-js/web";

export enum GridCol {
  Primary = "primary",
  Secondary = "secondary",
  Successful = "successful",
  Dangerous = "dangerous",
}

type GridProps = {
  children?: ValidComponent | undefined;
};

export const Grid = (props: GridProps) => {
  return (
    <div class="grid">
      <Dynamic component={props.children} loading={true} />
    </div>
  );
};
