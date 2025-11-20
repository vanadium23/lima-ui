import { mergeProps } from "solid-js";

import { ITEMS_LIMIT } from "../../../../../../configuration.ts";
import { DEFAULT_TEST_ID } from "../../../../../../features/testIds.ts";
import { Tooltip } from "../../../../../components/tooltip/tooltip.tsx";
import type { Testable } from "../../../../../components/utilities/testable.ts";
import { storeEditList } from "../../../editList.store.tsx";
import { storeImportDialog } from "../importDialog.tsx";

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

  function getTotalCheckedItemsCount() {
    return (
      Object.values(storeImportDialog.checkedItemsCount).reduce((sum, count) => sum + count, 0) +
      storeEditList.items.filter((item) => !item.auto).length
    );
  }

  function isLimitReached() {
    return getTotalCheckedItemsCount() > ITEMS_LIMIT;
  }

  function getTooltipMessage() {
    if (isLimitReached()) {
      return "Превышен доступный лимит пунктов для списка";
    } else {
      return "Счетчик доступного лимита пунктов для списка";
    }
  }

  return (
    <Tooltip content={getTooltipMessage()} testId={DEFAULT_TEST_ID}>
      <div
        class="importDialogCounter"
        classList={{
          [`importDialogCounter_${mProps.size}`]: true,
          [`importDialogCounter_${mProps.theme}`]: true,
          importDialogCounter_limitReached: isLimitReached(),
        }}
        tabIndex={0}
      >
        {`${getTotalCheckedItemsCount()}/${ITEMS_LIMIT}`}
      </div>
    </Tooltip>
  );
};
