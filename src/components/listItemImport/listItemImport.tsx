import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
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
  children: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  checkboxHTMLName: string;
};

export const ListItemImport = (props: Testable<ListItemImportProps>) => {
  const mProps: Testable<Required<ListItemImportProps>> = mergeProps(
    {
      theme: ListItemImportTheme.Primary,
      size: ListItemImportSize.Medium,
      checked: false,
      onCheckedChange: () => {},
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
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <span class="listItemImport__checkbox">
        <Checkbox
          theme={CheckboxTheme.Primary}
          size={CheckboxSize.Small}
          testId={DEFAULT_TEST_ID}
          testSubId={mProps.testSubId ?? ""}
          dependent={true}
          checked={mProps.checked}
          onChange={mProps.onCheckedChange}
          name={mProps.checkboxHTMLName}
        />
      </span>
      <span class="listItemImport__text">{mProps.children}</span>
    </label>
  );
};
