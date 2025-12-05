import { mergeProps } from "solid-js";

import { ITEMS_LIMIT } from "../../../../../../configuration.ts";
import type { Testable } from "../../../../../components/utilities/testable.ts";
import { getTotalCheckedItemsCount } from "../utilities/getTotalCheckedItemsCount.tsx";
import { isImportDialogLimitReached } from "../utilities/isImportDialogLimitReached.tsx";

import "./importDialogCounter.css";

export enum ImportDialogCounterTheme {
  Primary = "primary",
}

export enum ImportDialogCounterSize {
  Medium = "medium",
}

type ImportDialogCounterProps = {
  theme?: ImportDialogCounterTheme;
  size?: ImportDialogCounterSize;
};

export const ImportDialogCounter = (props: Testable<ImportDialogCounterProps>) => {
  const mProps: Testable<Required<ImportDialogCounterProps>> = mergeProps(
    {
      theme: ImportDialogCounterTheme.Primary,
      size: ImportDialogCounterSize.Medium,
    },
    props,
  );

  return (
    <div
      class="importDialogCounter"
      classList={{
        [`importDialogCounter_${mProps.size}`]: true,
        [`importDialogCounter_${mProps.theme}`]: true,
        importDialogCounter_limitReached: isImportDialogLimitReached(),
      }}
    >
      {`Элементов: ${getTotalCheckedItemsCount()}/${ITEMS_LIMIT}`}
    </div>
  );
};
