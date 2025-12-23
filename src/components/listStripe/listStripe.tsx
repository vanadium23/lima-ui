import { createSignal, mergeProps, Show } from "solid-js";

import {
  DEFAULT_TEST_ID,
  LIST_ITEM_CONTEXT_MENU,
  LIST_REMOVAL_ERROR,
  LIST_STRIPE,
  LIST_STRIPE_LINK_TO_VIEW,
  LIST_STRIPE_REMOVE_BUTTON,
  OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON,
  REMOVE_LIST_DIALOG,
} from "../../../features/testIds.ts";
import { soften } from "../../../utilities/soften.ts";
import { notificationState } from "../../state/pushNotificationStateManager.ts";
import { type DeletionMethod, removeList } from "../../widgets/editList/services/removeList.ts";
import { Dropdown } from "../dropdown/dropdown.tsx";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonSize } from "../iconButton/iconButton.tsx";
import { Menu } from "../menu/menu.tsx";
import { MenuItemTheme } from "../menuItem/menuItem.tsx";
import { RemoveDialog } from "../removeDialog/removeDialog.tsx";
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
  removing?: boolean;
  isExportedList?: boolean;
  hasExportedItems?: boolean;
  onRemoveSuccess: (listId: string) => void;
};

export const ListStripe = (props: Testable<ListStripeProps>) => {
  const mProps: Testable<Required<ListStripeProps>> = mergeProps(
    {
      theme: ListStripeTheme.Primary,
      size: ListStripeSize.Medium,
      removing: false,
      isExportedList: false,
      hasExportedItems: false,
    },
    props,
  );

  const [isOpenRemoveDialog, setOpenRemoveDialog] = createSignal(false);

  const [isRemoving, setIsRemoving] = createSignal(false);

  const exportedTooltipMessage = "Список экспортирован в другие списки";

  function listStripeIsRemoving() {
    return isRemoving() || mProps.removing;
  }

  const menuItems = () => [
    {
      children: "Удалить",
      icon: IconName.Trash,
      handleClick: () => {
        setOpenRemoveDialog(true);
      },
      theme: MenuItemTheme.Dangerous,
      testId: LIST_STRIPE_REMOVE_BUTTON,
      testSubId: mProps.testSubId,
    },
  ];

  function removeListFromListStripe(deletionMethod: DeletionMethod = "") {
    setIsRemoving(true);

    removeList(mProps.listId, deletionMethod)
      .then(() => {
        soften(() => mProps.onRemoveSuccess(mProps.listId));
      })
      .catch((error) => {
        soften(() => {
          notificationState.pushNetworkError(
            "Ошибка удаления",
            "Не удалось удалить список. Попробуйте ещё раз",
            LIST_REMOVAL_ERROR,
          );
          console.error("There has been a problem with your fetch operation:", error);
          setIsRemoving(false);
        });
      });
  }

  return (
    <div
      class="listStripe"
      classList={{
        [`listStripe_${mProps.size}`]: true,
        [`listStripe_${mProps.theme}`]: true,
        listStripe_removing: listStripeIsRemoving(),
      }}
      data-test-id={LIST_STRIPE}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="listStripe__icon">
        <Show when={mProps.isExportedList}>
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
        <Dropdown
          defaultPlacement={"bottom-end"}
          anchor={(props) => (
            <IconButton
              ref={props.ref}
              handleClick={props.handleClick}
              testId={OPEN_CONTEXT_MENU_LIST_STRIPE_BUTTON}
              testSubId={mProps.testSubId || "0"}
              size={IconButtonSize.MediumEmbedded}
              iconName={IconName.DotsThree}
              ariaLabel={"Выпадающее меню"}
              loading={listStripeIsRemoving()}
            />
          )}
        >
          <Menu testId={LIST_ITEM_CONTEXT_MENU}>{menuItems()}</Menu>
        </Dropdown>
      </div>

      <RemoveDialog
        hasExported={mProps.hasExportedItems || mProps.isExportedList}
        listName={mProps.listTitle}
        sendListRemove={removeListFromListStripe}
        open={isOpenRemoveDialog()}
        onCancel={() => {
          setOpenRemoveDialog(false);
        }}
        testId={REMOVE_LIST_DIALOG}
        testSubId={mProps.testSubId || "0"}
      />
    </div>
  );
};
