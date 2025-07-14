import { For, mergeProps, Show } from "solid-js";
import { Portal } from "solid-js/web";

import { DEFAULT_TEST_ID } from "../../../features/testIds";
import { DropdownMenu } from "../dropdownMenu/dropdownMenu";
import { IconName } from "../icon/icon";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
} from "../iconButton/iconButton";
import type { MenuItemProps } from "../menuItem/menuItem";
import { MenuItem } from "../menuItem/menuItem";
import { createDroppable } from "../utilities/createDroppable";
import type { Testable, TestId } from "../utilities/testable";

type DropdownMenuWrapper = {
  iconName: IconName;
  listOfButtons: MenuItemProps[];
  iconSize: IconButtonSize;
  dropDownMenuTestId: TestId;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export const DropdownMenuWrapper = (props: Testable<DropdownMenuWrapper>) => {
  const mProps: Testable<Required<DropdownMenuWrapper>> = mergeProps(
    {
      isDisabled: false,
      isLoading: false,
    },
    props,
  );

  const [
    isMenuOpen,
    setIsMenuOpen,
    setMenuButtonRef,
    setMenuRef,
    floatingPosition,
  ] = createDroppable();

  return (
    <>
      <IconButton
        iconName={mProps.iconName}
        ariaLabel={"Выпадающее меню"}
        size={mProps.iconSize}
        componentType={IconButtonComponentType.Button}
        testId={mProps.testId}
        testSubId={mProps.testSubId ?? "0"}
        ref={setMenuButtonRef}
        handleClick={() => setIsMenuOpen((prev) => !prev)}
        isLoading={mProps.isLoading}
        isDisabled={mProps.isDisabled}
      />
      <Show when={isMenuOpen()}>
        <Portal mount={document.body}>
          <DropdownMenu
            ref={setMenuRef}
            floatingStyles={floatingPosition}
            testId={mProps.dropDownMenuTestId}
          >
            <For each={mProps.listOfButtons}>
              {(button) => (
                <MenuItem
                  testId={DEFAULT_TEST_ID}
                  testSubId={mProps.testSubId || "0"}
                  {...button}
                  handleClick={() => {
                    button.handleClick?.();
                    setIsMenuOpen(false);
                  }}
                  isDisabled={button.isDisabled || mProps.isDisabled}
                />
              )}
            </For>
          </DropdownMenu>
        </Portal>
      </Show>
    </>
  );
};
