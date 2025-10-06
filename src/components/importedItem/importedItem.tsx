import { mergeProps, Show } from "solid-js";

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
  children: string;
  disabled?: boolean;
  checkable?: boolean;
  checked?: boolean;
};

export const ImportedItem = (props: Testable<ImportedItemProps>) => {
  const mProps: Testable<Required<ImportedItemProps>> = mergeProps(
    {
      theme: ImportedItemTheme.Primary,
      size: ImportedItemSize.Medium,
      disabled: false,
      checkable: false,
      checked: false,
    },
    props,
  );

  return (
    <div
      class={`importedItem importedItem_${mProps.disabled ? "disabled" : mProps.theme} importedItem_${mProps.size}`}
      data-test-id={mProps.testId}
    >
      <Show when={mProps.checkable}>
        <div class="importedItem__checkbox">
          <Checkbox testId={mProps.testId} disabled={mProps.disabled} checked={mProps.checked} />
        </div>
      </Show>
      <div class="importedItem__inner">{mProps.children}</div>
    </div>
  );
};
