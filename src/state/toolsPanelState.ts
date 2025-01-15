import { createEffect, createSignal } from "solid-js";

const [isHidden, setIsHidden] = createSignal(
  JSON.parse(localStorage.getItem("toolsPanelIsHidden") || "false"),
);

createEffect(() => {
  localStorage.setItem("toolsPanelIsHidden", JSON.stringify(isHidden()));
});

export { isHidden, setIsHidden };
