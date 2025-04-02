import type { UseFloatingResult } from "solid-floating-ui";
import { type JSX, mergeProps, type Ref } from "solid-js";

import type { Testable } from "../utilities/testable.ts";

import "./dropdownMenu.css";

export enum DropdownMenuTheme {
  Primary = "primary",
}

export enum DropdownMenuSize {
  Medium = "medium",
}

type DropdownMenuProps = {
  theme?: DropdownMenuTheme;
  size?: DropdownMenuSize;
  children: JSX.Element;
  ref?: Ref<HTMLUListElement>;
  floatingStyles?: UseFloatingResult | null;
};

export const DropdownMenu = (props: Testable<DropdownMenuProps>) => {
  const mProps: Testable<Required<DropdownMenuProps>> = mergeProps(
    {
      theme: DropdownMenuTheme.Primary,
      size: DropdownMenuSize.Medium,
      isDisabled: false,
      handleClick: () => { },
      ref: () => { },
      floatingStyles: null,
    },
    props,
  );

  return (
    <ul
      role="menu"
      class={`dropdownMenu dropdownMenu_${mProps.theme} dropdownMenu_${mProps.size}`}
      style={
        mProps.floatingStyles
          ? {
            position: mProps.floatingStyles.strategy,
            top: `${(mProps.floatingStyles.y ?? 0) / 10}rem`,
            left: `${(mProps.floatingStyles.x ?? 0) / 10}rem`,
            display: mProps.floatingStyles.middlewareData.hide
              ?.referenceHidden
              ? "none"
              : "flex",
          }
          : {}
      }
      ref={mProps.ref}
    >
      {mProps.children}
    </ul>
  );
};
