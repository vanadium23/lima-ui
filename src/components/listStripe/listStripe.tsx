import { type Component, createSignal, mergeProps } from "solid-js";
import "./listStripe.css";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Dialog, DialogSize, DialogTheme } from "../dialog/dialog.tsx";

export enum ListStripeTheme {
  Primary = "primary",
}

export enum ListStripeSize {
  Medium = "medium",
}

type ListStripeProps = {
  listTitle: string;
  listPurpose: string;
  editLink: string;
  theme: ListStripeTheme;
  size: ListStripeSize;
  link: string;
  defaultListId: string;
  isRemoving?: boolean;
  staticOnRemoveSuccess: (defaultListId: string) => void;
  staticOnRemoveError: (removeError: boolean) => void;
};

export const ListStripe: Component<ListStripeProps> = (props) => {
  const mProps: Required<ListStripeProps> = mergeProps(
    {
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
        mProps.staticOnRemoveSuccess(mProps.defaultListId);
      })
      .catch((error) => {
        mProps.staticOnRemoveError(true);
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );
        setIsRemoving(false);
      });
  }

  return (
    <div
      class={`listStripe listStripe_${mProps.theme} listStripe_${mProps.size}`}
      classList={{
        listStripe_removing: listStripeIsRemoving(),
      }}
    >
      <a
        class="listStripe__link"
        href={listStripeIsRemoving() ? "#" : mProps.link}
      >
        <span class="listStripe__title" title={mProps.listTitle}>
          {mProps.listTitle}
        </span>
        <span class="listStripe__purpose" title={mProps.listPurpose}>
          {mProps.listPurpose}
        </span>
      </a>
      <div class="listStripe__controls">
        <IconButton
          iconName={IconName.Edit}
          ariaLabel={`Редактировать список ${mProps.listTitle}`}
          theme={IconButtonTheme.Primary}
          size={IconButtonSize.Medium}
          link={mProps.editLink}
          testId={DEFAULT_TEST_ID}
          componentType={IconButtonComponentType.Link}
          isDisabled={listStripeIsRemoving()}
        />
        <IconButton
          iconName={IconName.Trash}
          ariaLabel={`Удалить список ${mProps.listTitle}`}
          theme={IconButtonTheme.Dangerous}
          size={IconButtonSize.Medium}
          testId={DEFAULT_TEST_ID}
          handleClick={openDialog}
          isLoading={listStripeIsRemoving()}
        />
      </div>

      <Dialog
        theme={DialogTheme.Primary}
        size={DialogSize.Medium}
        testId={DEFAULT_TEST_ID}
        onConfirm={removeList}
        onCancel={closeDialog}
        isOpen={isDialogOpen()}
        title={"Удаление списка"}
      >
        <p>
          Список <strong>{mProps.listTitle}</strong> будет удален без
          возможности восстановления.
        </p>
      </Dialog>
    </div>
  );
};
