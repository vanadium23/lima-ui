import { mergeProps } from "solid-js";

import { LIST_STRIPE_IMPORT_ITEM, LIST_STRIPE_IMPORT_ITEM_CHECKBOX } from "../../../features/testIds.ts";
import { Checkbox, CheckboxSize, CheckboxTheme } from "../checkbox/checkbox.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./listItemImport.css";

export enum ListItemImportTheme {
  Primary = "primary",
}

export enum ListItemImportSize {
  Medium = "medium",
}

type ListItemImportProps = {
  theme?: ListItemImportTheme;
  size?: ListItemImportSize;
  itemId: string;
  listId: string;
  children: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkboxHTMLName: string;
  disabled?: boolean;
};

export const ListItemImport = (props: Testable<ListItemImportProps>) => {
  const mProps: Testable<Required<ListItemImportProps>> = mergeProps(
    {
      theme: ListItemImportTheme.Primary,
      size: ListItemImportSize.Medium,
      checked: false,
      onCheckedChange: () => {},
      disabled: false,
    },
    props,
  );

  return (
    <label
      class="listItemImport"
      classList={{
        [`listItemImport_${mProps.size}`]: true,
        [`listItemImport_${mProps.theme}`]: true,
      }}
      data-test-id={LIST_STRIPE_IMPORT_ITEM}
      data-test-sub-id={mProps.testSubId ?? "0"}
    >
      <span class="listItemImport__checkbox">
        <Checkbox
          theme={CheckboxTheme.Primary}
          size={CheckboxSize.Small}
          dataId={mProps.itemId}
          dataGroupId={mProps.listId}
          testId={LIST_STRIPE_IMPORT_ITEM_CHECKBOX}
          testSubId={mProps.testSubId ?? "0"}
          dependent={true}
          checked={mProps.checked}
          onChange={mProps.onCheckedChange}
          name={mProps.checkboxHTMLName}
          disabled={mProps.disabled}
        />
      </span>
      <span class="listItemImport__text">{mProps.children}</span>
    </label>
  );
};
