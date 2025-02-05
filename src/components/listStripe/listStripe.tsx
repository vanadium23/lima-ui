import { createSignal, mergeProps } from "solid-js";
import {
  LIST_STRIPE,
  LIST_STRIPE_EDIT_BUTTON,
  LIST_STRIPE_LINK_TO_VIEW,
  LIST_STRIPE_REMOVE_BUTTON,
  REMOVE_LIST_DIALOG,
} from "../../../features/testIds.ts";
import { soften } from "../../widgets/editList/utilities/soften.ts";
import { Dialog, DialogSize, DialogTheme } from "../dialog/dialog.tsx";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
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

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  function listStripeIsRemoving() {
    return isRemoving() || mProps.isRemoving;
  }

  function removeList() {
    mProps.staticOnRemoveError(false);
    setIsRemoving(true);
    setIsDialogOpen(false);

    fetch(`${import.meta.env.PUBLIC_API_URL}/lists/${mProps.defaultListId}`, {
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
          iconName={IconName.DotsThreeCircle}
          ariaLabel={`Выпадающее меню для списка ${mProps.listTitle}`}
          theme={IconButtonTheme.Primary}
          size={IconButtonSize.Medium}
          link={mProps.editLink}
          componentType={IconButtonComponentType.Link}
          isDisabled={listStripeIsRemoving()}
          testId={LIST_STRIPE_EDIT_BUTTON}
          testSubId={mProps.defaultListId}
        />
        <IconButton
          iconName={IconName.Trash}
          ariaLabel={`Удалить список ${mProps.listTitle}`}
          theme={IconButtonTheme.Dangerous}
          size={IconButtonSize.Medium}
          handleClick={openDialog}
          isLoading={listStripeIsRemoving()}
          testId={LIST_STRIPE_REMOVE_BUTTON}
          testSubId={mProps.defaultListId}
        />
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
