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
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const [menuButtonRef, setMenuButtonRef] = createSignal<HTMLElement>();

  const [menuRef, setMenuRef] = createSignal<HTMLElement>();

  createEffect(() => {
    if (!isMenuOpen()) return;

    const handleClickOutside = (event: MouseEvent) => {
      const menuButtonEl = menuButtonRef();
      const menuEl = menuRef();

      if (
        menuEl &&
        menuButtonEl &&
        !menuEl.contains(event.target as Node) &&
        !menuButtonEl.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => {
      document.removeEventListener("mousedown", handleClickOutside);
    });
  });

  const floatingPosition = useFloating(menuButtonRef, menuRef, {
    placement: placement,
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
    middleware: [shift(), flip(), hide()], //TODO Подумать нужно ли Shift оставлять когда будет разработка под 320px
  });

  return [isMenuOpen, setIsMenuOpen, setMenuButtonRef, setMenuRef, floatingPosition];
}
