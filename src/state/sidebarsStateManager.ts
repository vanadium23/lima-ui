import { createRoot, createSignal, onCleanup, onMount } from "solid-js";

export const panelState = createRoot(() => {
  const [isSidebarHidden, setIsSidebarHidden] = createSignal(true);
  const [isToolsPanelHidden, setIsToolsPanelHidden] = createSignal(true);

  onMount(() => {
    const isMediumScreen = window.matchMedia(
      "(min-width: 768px) and (max-width: 1023px)",
    ).matches;

    if (isMediumScreen) {
      setIsToolsPanelHidden(false);
    }
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (window.innerWidth >= 768) return;

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

  return {
    isSidebarHidden,
    isToolsPanelHidden,
    toggleSidebar,
    toggleToolsPanel,
  };
});
