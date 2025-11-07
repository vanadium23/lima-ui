import { createEffect, createSignal, Index, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import type { List } from "../../types/types.ts";
import { setStoreImportDialog } from "../../widgets/editList/components/importDialog/importDialog.tsx";
import { Checkbox, CheckboxSize, CheckboxTheme, type CheckedState } from "../checkbox/checkbox.tsx";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { ListItemImport } from "../listItemImport/listItemImport.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./listStripeImport.css";

export enum ListStripeImportTheme {
  Primary = "primary",
}

export enum ListStripeImportSize {
  Medium = "medium",
}

type ListStripeImportProps = {
  theme?: ListStripeImportTheme;
  size?: ListStripeImportSize;
  children: List;
  titleHTMLName: string;
};

export const ListStripeImport = (props: Testable<ListStripeImportProps>) => {
  const mProps: Testable<Required<ListStripeImportProps>> = mergeProps(
    {
      theme: ListStripeImportTheme.Primary,
      size: ListStripeImportSize.Medium,
    },
    props,
  );

  const [getExpanded, setExpanded] = createSignal(false);

  function toggleExpanded() {
    setExpanded(!getExpanded());
  }

  const [getItemsCheckboxState, setItemsCheckboxState] = createSignal<boolean[]>([]);
  const [getListCheckboxState, setListCheckboxState] = createSignal<CheckedState>(false);

  createEffect(() => {
    const checkedItems = getItemsCheckboxState();

    const checkedCount = checkedItems.filter(Boolean).length;

    if (checkedCount === 0) {
      setListCheckboxState(false);
    } else if (checkedCount === checkedItems.length) {
      setListCheckboxState(true);
    } else {
      setListCheckboxState("mixed");
    }
  });

  function handleMainCheckboxChange(checked: boolean) {
    const newState = new Array(mProps.children.items.length).fill(checked);
    setItemsCheckboxState(newState);
  }

  const iconSize = {
    [ListStripeImportSize.Medium]: IconSize.Medium,
  };

  return (
    <div
      class="listStripeImport"
      classList={{
        [`listStripeImport_${mProps.size}`]: true,
        [`listStripeImport_${mProps.theme}`]: true,
        listStripeImport_expanded: getExpanded(),
        listStripeImport_collapsed: !getExpanded(),
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="listStripeImport__checkbox">
        <Checkbox
          theme={CheckboxTheme.Primary}
          size={CheckboxSize.Medium}
          testId={DEFAULT_TEST_ID}
          testSubId={mProps.testSubId ?? ""}
          checked={getListCheckboxState()}
          onChange={handleMainCheckboxChange}
          name={mProps.titleHTMLName}
        />
      </div>

      <div class="listStripeImport__accordion">
        <button type="button" class="listStripeImport__header" onClick={toggleExpanded}>
          <div class="listStripeImport__headerInner">
            <span class="listStripeImport__title">{mProps.children.name}</span>
            {mProps.children.purpose && <span class="listStripeImport__purpose">{mProps.children.purpose}</span>}
          </div>

          <div class="listStripeImport__headerIcon">
            <Icon name={IconName.CaretDown} size={iconSize[mProps.size]} />
          </div>
        </button>
        <div class="listStripeImport__items">
          <Index each={mProps.children.items}>
            {(getItem) => {
              setStoreImportDialog("itemsCache", getItem().id, getItem());

              return (
                <ListItemImport testId={DEFAULT_TEST_ID} checkboxHTMLName={getItem().id}>
                  {getItem().content}
                </ListItemImport>
              );
            }}
          </Index>
        </div>
      </div>
    </div>
  );
};
