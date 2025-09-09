import { mergeProps, Show } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { Checkbox } from "../checkbox/checkbox.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./importedItem.css";

export enum ImportedItemTheme {
  Primary = "primary",
}

export enum ImportedItemSize {
  Medium = "medium",
}

type ImportedItemProps = {
  theme?: ImportedItemTheme;
  size?: ImportedItemSize;
  itemText?: string;
  isDisabled?: boolean;
  isCheckable?: boolean;
  isChecked?: boolean;
};

export const ImportedItem = (props: Testable<ImportedItemProps>) => {
  const mProps: Testable<Required<ImportedItemProps>> = mergeProps(
    {
      theme: ImportedItemTheme.Primary,
      size: ImportedItemSize.Medium,
      itemText: "",
      isDisabled: false,
      isCheckable: false,
      isChecked: false,
    },
    props,
  );

  return (
    <div
      class={`importedItem importedItem_${mProps.theme} importedItem_${mProps.size}`}
      data-test-id={mProps.testId}
      classList={{
        importedItem_disabled: mProps.isDisabled,
      }}
    >
      <Show when={mProps.isCheckable}>
        <div class="importedItem__checkbox">
          <Checkbox testId={DEFAULT_TEST_ID} isDisabled={mProps.isDisabled} checked={mProps.isChecked} />
        </div>
      </Show>
      <div class="importedItem__inner">{mProps.itemText}</div>
    </div>
  );
};
