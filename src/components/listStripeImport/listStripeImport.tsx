import { createSignal, Index, mergeProps, untrack } from "solid-js";

import {
  LIST_STRIPE_IMPORT,
  LIST_STRIPE_IMPORT_CHECKBOX,
  LIST_STRIPE_IMPORT_HEADER,
  LIST_STRIPE_IMPORT_ITEM,
} from "../../../features/testIds.ts";
import type { EditListType } from "../../types/types.ts";
import { setStoreImportDialog } from "../../widgets/editList/components/importDialog/importDialog.tsx";
import { Checkbox, CheckboxSize, CheckboxTheme, type CheckedState } from "../checkbox/checkbox.tsx";
import { Icon, IconSize } from "../icon/icon.tsx";
import { IconName } from "../icon/types.ts";
import { ListItemImport } from "../listItemImport/listItemImport.tsx";

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
  children: EditListType;
  titleHTMLName: string;
  disabled?: boolean;
  currentItemsCount?: number;
  onSelectionChange?: () => void;
  index: number;
};

export const ListStripeImport = (props: ListStripeImportProps) => {
  const mProps: Required<ListStripeImportProps> = mergeProps(
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
    if (mProps.children.elements.length === getCheckedItemsCount()) {
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
      } else if (getCheckedItemsCount() === mProps.children.elements.length) {
        setListCheckboxState(true);
      } else {
        setListCheckboxState("mixed");
      }
    };
  }

  function handleListCheckboxChange(checked: boolean) {
    const newState = new Array(mProps.children.elements.length).fill(checked);
    setItemsCheckboxState(newState);

    setListCheckboxState(checked);

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
      data-test-id={LIST_STRIPE_IMPORT}
      data-test-sub-id={mProps.index}
    >
      <div class="listStripeImport__checkbox">
        <Checkbox
          theme={CheckboxTheme.Primary}
          size={CheckboxSize.Medium}
          dataId={mProps.children.id}
          testId={LIST_STRIPE_IMPORT_CHECKBOX}
          testSubId={String(mProps.index)}
          checked={getListCheckboxState()}
          onChange={handleListCheckboxChange}
          name={mProps.titleHTMLName}
        />
      </div>

      <div class="listStripeImport__accordion">
        <button
          type="button"
          class="listStripeImport__header"
          onClick={toggleExpanded}
          data-test-id={LIST_STRIPE_IMPORT_HEADER}
          data-test-sub-id={mProps.index}
        >
          <div class="listStripeImport__headerInner">
            <span class="listStripeImport__title">{mProps.children.name}</span>
            {mProps.children.purpose && <span class="listStripeImport__purpose">{mProps.children.purpose}</span>}
          </div>

          <div class="listStripeImport__headerIcon">
            <Icon name={IconName.CaretDown} size={iconSize[mProps.size]} />
          </div>
        </button>
        <div class="listStripeImport__items">
          <Index each={mProps.children.elements}>
            {(element, index) => {
              setStoreImportDialog(
                "itemsCache",
                untrack(() => element().id),
                untrack(element),
              );

              return (
                <ListItemImport
                  itemId={element().id}
                  listId={mProps.children.id}
                  checkboxHTMLName={element().items[0].content}
                  checked={getItemsCheckboxState()[index] || false}
                  onCheckedChange={handleItemCheckboxChange(index)}
                  testId={LIST_STRIPE_IMPORT_ITEM}
                  testSubId={index}
                >
                  {element().items[0].content}
                </ListItemImport>
              );
            }}
          </Index>
        </div>
      </div>
    </div>
  );
};
