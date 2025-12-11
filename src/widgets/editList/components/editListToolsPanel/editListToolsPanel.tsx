import { createSignal } from "solid-js";

import {
  CHECKLIST_SWITCH,
  REMOVE_LIST_DIALOG,
  TOOLS_PANEL,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  TOOLS_PANEL_BUTTON_COPY_ITEMS,
  TOOLS_PANEL_BUTTON_IMPORT_LIST,
  TOOLS_PANEL_BUTTON_PRINT_LIST,
  TOOLS_PANEL_BUTTON_REMOVE_LIST,
} from "../../../../../features/testIds.ts";
import { Divider } from "../../../../components/divider/divider.tsx";
import { IconName } from "../../../../components/icon/types.ts";
import { RemoveDialog } from "../../../../components/removeDialog/removeDialog.tsx";
import { Switch } from "../../../../components/switch/switch.tsx";
import {
  ToolsButton,
  ToolsButtonComponentType,
  ToolsButtonTheme,
} from "../../../../components/toolsButton/toolsButton.tsx";
import { ToolsPanel, ToolsPanelSize, ToolsPanelTheme } from "../../../../organisms/toolsPanel/toolsPanel.tsx";
import type { EditListElement } from "../../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../../editList.store.tsx";
import { addNewItem } from "../../utilities/addNewItem.ts";
import { reachedItemsLimit } from "../../utilities/reachedItemsLimit.ts";
import { sendListRemove } from "../../utilities/sendListRemove.ts";
import { ImportDialog, openImportDialogPasteEnd } from "../importDialog/importDialog.tsx";

const toggleCheckable = () => setStoreEditList("isCheckable", !storeEditList.isCheckable);

const [isOpenRemoveDialog, setOpenRemoveDialog] = createSignal(false);

function copyItemsToClipboard(elements: EditListElement[]) {
  const textToCopy = elements
    .map((element) => {
      return element.items.map((item) => item.content.trim());
    })
    .flat()
    .join("\n");

  navigator.clipboard.writeText(textToCopy).catch(() => {});
}

const EditListToolsPanel = () => {
  const hasExported = storeEditList.hasExportedItems || storeEditList.exportedTo.length >= 1;

  return (
    <aside class="editList__toolsPanel">
      <ToolsPanel size={ToolsPanelSize.Medium} theme={ToolsPanelTheme.Primary} testId={TOOLS_PANEL}>
        <div class="toolsPanel__horizontalSection">
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.RowsPlusBottom}
            handleClick={addNewItem}
            disabled={reachedItemsLimit() || Boolean(storeEditList.sendingNow)}
            testId={TOOLS_PANEL_ADD_ITEM_BUTTON}
          >
            Добавить пункт
          </ToolsButton>
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.CopySimple}
            disabled={storeEditList.isNewList || Boolean(storeEditList.sendingNow)}
            handleClick={() => copyItemsToClipboard(storeEditList.elements)}
            testId={TOOLS_PANEL_BUTTON_COPY_ITEMS}
          >
            Копировать пункты
          </ToolsButton>
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.Trash}
            theme={ToolsButtonTheme.Dangerous}
            loading={storeEditList.sendingNow === "deleting"}
            disabled={storeEditList.isNewList || storeEditList.sendingNow === "saving"}
            handleClick={() => {
              setOpenRemoveDialog(true);
            }}
            testId={TOOLS_PANEL_BUTTON_REMOVE_LIST}
          >
            Удалить список
          </ToolsButton>
          <RemoveDialog
            hasExported={hasExported}
            open={isOpenRemoveDialog()}
            onCancel={() => {
              setOpenRemoveDialog(false);
            }}
            listName={storeEditList.name}
            sendListRemove={sendListRemove}
            testId={REMOVE_LIST_DIALOG}
          />
        </div>
        <Divider />
        <div class="toolsPanel__verticalSection">
          <Switch
            testId={CHECKLIST_SWITCH}
            disabled={Boolean(storeEditList.sendingNow)}
            checked={storeEditList.isCheckable}
            onChange={toggleCheckable}
          >
            Чек-лист
          </Switch>
        </div>
        <Divider />
        <div class="toolsPanel__horizontalSection">
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.SortAscending}
            disabled={reachedItemsLimit() || Boolean(storeEditList.sendingNow)}
            testId={TOOLS_PANEL_BUTTON_IMPORT_LIST}
            handleClick={openImportDialogPasteEnd}
          >
            Импорт
          </ToolsButton>
          <ImportDialog currentListId={storeEditList.id} />

          <ToolsButton
            componentType={ToolsButtonComponentType.Link}
            iconName={IconName.Printer}
            href={`./${storeEditList.id}/print?checkable=${storeEditList.isCheckable}`}
            testId={TOOLS_PANEL_BUTTON_PRINT_LIST}
            disabled={storeEditList.isNewList || Boolean(storeEditList.sendingNow)}
            openInNewTab={true}
          >
            Напечатать список
          </ToolsButton>
        </div>
      </ToolsPanel>
    </aside>
  );
};
export default EditListToolsPanel;
