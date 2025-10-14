import { autoUpdate, flip, hide, offset, shift } from "@floating-ui/dom";
import { useFloating, type UseFloatingResult } from "solid-floating-ui";
import {
  type Accessor,
  createEffect,
  createSignal,
  type JSX,
  mergeProps,
  onCleanup,
  type Setter,
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";

import type { Testable } from "../utilities/testable.ts";

import "./tooltip.css";

export enum TooltipTheme {
  Primary = "primary",
}

export enum TooltipSize {
  Medium = "medium",
}

export enum TooltipPlacement {
  Top = "top",
  Bottom = "bottom",
  Left = "left",
  Right = "right",
}

type TooltipProps = {
  children: JSX.Element;
  content: string;
  theme?: TooltipTheme;
  size?: TooltipSize;
  defaultPlacement?: TooltipPlacement;
};

type TooltipTypes = [
  Accessor<boolean>,
  Setter<boolean>,
  Accessor<HTMLElement | undefined>,
  Setter<HTMLElement | undefined>,
  Setter<HTMLElement | undefined>,
  UseFloatingResult,
];

function createTooltip(placement: TooltipPlacement): TooltipTypes {
  const [isTooltipOpen, setIsTooltipOpen] = createSignal(false);
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();
  const [tooltipRef, setTooltipRef] = createSignal<HTMLElement>();

  const floatingPosition = useFloating(triggerRef, tooltipRef, {
    placement,
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
    middleware: [offset(8), shift(), flip(), hide()],
  });

  return [isTooltipOpen, setIsTooltipOpen, triggerRef, setTriggerRef, setTooltipRef, floatingPosition];
}

export const Tooltip = (props: Testable<TooltipProps>) => {
  const mProps: Testable<Required<TooltipProps>> = mergeProps(
    {
      theme: TooltipTheme.Primary,
      size: TooltipSize.Medium,
      defaultPlacement: TooltipPlacement.Bottom,
    },
    props,
  );

  const [isTooltipOpen, setIsTooltipOpen, triggerRef, setTriggerRef, setTooltipRef, floatingPosition] = createTooltip(
    mProps.defaultPlacement,
  );

  createEffect(() => {
    const triggerEl = triggerRef();

    if (triggerEl) {
      const handleMouseEnter = () => setIsTooltipOpen(true);
      const handleMouseLeave = () => setIsTooltipOpen(false);
      const handleFocusIn = () => setIsTooltipOpen(true);
      const handleFocusOut = () => setIsTooltipOpen(false);

      triggerEl.addEventListener("mouseenter", handleMouseEnter);
      triggerEl.addEventListener("mouseleave", handleMouseLeave);
      triggerEl.addEventListener("focusin", handleFocusIn);
      triggerEl.addEventListener("focusout", handleFocusOut);

      onCleanup(() => {
        triggerEl.removeEventListener("mouseenter", handleMouseEnter);
        triggerEl.removeEventListener("mouseleave", handleMouseLeave);
        triggerEl.removeEventListener("focusin", handleFocusIn);
        triggerEl.removeEventListener("focusout", handleFocusOut);
      });
    }
  });

  return (
    <>
      <div ref={setTriggerRef} class="tooltipTrigger">
        {mProps.children}
      </div>
      <Show when={isTooltipOpen()}>
        <Portal mount={document.body}>
          <div
            ref={setTooltipRef}
            class="tooltip"
            classList={{
              [`tooltip_${mProps.size}`]: true,
              [`tooltip_${mProps.theme}`]: true,
            }}
            style={
              floatingPosition
                ? {
                    position: floatingPosition.strategy,
                    top: `${(floatingPosition.y ?? 0) / 10}rem`,
                    left: `${(floatingPosition.x ?? 0) / 10}rem`,
                    display: floatingPosition.middlewareData.hide?.referenceHidden ? "none" : "block",
                  }
                : {}
            }
            data-test-id={mProps.testId}
            role="tooltip"
          >
            {mProps.content}
          </div>
        </Portal>
      </Show>
    </>
  );
};
