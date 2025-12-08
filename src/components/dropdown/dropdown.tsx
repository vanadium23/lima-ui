import type { Placement } from "@floating-ui/dom";
import { createContext, type JSX, type Ref, Show, useContext } from "solid-js";
import { Dynamic, Portal } from "solid-js/web";

import { createDroppable } from "../utilities/createDroppable.ts";

export type DropdownProps = {
  children: JSX.Element;
  anchor: (props: { ref: Ref<HTMLButtonElement>; handleClick: () => void }) => JSX.Element;
  defaultPlacement?: Placement;
};

interface DropdownContextValue {
  close: () => void;
}

const DropdownContext = createContext<DropdownContextValue>();

export const useDropdown = () => useContext(DropdownContext);

export const Dropdown = (props: DropdownProps) => {
  const [isDropdownOpen, setIsDropdownOpen, setDropdownButtonRef, setDropdownRef, floatingPosition] = createDroppable(
    props.defaultPlacement,
  );

  const close = () => setIsDropdownOpen(false);

  return (
    <>
      <Dynamic
        component={props.anchor}
        ref={setDropdownButtonRef}
        handleClick={() => {
          setIsDropdownOpen((prev) => !prev);
        }}
      />
      <Show when={isDropdownOpen()}>
        <Portal mount={document.body}>
          <DropdownContext.Provider value={{ close }}>
            <div
              class="dropdown"
              role="none"
              style={
                floatingPosition
                  ? {
                      position: floatingPosition.strategy,
                      top: `${(floatingPosition.y ?? 0) / 10}rem`,
                      left: `${(floatingPosition.x ?? 0) / 10}rem`,
                      display: floatingPosition.middlewareData.hide?.referenceHidden ? "none" : "flex",
                    }
                  : {}
              }
              ref={setDropdownRef}
            >
              {props.children}
            </div>
          </DropdownContext.Provider>
        </Portal>
      </Show>
    </>
  );
};
