import { createSignal, Index, mergeProps, untrack } from "solid-js";

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
  disabled?: boolean;
  currentItemsCount?: number;
  onSelectionChange?: () => void;
};

export const ListStripeImport = (props: Testable<ListStripeImportProps>) => {
  const mProps: Testable<Required<ListStripeImportProps>> = mergeProps(
    {
      theme: ListStripeImportTheme.Primary,
      size: ListStripeImportSize.Medium,
      disabled: false,
      currentItemsCount: 0,
      onSelectionChange: () => {},
    },
    props,
  );

  const [getExpanded, setExpanded] = createSignal(false);

  function toggleExpanded() {
    setExpanded(!getExpanded());
  }

  const [getItemsCheckboxState, setItemsCheckboxState] = createSignal<boolean[]>([]);
  const [getListCheckboxState, setListCheckboxState] = createSignal<CheckedState>(false);

  function getCheckedItemsCount() {
    const checkedItems = getItemsCheckboxState();

    return checkedItems.filter(Boolean).length;
  }

  function calculateListCheckboxState() {
    if (mProps.children.items.length === getCheckedItemsCount()) {
      setStoreImportDialog("checkedItemsCount", mProps.children.id, 1);
    } else {
      setStoreImportDialog("checkedItemsCount", mProps.children.id, getCheckedItemsCount());
    }
  }

  function handleItemCheckboxChange(index: number) {
    // eslint-disable-next-line solid/reactivity
    return function (checked: boolean) {
      const newItems = [...getItemsCheckboxState()];
      newItems[index] = checked;
      setItemsCheckboxState(newItems);

      calculateListCheckboxState();

      if (getCheckedItemsCount() === 0) {
        setListCheckboxState(false);
      } else if (getCheckedItemsCount() === mProps.children.items.length) {
        setListCheckboxState(true);
      } else {
        setListCheckboxState("mixed");
      }
    };
  }

  function handleListCheckboxChange(checked: boolean) {
    const newState = new Array(mProps.children.items.length).fill(checked);
    setItemsCheckboxState(newState);
    calculateListCheckboxState();
    mProps.onSelectionChange();
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
          onChange={handleListCheckboxChange}
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
            {(getItem, index) => {
              setStoreImportDialog(
                "itemsCache",
                untrack(() => getItem().id),
                untrack(getItem),
              );

              return (
                <ListItemImport
                  testId={DEFAULT_TEST_ID}
                  checkboxHTMLName={getItem().id}
                  checked={getItemsCheckboxState()[index] || false}
                  onCheckedChange={handleItemCheckboxChange(index)}
                >
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
