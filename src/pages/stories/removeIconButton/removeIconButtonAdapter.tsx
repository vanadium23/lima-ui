import { type Component } from "solid-js";
import { RemoveIconButton } from "../../../components/removeIconButton/removeIconButton.tsx";

export const RemoveIconButtonAdapter: Component = () => {
  return (
    <RemoveIconButton
      removeItem={() => {
        console.log("blet");
      }}
    />
  );
};
