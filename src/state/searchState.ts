import { createRoot, createSignal } from "solid-js";

export const searchState = createRoot(() => {
  const [isOpen, setIsOpen] = createSignal(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
  };
});
