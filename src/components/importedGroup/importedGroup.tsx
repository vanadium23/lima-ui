import { createSignal, For, mergeProps } from "solid-js";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import {
  ADD_ITEM_ABOVE_MENUITEM,
  ADD_ITEM_BELOW_MENUITEM,
  DEFAULT_TEST_ID,
  DRAG_HANDLE,
  EDIT_IMPORTED_GROUP_BUTTON,
  EDIT_IMPORTED_GROUP_DIALOG,
  EDIT_IMPORTED_GROUP_MENUITEM,
  GO_TO_SOURCE_LIST_MENUITEM,
  IMPORT_ABOVE_MENUITEM,
  IMPORT_BELOW_MENUITEM,
  IMPORTED_GROUP_ITEM,
  IMPORTED_GROUP_NAME_LINK,
  LIMIT_EXCEEDED_ERROR,
  OPEN_CONTEXT_MENU_IMPORTED_GROUP_BUTTON,
  REMOVE_IMPORTED_GROUP_MENUITEM,
} from "../../../features/testIds.ts";
import { getListLink } from "../../../utilities/addresses.ts";
import { notificationState } from "../../state/pushNotificationStateManager.ts";
import type { DragSettings, EditListElement, EditListSimpleItem } from "../../types/types.ts";
import {
  openImportDialogPasteAfter,
  openImportDialogPasteBefore,
} from "../../widgets/editList/components/importDialog/importDialog.tsx";
import { setStoreEditList, storeEditList } from "../../widgets/editList/editList.store.tsx";
import { createDefaultElement } from "../../widgets/editList/utilities/createDefaultItem.ts";
import { getEditListElementsWithoutAutoItem } from "../../widgets/editList/utilities/getEditListElementsWithoutAutoItem.ts";
import { pasteItemAfter, pasteItemBefore } from "../../widgets/editList/utilities/pasteNewItem.ts";
import { reachedItemsLimit } from "../../widgets/editList/utilities/reachedItemsLimit.ts";
import { removeItem } from "../../widgets/editList/utilities/removeItem.ts";
import { Button } from "../button/button.tsx";
import { Dialog } from "../dialog/dialog.tsx";
import { DragHandle } from "../dragHandle/dragHandle.tsx";
import { Dropdown } from "../dropdown/dropdown.tsx";
import { IconName } from "../icon/types.ts";
import { IconButton, IconButtonSize } from "../iconButton/iconButton.tsx";
import { ImportedItem } from "../importedItem/importedItem.tsx";
import { Link, LinkSize } from "../link/link.tsx";
import { Menu } from "../menu/menu.tsx";
import { MenuItemComponentType, MenuItemTheme } from "../menuItem/menuItem.tsx";
import type { Testable } from "../utilities/testable.ts";

import "./importedGroup.css";

export enum ImportedGroupTheme {
  Primary = "primary",
}

export enum ImportedGroupSize {
  Medium = "medium",
}

type ImportedGroupProps = {
  theme?: ImportedGroupTheme;
  size?: ImportedGroupSize;
  index: number;
  checkable?: boolean;
  children: EditListSimpleItem[];
  name: string;
  id: string;
  dragSettings?: DragSettings;
  isDraggingOverlay?: boolean;
};

