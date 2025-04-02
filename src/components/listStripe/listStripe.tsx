import { autoUpdate, flip, hide, shift } from "@floating-ui/dom";
import { useFloating } from "solid-floating-ui";
import {
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js";

import {
  DEFAULT_TEST_ID,
  LIST_STRIPE,
  LIST_STRIPE_LINK_TO_VIEW,
  REMOVE_ITEM_MENUITEM,
  REMOVE_LIST_DIALOG,
} from "../../../features/testIds.ts";
import { LISTS } from "../../../utilities/addresses.ts";
import { soften } from "../../widgets/editList/utilities/soften.ts";
import { Dialog, DialogSize, DialogTheme } from "../dialog/dialog.tsx";
import { DropdownMenu } from "../dropdownMenu/dropdownMenu.tsx";
import { IconName } from "../icon/icon.tsx";
import { IconButton } from "../iconButton/iconButton.tsx";
import { MenuItem, MenuItemTheme } from "../menuItem/menuItem.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./listStripe.css";

export enum ListStripeTheme {
  Primary = "primary",
}

export enum ListStripeSize {
  Medium = "medium",
}

type ListStripeProps = {
  theme?: ListStripeTheme;
  size?: ListStripeSize;
  listTitle: string;
  listPurpose: string;
  editLink: string;
  link: string;
  defaultListId: string;
  isRemoving?: boolean;
  staticOnRemoveSuccess: (defaultListId: string) => void;
  staticOnRemoveError: (removeError: boolean) => void;
};

export const ListStripe = (props: Testable<ListStripeProps>) => {
  const mProps: Testable<Required<ListStripeProps>> = mergeProps(
    {
      theme: ListStripeTheme.Primary,
      size: ListStripeSize.Medium,
      isRemoving: false,
    },
    props,
  );

  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  const [isRemoving, setIsRemoving] = createSignal(false);

  //для работы дропдауна
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  const [menuButtonRef, setMenuButtonRef] = createSignal<HTMLElement>();

  const [menuRef, setMenuRef] = createSignal<HTMLElement>();

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

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

  function listStripeIsRemoving() {
    return isRemoving() || mProps.isRemoving;
  }
  const floatingPosition = useFloating(menuButtonRef, menuRef, {
    placement: "bottom-start",
    whileElementsMounted: (reference, floating, update) =>
      autoUpdate(reference, floating, update, {
        animationFrame: true,
      }),
    middleware: [shift(), flip(), hide()], //TODO Подумать нужно ли Shift оставлять когда будет разработка под 320px
  });

  function removeList() {
    mProps.staticOnRemoveError(false);
    setIsRemoving(true);
    setIsDialogOpen(false);
    fetch(`${import.meta.env.PUBLIC_API_URL}${LISTS}${mProps.defaultListId}`, {
      method: "DELETE", // или 'PUT', 'DELETE', и т.д.
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }

        return response.json();
      })
      .then(() => {
        soften(() => mProps.staticOnRemoveSuccess(mProps.defaultListId));
      })
      .catch((error) => {
        soften(() => {
          mProps.staticOnRemoveError(true);
          console.error(
            "There has been a problem with your fetch operation:",
            error,
          );
          setIsRemoving(false);
        });
      });
  }

  return (
    <div
      class={`listStripe listStripe_${mProps.theme} listStripe_${mProps.size}`}
      classList={{
        listStripe_removing: listStripeIsRemoving(),
      }}
      data-test-id={LIST_STRIPE}
      data-test-sub-id={mProps.defaultListId}
    >
      {/* MAKSIM: Подумалось, что можно подменять сам тег <a> на какой-нибудь другой при помощи <Dynamic> во время удаления, чтобы не прыгать с #. */}
      <a
        class="listStripe__link"
        href={listStripeIsRemoving() ? "#" : mProps.link}
        data-test-id={LIST_STRIPE_LINK_TO_VIEW}
        data-test-sub-id={mProps.defaultListId}
      >
        <span class="listStripe__title" title={mProps.listTitle}>
          {mProps.listTitle}
        </span>
        <span class="listStripe__purpose" title={mProps.listPurpose}>
          {mProps.listPurpose}
        </span>
      </a>
      {/* MAKSIM: Скрываются в состоянии Loading, когда нет Hover'а. */}
      <div class="listStripe__controls">
        <IconButton
          iconName={IconName.DotsThreeVertical}
          ariaLabel={"Выпадающее меню"}
          testId={DEFAULT_TEST_ID}
          testSubId={mProps.testSubId ?? "0"}
          ref={setMenuButtonRef}
          handleClick={() => setIsMenuOpen((prev) => !prev)}
          isLoading={listStripeIsRemoving()}
        />
        <Show when={isMenuOpen()}>
          <DropdownMenu
            ref={setMenuRef}
            floatingStyles={floatingPosition}
            testId={DEFAULT_TEST_ID}
          >
            <MenuItem
              text={"Удалить"}
              theme={MenuItemTheme.Dangerous}
              icon={IconName.Trash}
              handleClick={openDialog}
              testId={REMOVE_ITEM_MENUITEM}
              testSubId={mProps.testSubId ?? "0"}
            />
          </DropdownMenu>
        </Show>
      </div>

      <Dialog
        theme={DialogTheme.Primary}
        size={DialogSize.Medium}
        onConfirm={removeList}
        onCancel={closeDialog}
        isOpen={isDialogOpen()}
        title={"Удаление списка"}
        testId={REMOVE_LIST_DIALOG}
        testSubId={mProps.defaultListId}
      >
        <p>
          Список <strong>{mProps.listTitle}</strong> будет удален без
          возможности восстановления.
        </p>
      </Dialog>
    </div>
  );
};
