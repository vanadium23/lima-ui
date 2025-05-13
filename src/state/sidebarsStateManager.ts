import { createEffect, createRoot, createSignal } from "solid-js";

export const panelState = createRoot(() => {
  const [isSidebarHidden, setIsSidebarHidden] = createSignal(
    JSON.parse(localStorage.getItem("sidebarIsHidden") ?? "true"),
  );

  const [isToolsPanelHidden, setIsToolsPanelHidden] = createSignal(
    JSON.parse(localStorage.getItem("toolsPanelIsHidden") ?? "false"),
  );

  const toggleSidebar = () => {
    const willOpen = isSidebarHidden();
    setIsSidebarHidden(!willOpen);
    if (willOpen) setIsToolsPanelHidden(true);
  };

  const toggleToolsPanel = () => {
    const willOpen = isToolsPanelHidden();
    setIsToolsPanelHidden(!willOpen);
    if (willOpen) setIsSidebarHidden(true);
  };

  createEffect(() => {
    localStorage.setItem("sidebarIsHidden", JSON.stringify(isSidebarHidden()));
  });

  createEffect(() => {
    localStorage.setItem(
      "toolsPanelIsHidden",
      JSON.stringify(isToolsPanelHidden()),
    );
  });

  return {
    isSidebarHidden,
    isToolsPanelHidden,
    toggleSidebar,
    toggleToolsPanel,
  };
});
