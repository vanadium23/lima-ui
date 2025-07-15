import { mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import {
  Checkbox,
  CheckboxSize,
  CheckboxTheme,
} from "../checkbox/checkbox.tsx";
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
  text: string;
};

export const ListItemImport = (props: Testable<ListItemImportProps>) => {
  const mProps: Testable<Required<ListItemImportProps>> = mergeProps(
    {
      theme: ListItemImportTheme.Primary,
      size: ListItemImportSize.Medium,
    },
    props,
  );

  return (
    <label
      class={`listItemImport listItemImport_${mProps.theme} listItemImport_${mProps.size}`}
      data-test-id={mProps.testId}
    >
      <span class="listItemImport__checkbox">
        <Checkbox
          theme={CheckboxTheme.Primary}
          size={CheckboxSize.Small}
          testId={DEFAULT_TEST_ID}
          independent={false}
        />
      </span>
      <span class="listItemImport__text">{mProps.text}</span>
    </label>
  );
};
