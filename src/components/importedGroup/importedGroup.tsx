import { createSignal, For, mergeProps } from "solid-js";

import { ITEMS_LIMIT } from "../../../configuration.ts";
import { DEFAULT_TEST_ID } from "../../../features/testIds.ts";
import { getListLink } from "../../../utilities/addresses.ts";
import { notificationState } from "../../state/pushNotificationStateManager.ts";
import type { DragSettings, EditListElement, EditListSimpleItem } from "../../types/types.ts";
import { setStoreEditList, storeEditList } from "../../widgets/editList/editList.store.tsx";
import { createDefaultElement } from "../../widgets/editList/utilities/createDefaultItem.ts";
import { getEditListElementsWithoutAutoItem } from "../../widgets/editList/utilities/getEditListElementsWithoutAutoItem.ts";
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
  itemIndex: number;
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

  function reachedLimitEditItems() {
    return mProps.children.length + getEditListElementsWithoutAutoItem().length > ITEMS_LIMIT;
  }

  function editListItem() {
    if (!reachedLimitEditItems()) {
      const newElements: EditListElement[] = mProps.children.map((item) =>
        createDefaultElement(storeEditList.id, storeEditList.name, item.content),
      );

      setStoreEditList("elements", (elements) => [
        ...elements.slice(0, mProps.itemIndex),
        ...newElements,
        ...elements.slice(mProps.itemIndex + 1),
      ]);
    } else {
      notificationState.pushInfo(
        "Превышение лимита пунктов",
        <span>
          Попробуйте{" "}
          <Link href="/" testId={DEFAULT_TEST_ID}>
            тариф PRO
          </Link>{" "}
          для расширенного взаимодействия со списками
        </span>,
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
      testId: DEFAULT_TEST_ID,
      disabled: reachedItemsLimit(),
    },
    {
      children: "К исходному списку",
      componentType: MenuItemComponentType.Link,
      href: getListLink(mProps.id),
      icon: IconName.ArrowBendUpLeft,
      testId: DEFAULT_TEST_ID,
    },
    {
      children: "Удалить импорт",
      icon: IconName.Trash,
      handleClick: () => {
        removeItem(mProps.itemIndex);
      },
      theme: MenuItemTheme.Dangerous,
      testId: DEFAULT_TEST_ID,
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
    >
      <div class="importedGroup__dragHandle">
        <DragHandle
          disabled={Boolean(storeEditList.sendingNow)}
          testId={DEFAULT_TEST_ID}
          dragHandle={mProps.dragSettings.dragData}
        />
      </div>
      <div class="importedGroup__inner">
        <div class="importedGroup__headerWrapper">
          <div class="importedGroup__header">
            <Link
              size={LinkSize.Small}
              href={getListLink(mProps.id)}
              testId={DEFAULT_TEST_ID}
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
                    testId={DEFAULT_TEST_ID}
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
          {(item) => (
            <ImportedItem
              testId={DEFAULT_TEST_ID}
              checkable={mProps.checkable}
              checked={false}
              disabled={Boolean(storeEditList.sendingNow)}
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
              editListItem();
              setIsEditDialogOpen(false);
            }}
            testId={DEFAULT_TEST_ID}
            testSubId={mProps.testSubId || "0"}
          >
            Редактировать
          </Button>
        }
        open={isEditDialogOpen()}
        testId={mProps.testId}
        testSubId={mProps.testSubId || "0"}
      >
        <p>
          Редактируя импортированный список или пункт, вы открепляете его от исходного, и в дальнейшем любые изменения
          исходного списка не будут отражаться на этом списке.
        </p>
      </Dialog>
    </div>
  );
};
