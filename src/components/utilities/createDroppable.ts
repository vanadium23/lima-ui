import { autoUpdate, flip, hide, type Placement, shift } from "@floating-ui/dom";
import { useFloating, type UseFloatingResult } from "solid-floating-ui";
import { type Accessor, createEffect, createSignal, onCleanup, type Setter } from "solid-js";

type Droppable = [
  Accessor<boolean>,
  Setter<boolean>,
  Setter<HTMLElement | undefined>,
  Setter<HTMLElement | undefined>,
  UseFloatingResult,
];

export function createDroppable(placement: Placement = "bottom-end"): Droppable {
  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);

  const [dropdownButtonRef, setDropdownButtonRef] = createSignal<HTMLElement>();

  const [dropdownRef, setDropdownRef] = createSignal<HTMLElement>();

  createEffect(() => {
    if (!isDropdownOpen()) return;

    const handleClickOutside = (event: MouseEvent) => {
      const dropdownButtonEl = dropdownButtonRef();
      const dropdownEl = dropdownRef();

      if (
        dropdownEl &&
        dropdownButtonEl &&
        !dropdownEl.contains(event.target as Node) &&
        !dropdownButtonEl.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  const floatingPosition = useFloating(dropdownButtonRef, dropdownRef, {
    placement: placement,
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
    middleware: [shift(), flip(), hide()], //TODO Подумать нужно ли Shift оставлять когда будет разработка под 320px
  });

  return [isDropdownOpen, setIsDropdownOpen, setDropdownButtonRef, setDropdownRef, floatingPosition];
}
