import { createEffect, createRoot, createSignal, onCleanup } from "solid-js";

export const panelState = createRoot(() => {
  const [isSidebarHidden, setIsSidebarHidden] = createSignal(true);
  const [isToolsPanelHidden, setIsToolsPanelHidden] = createSignal(
    JSON.parse(localStorage.getItem("toolsPanelIsHidden") ?? "true"),
  );

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;

    const isSidebarToggleButton = target.closest("#sidebarToggle");
    const isToolsPanelToggleButton = target.closest("#toolsPanelToggle");

    if (isSidebarToggleButton || isToolsPanelToggleButton) {
      return;
    }

    const isOutsideSidebar = !target.closest(".sidebar");
    const isOutsideToolsPanel = !target.closest(".toolsPanel");

    if (
      isOutsideSidebar &&
      isOutsideToolsPanel &&
      (!isSidebarHidden() || !isToolsPanelHidden())
    ) {
      setIsSidebarHidden(true);
      setIsToolsPanelHidden(true);
    }
  };

  document.addEventListener("click", handleClickOutside);

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
  });

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
