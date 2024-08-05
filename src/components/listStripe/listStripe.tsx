import { type Component, mergeProps } from "solid-js";
import "./listStripe.css";
import { IconName } from "../icon/icon.tsx";
import {
  IconButton,
  IconButtonComponentType,
  IconButtonSize,
  IconButtonTheme,
} from "../iconButton/iconButton.tsx";

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
  handleClick?: () => void;
  link: string;
};

export const ListStripe: Component<ListStripeProps> = (props) => {
  const mProps: Required<ListStripeProps> = mergeProps(
    {
      handleClick: () => {},
    },
    props,
  );

  return (
    <div
      class={`listStripe listStripe_${mProps.theme} listStripe_${mProps.size}`}
      onClick={() => {}}
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
          testId={""}
          componentType={IconButtonComponentType.Link}
        />
        <IconButton
          iconName={IconName.Trash}
          ariaLabel={`Удалить список ${mProps.listTitle}`}
          theme={IconButtonTheme.Dangerous}
          size={IconButtonSize.Medium}
          testId={""}
        />
      </div>
    </div>
  );
};