export const ImportedGroup = (props: Testable<ImportedGroupProps>) => {
  const mProps: Testable<Required<ImportedGroupProps>> = mergeProps(
    {
      theme: ImportedGroupTheme.Primary,
      size: ImportedGroupSize.Medium,
      checkable: false,
      dragSettings: {
        dragData: null,
        dragProps: {},
        dragState: null,
      },
      isDraggingOverlay: false,
      dragId: "",
    },
    props,
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = createSignal(false);

  function totalElementsBeforeEditImportedGroup() {
    return mProps.children.length + getEditListElementsWithoutAutoItem().length - 1;
  }

  function reachedLimitEditListElements() {
    return totalElementsBeforeEditImportedGroup() > ITEMS_LIMIT;
  }

  function editImportedGroup() {
    if (!reachedLimitEditListElements()) {
      const newElements: EditListElement[] = mProps.children.map((item) =>
        createDefaultElement(storeEditList.id, storeEditList.name, item.content),
      );

      setStoreEditList("elements", (elements) => [
        ...elements.slice(0, mProps.index),
        ...newElements,
        ...elements.slice(mProps.index + 1),
      ]);
    } else {
      notificationState.pushInfo(
        "Превышение лимита пунктов",
        `Этот список нельзя встроить, так как будет превышен лимит ${totalElementsBeforeEditImportedGroup()} из ${ITEMS_LIMIT} доступных элементов списка`,
        LIMIT_EXCEEDED_ERROR,
      );
    }
  }

  const menuItems = () => [
    {
      children: "Редактировать",
      icon: IconName.NotePencil,
      handleClick: () => {
        setIsEditDialogOpen(true);
      },
      testId: EDIT_IMPORTED_GROUP_MENUITEM,
    },
    {
      children: "К исходному списку",
      componentType: MenuItemComponentType.Link,
      href: getListLink(mProps.id),
      icon: IconName.ArrowBendUpLeft,
      testId: GO_TO_SOURCE_LIST_MENUITEM,
    },
    {
      children: "Добавить пункт выше",
      icon: IconName.Plus,
      handleClick: () => {
        pasteItemBefore(mProps.index);
      },
      testId: ADD_ITEM_ABOVE_MENUITEM,
      disabled: reachedItemsLimit(),
    },
    {
      children: "Добавить пункт ниже",
      icon: IconName.Plus,
      handleClick: () => {
        pasteItemAfter(mProps.index);
      },
      testId: ADD_ITEM_BELOW_MENUITEM,
      disabled: reachedItemsLimit(),
    },
    {
      children: "Импортировать выше",
      icon: IconName.SortDescending,
      handleClick: () => {
        openImportDialogPasteBefore(mProps.index);
      },
      testId: IMPORT_ABOVE_MENUITEM,
      disabled: reachedItemsLimit(),
    },
    {
      children: "Импортировать ниже",
      icon: IconName.SortAscending,
      handleClick: () => {
        openImportDialogPasteAfter(mProps.index);
      },
      testId: IMPORT_BELOW_MENUITEM,
      disabled: reachedItemsLimit(),
    },
    {
      children: "Удалить импорт",
      icon: IconName.Trash,
      handleClick: () => {
        removeItem(mProps.index);
      },
      theme: MenuItemTheme.Dangerous,
      testId: REMOVE_IMPORTED_GROUP_MENUITEM,
    },
  ];

  return (
    <div
      {...mProps.dragSettings.dragProps}
      class="importedGroup"
      classList={{
        [`importedGroup_${mProps.size}`]: true,
        [`importedGroup_${mProps.theme}`]: !storeEditList.sendingNow,
        importedGroup_disabled: Boolean(storeEditList.sendingNow),
        importedGroup_checkable: mProps.checkable,
        importedGroup_dragging: mProps.isDraggingOverlay,
        importedGroup_transition: Boolean(mProps.dragSettings.dragState?.active.draggable),
      }}
      data-test-id={mProps.testId}
      data-test-sub-id={mProps.testSubId ?? "0"}
    >
      <div class="importedGroup__dragHandle">
        <DragHandle
          disabled={Boolean(storeEditList.sendingNow)}
          testId={DRAG_HANDLE}
          dragHandle={mProps.dragSettings.dragData}
        />
      </div>
      <div class="importedGroup__inner">
        <div class="importedGroup__headerWrapper">
          <div class="importedGroup__header">
            <Link
              size={LinkSize.Small}
              href={getListLink(mProps.id)}
              testId={IMPORTED_GROUP_NAME_LINK}
              testSubId={mProps.index}
              disabled={Boolean(storeEditList.sendingNow)}
            >
              {mProps.name}
            </Link>
            <div class="importedGroup__button">
              <Dropdown
                defaultPlacement={"bottom-end"}
                anchor={(props) => (
                  <IconButton
                    ref={props.ref}
                    handleClick={props.handleClick}
                    iconName={IconName.DotsThree}
                    size={IconButtonSize.MediumEmbedded}
                    ariaLabel={`Меню импорта из списка ${mProps.name}`}
                    testId={OPEN_CONTEXT_MENU_IMPORTED_GROUP_BUTTON}
                    testSubId={mProps.testSubId ?? "0"}
                    disabled={Boolean(storeEditList.sendingNow)}
                  />
                )}
              >
                <Menu testId={DEFAULT_TEST_ID}>{menuItems()}</Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <For each={mProps.children}>
          {(item, index) => (
            <ImportedItem
              checkable={mProps.checkable}
              checked={false}
              disabled={Boolean(storeEditList.sendingNow)}
              testId={IMPORTED_GROUP_ITEM}
              testSubId={index()}
            >
              {item.content}
            </ImportedItem>
          )}
        </For>
      </div>
      <Dialog
        title="Редактировать импорт"
        onCancel={() => {
          setIsEditDialogOpen(false);
        }}
        controls={
          <Button
            handleClick={() => {
              editImportedGroup();
              setIsEditDialogOpen(false);
            }}
            testId={EDIT_IMPORTED_GROUP_BUTTON}
            testSubId={mProps.testSubId ?? "0"}
          >
            Редактировать
          </Button>
        }
        open={isEditDialogOpen()}
        testId={EDIT_IMPORTED_GROUP_DIALOG}
        testSubId={mProps.testSubId ?? "0"}
      >
        <p>
          Редактируя импортированный список или пункт, вы открепляете его от исходного, и в дальнейшем любые изменения
          исходного списка не будут отражаться на этом списке.
        </p>
      </Dialog>
    </div>
  );
};
