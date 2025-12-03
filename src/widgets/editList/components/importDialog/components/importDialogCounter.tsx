import { mergeProps } from "solid-js";

import { ITEMS_LIMIT } from "../../../../../../configuration.ts";
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

export function isImportDialogLimitReached() {
  return getTotalCheckedItemsCount() > ITEMS_LIMIT;
}

function getTotalCheckedItemsCount() {
  return (
    Object.values(storeImportDialog.checkedItemsCount).reduce((sum, count) => sum + count, 0) +
    storeEditList.elements.filter((item) => !item.auto).length
    //TODO Задуматься на тем чтобы вынести в стор в отдельное свойство счетчик текущего количества пунктов без автопункта так как это используется в нескольких утилитах
  );
}

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
