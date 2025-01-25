import { createEffect, createRoot, createSignal } from "solid-js";

const toolsPanelState = createRoot(() => {
  const [isHidden, setIsHidden] = createSignal(
    JSON.parse(localStorage.getItem("toolsPanelIsHidden") || "false"),
  );

  createEffect(() => {
    localStorage.setItem("toolsPanelIsHidden", JSON.stringify(isHidden()));
  });

  return { isHidden, setIsHidden };
});

export const { isHidden, setIsHidden } = toolsPanelState;
