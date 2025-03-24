import { autoUpdate, flip, hide, shift } from "@floating-ui/dom";
import { useFloating } from "solid-floating-ui";
import {
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js";

import { EDIT_LIST_INPUT_LIMIT } from "../../../configuration.ts";
import {
  CHECKBOX,
  DEFAULT_TEST_ID,
  DRAG_HANDLE,
  LIST_ITEM,
  LIST_ITEM_INPUT,
  OPEN_DROPDOWN_MENU_LIST_ITEM_BUTTON,
  REMOVE_ITEM_MENUITEM,
} from "../../../features/testIds.ts";
import {
  Checkbox,
  CheckboxSize,
  CheckboxTheme,
} from "../checkbox/checkbox.tsx";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { DropdownMenu } from "../dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import {
  ItemInput,
  ItemInputSize,
  ItemInputTheme,
} from "../itemInput/itemInput.tsx";
import { MenuItem, MenuItemTheme } from "../menuItem/menuItem.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./listItem.css";

export enum ListItemTheme {
  Primary = "primary",
}

export enum ListItemSize {
  Medium = "medium",
}

type ListItemProps = {
  theme?: ListItemTheme;
  size?: ListItemSize;
  removeItem: () => void;
  isDisabled?: boolean;
  isCheckable: boolean;
  isChecked: boolean;
  defaultValue?: string;
  name: string;
  dataId?: string;
  isOnlyOneItem?: boolean;
  isRequired?: boolean;
  onChange?: (value: string) => void;
  onAddBefore: () => void;
  onAddAfter: () => void;
  canAddMore: boolean;
};

export const ListItem = (props: Testable<ListItemProps>) => {
  const mProps: Testable<Required<ListItemProps>> = mergeProps(
    {
      theme: ListItemTheme.Primary,
      size: ListItemSize.Medium,
      isOnlyOneItem: false,
      isDisabled: false,
      isRequired: true,
      defaultValue: "",
      dataId: "",
      onChange: () => {},
    },
    props,
  );

  function removeItemIfEnabled() {
    if (!mProps.isDisabled) {
      mProps.removeItem();
    }
  }

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
    placement: "bottom-start",
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
    middleware: [shift(), flip(), hide()], //TODO Подумать нужно ли Shift оставлять когда будет разработка под 320px
  });

  return (
    <div
      class={`listItem listItem_${mProps.theme} listItem_${mProps.size}`}
      classList={{
        listItem_menuOpened: isMenuOpen(),
      }}
      data-test-id={LIST_ITEM}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="listItem__dragHandle">
        <DragHandle
          isDisabled={mProps.isDisabled}
          testId={DRAG_HANDLE}
          testSubId={mProps.testSubId ?? "0"}
        />
      </div>
      <Show when={mProps.isCheckable}>
        <div class="listItem__checkbox">
          <Checkbox
            theme={CheckboxTheme.Primary}
            size={CheckboxSize.Medium}
            testId={CHECKBOX}
            testSubId={mProps.testSubId ?? "0"}
            isDisabled={mProps.isDisabled}
            isChecked={mProps.isChecked}
          />
        </div>
      </Show>
      <div class="listItem__inner">
        <ItemInput
          theme={ItemInputTheme.Primary}
          size={ItemInputSize.Medium}
          maxLength={EDIT_LIST_INPUT_LIMIT}
          name={mProps.name}
          dataId={mProps.dataId}
          isDisabled={mProps.isDisabled}
          placeholder={"Пункт списка"}
          defaultValue={mProps.defaultValue}
          isRequired={mProps.isRequired}
          onChange={mProps.onChange}
          testId={LIST_ITEM_INPUT}
          testSubId={mProps.testSubId ?? "0"}
        />
        <div class="listItem__controls">
          <IconButton
            iconName={IconName.DotsThreeCircle}
            ariaLabel={"Выпадающее меню"}
            theme={IconButtonTheme.Primary}
            size={IconButtonSize.Medium}
            componentType={IconButtonComponentType.Button}
            testId={OPEN_DROPDOWN_MENU_LIST_ITEM_BUTTON}
            testSubId={mProps.testSubId ?? "0"}
            ref={setMenuButtonRef}
            handleClick={() => setIsMenuOpen((prev) => !prev)}
          />
          <Show when={isMenuOpen()}>
            <DropdownMenu
              ref={setMenuRef}
              floatingStyles={floatingPosition}
              testId={DEFAULT_TEST_ID}
            >
              <MenuItem
                text={"Добавить пункт выше"}
                icon={IconName.Plus}
                testId={DEFAULT_TEST_ID}
                handleClick={mProps.onAddBefore}
                isDisabled={!mProps.canAddMore}
              />
              <MenuItem
                text={"Добавить пункт ниже"}
                icon={IconName.Plus}
                testId={DEFAULT_TEST_ID}
                handleClick={mProps.onAddAfter}
                isDisabled={!mProps.canAddMore}
              />
              <MenuItem
                text={"Импортировать пункт выше"}
                icon={IconName.SortDescending}
                testId={DEFAULT_TEST_ID}
              />
              <MenuItem
                text={"Импортировать пункт нише"}
                icon={IconName.SortAscending}
                testId={DEFAULT_TEST_ID}
              />
              <MenuItem
                text={"Удалить пункт"}
                theme={MenuItemTheme.Dangerous}
                icon={IconName.Trash}
                handleClick={removeItemIfEnabled}
                testId={REMOVE_ITEM_MENUITEM}
                testSubId={mProps.testSubId ?? "0"}
                isDisabled={mProps.isOnlyOneItem}
              />
            </DropdownMenu>
          </Show>
        </div>
      </div>
    </div>
  );
};
