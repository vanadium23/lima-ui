import { createEffect, createSignal, Index, mergeProps } from "solid-js";

import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
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

export type ListItemData = {
  text: string;
  isChecked?: boolean;
};

export type ListData = {
  title: string;
  purpose?: string;
  items: ListItemData[];
};

type ListStripeImportProps = {
  theme?: ListStripeImportTheme;
  size?: ListStripeImportSize;
  listData: ListData;
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
  const [getItemsChecked, setItemsChecked] = createSignal<boolean[]>([]);
  const [getMainCheckboxState, setMainCheckboxState] = createSignal<CheckedState>(false);

  createEffect(() => {
    if (getItemsChecked().length === 0) {
      const initialStates = mProps.listData.items.map((item) => item.isChecked || false);
      setItemsChecked(initialStates);
    }
  });

  createEffect(() => {
    const checkedItems = getItemsChecked();
    const checkedCount = checkedItems.filter(Boolean).length;

    if (checkedCount === 0) {
      setMainCheckboxState(false);
    } else if (checkedCount === checkedItems.length) {
      setMainCheckboxState(true);
    } else {
      setMainCheckboxState("mixed");
    }
  });

  function toggleExpanded() {
    setExpanded(!getExpanded());
  }

  function handleMainCheckboxChange(checked: boolean) {
    const newState = new Array(mProps.listData.items.length).fill(checked);
    setItemsChecked(newState);
  }

  function handleItemCheckboxChange(index: number) {
    return function (checked: boolean) {
      const newItems = [...getItemsChecked()];
      newItems[index] = checked;
      setItemsChecked(newItems);
    };
  }

  const iconSize = {
    [ListStripeImportSize.Medium]: IconSize.Medium,
  };

  return (
    <div
      class={`listStripeImport listStripeImport_${mProps.theme} listStripeImport_${mProps.size}`}
      classList={{
        listStripeImport_expanded: getExpanded(),
        listStripeImport_collapsed: !getExpanded(),
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId}
    >
      <div class="listStripeImport__checkbox">
        <Checkbox
          theme={CheckboxTheme.Primary}
          size={CheckboxSize.Small}
          testId={DEFAULT_TEST_ID}
          testSubId={mProps.testSubId ?? ""}
          independent={true}
          checked={getMainCheckboxState()}
          onChange={handleMainCheckboxChange}
          name={mProps.titleHTMLName}
        />
      </div>

      <div class="listStripeImport__accordion">
        <button type="button" class="listStripeImport__header" onClick={toggleExpanded}>
          <div class="listStripeImport__headerInner">
            <span class="listStripeImport__title">{mProps.listData.title}</span>
            {mProps.listData.purpose && <span class="listStripeImport__purpose">{mProps.listData.purpose}</span>}
          </div>

          <div class="listStripeImport__headerIcon">
            <Icon name={IconName.CaretDown} size={iconSize[mProps.size]} />
          </div>
        </button>
        <div class="listStripeImport__items">
          <Index each={mProps.listData.items}>
            {(item, index) => (
              <ListItemImport
                text={item().text}
                testId={DEFAULT_TEST_ID}
                isImported={getItemsChecked()[index] || false}
                onCheckedChange={handleItemCheckboxChange(index)}
                checkboxHTMLName={`item-${index}`}
              />
            )}
          </Index>
        </div>
      </div>
    </div>
  );
};
