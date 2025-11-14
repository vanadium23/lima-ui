import { createRoot, createSignal, onCleanup } from "solid-js";

export const panelState = createRoot(() => {
  const [isSidebarHidden, setIsSidebarHidden] = createSignal(true);
  const [isSidebarAlwaysHidden, setIsSidebarAlwaysHidden] = createSignal(false);
  const [isToolsPanelHidden, setIsToolsPanelHidden] = createSignal(true);

  const handleClickOutside = (event: MouseEvent) => {
    if (window.innerWidth >= 1024) return;

    const target = event.target as HTMLElement;

    const isSidebarToggleButton = target.closest("#sidebarToggle");
    const isToolsPanelToggleButton = target.closest("#toolsPanelToggle");

    if (isSidebarToggleButton || isToolsPanelToggleButton) {
      return;
    }

    const isOutsideSidebar = !target.closest(".sidebar");
    const isOutsideToolsPanel = !target.closest(".toolsPanel");

    if (isOutsideSidebar && isOutsideToolsPanel && (!isSidebarHidden() || !isToolsPanelHidden())) {
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

  const closeSidebar = () => {
    setIsSidebarAlwaysHidden(true);
  };

  const openSidebar = () => {
    setIsSidebarAlwaysHidden(false);
  };

  return {
    isSidebarHidden,
    isSidebarAlwaysHidden,
    isToolsPanelHidden,
    toggleSidebar,
    toggleToolsPanel,
    closeSidebar,
    openSidebar,
  };
});
