import { createSignal, mergeProps, Show } from "solid-js";

import {
  DEFAULT_TEST_ID,
  LIST_ITEM_CONTEXT_MENU,
  LIST_STRIPE,
  LIST_STRIPE_LINK_TO_VIEW,
  LIST_STRIPE_REMOVE_BUTTON,
  OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
  REMOVE_DIALOG_REMOVE_LIST_BUTTON,
  REMOVE_LIST_DIALOG,
} from "../../../features/testIds.ts";
import { removeList } from "../../widgets/editList/services/removeList.ts";
import { soften } from "../../widgets/editList/utilities/soften.ts";
import { Button, ButtonSize, ButtonTheme } from "../button/button.tsx";
import { Dialog, DialogSize, DialogTheme } from "../dialog/dialog.tsx";
import { DropdownMenu } from "../dropdownMenu/dropdownMenu.tsx";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonSize } from "../iconButton/iconButton.tsx";
import { MenuItemTheme } from "../menuItem/menuItem.tsx";
import { Tooltip } from "../tooltip/tooltip.tsx";
import { type Testable } from "../utilities/testable.ts";

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
  link: string;
  listId: string;
  isRemoving?: boolean;
  isExported?: boolean;
  onRemoveSuccess: (listId: string) => void;
  onRemoveError: (removeError: boolean) => void;
};

export const ListStripe = (props: Testable<ListStripeProps>) => {
  const mProps: Testable<Required<ListStripeProps>> = mergeProps(
    {
      theme: ListStripeTheme.Primary,
      size: ListStripeSize.Medium,
      isRemoving: false,
      isExported: false,
    },
    props,
  );

  const [isDialogOpen, setIsDialogOpen] = createSignal(false);

  const [isRemoving, setIsRemoving] = createSignal(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const exportedTooltipMessage = "Список экспортирован в другие списки";

  function listStripeIsRemoving() {
    return isRemoving() || mProps.isRemoving;
  }

  const menuItems = () => [
    {
      text: "Удалить",
      icon: IconName.Trash,
      handleClick: openDialog,
      theme: MenuItemTheme.Dangerous,
      testId: LIST_STRIPE_REMOVE_BUTTON,
      testSubId: mProps.testSubId,
    },
  ];

  function removeListFromListStripe() {
    mProps.onRemoveError(false);
    setIsRemoving(true);
    setIsDialogOpen(false);

    removeList(mProps.listId)
      .then(() => {
        soften(() => mProps.onRemoveSuccess(mProps.listId));
      })
      .catch((error) => {
        soften(() => {
          mProps.onRemoveError(true);
          console.error("There has been a problem with your fetch operation:", error);
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
      data-test-sub-id={mProps.testSubId}
    >
      <div class="listStripe__icon">
        <Show when={mProps.isExported}>
          <Tooltip content={exportedTooltipMessage} testId={DEFAULT_TEST_ID}>
            <Icon name={IconName.Link} size={IconSize.Small} role={"img"} ariaLabel={exportedTooltipMessage} />
          </Tooltip>
        </Show>
      </div>

      {/* MAKSIM: Подумалось, что можно подменять сам тег <a> на какой-нибудь другой при помощи <Dynamic> во время удаления, чтобы не прыгать с #. */}
      <a
        class="listStripe__link"
        href={listStripeIsRemoving() ? "#" : mProps.link}
        data-test-id={LIST_STRIPE_LINK_TO_VIEW}
        data-test-sub-id={mProps.testSubId}
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
        <DropdownMenu
          component={(props) => (
            <IconButton
              ref={props.ref}
              componentType={IconButtonComponentType.Button}
              handleClick={props.handleClick}
              testId={OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON}
              testSubId={mProps.testSubId || "0"}
              size={IconButtonSize.MediumEmbedded}
              iconName={IconName.DotsThree}
              ariaLabel={"Выпадающее меню"}
              loading={listStripeIsRemoving()}
            />
          )}
          testId={LIST_ITEM_CONTEXT_MENU}
          menuItems={menuItems()}
        />
      </div>

      <Dialog
        theme={DialogTheme.Primary}
        size={DialogSize.Medium}
        onCancel={closeDialog}
        isOpen={isDialogOpen()}
        title={"Удаление списка"}
        testId={REMOVE_LIST_DIALOG}
        testSubId={mProps.testSubId || "0"}
        controls={
          <Button
            theme={ButtonTheme.Dangerous}
            size={ButtonSize.Medium}
            text={"Удалить"}
            handleClick={() => {
              removeListFromListStripe();
              closeDialog();
            }}
            testId={REMOVE_DIALOG_REMOVE_LIST_BUTTON}
            testSubId={mProps.testSubId || "0"}
          />
        }
      >
        <p>
          Список <strong>{mProps.listTitle}</strong> будет удален без возможности восстановления.
        </p>
      </Dialog>
    </div>
  );
};
