import { type Component, mergeProps } from "solid-js";
import "./listStripe.css";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";

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
  listId: string;
};

export const ListStripe: Component<ListStripeProps> = (props) => {
  const mProps: Required<ListStripeProps> = mergeProps(props);

  function removeList() {
    fetch(`http://localhost:3000/lists/${mProps.listId}`, {
      method: "DELETE", // или 'PUT', 'DELETE', и т.д.
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data); // обработка полученных данных
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error,
        );
      });
  }
  return (
    <div
      class={`listStripe listStripe_${mProps.theme} listStripe_${mProps.size}`}
    >
      <a class="listStripe__link" href={mProps.link}>
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
        />
        <IconButton
          iconName={IconName.Trash}
          ariaLabel={`Удалить список ${mProps.listTitle}`}
          handleClick={removeList}
          theme={IconButtonTheme.Dangerous}
          size={IconButtonSize.Medium}
          testId={DEFAULT_TEST_ID}
        />
      </div>
    </div>
  );
};
