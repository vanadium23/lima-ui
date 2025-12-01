import { Portal } from "solid-js/web";

import {
  CHECKLIST_SWITCH,
  TOOLS_PANEL,
  TOOLS_PANEL_ADD_ITEM_BUTTON,
  TOOLS_PANEL_BUTTON_COPY_ITEMS,
  TOOLS_PANEL_BUTTON_IMPORT_LIST,
  TOOLS_PANEL_BUTTON_PRINT_LIST,
  TOOLS_PANEL_BUTTON_REMOVE_LIST,
} from "../../../../../features/testIds.ts";
import { Divider } from "../../../../components/divider/divider.tsx";
import { IconName } from "../../../../components/icon/types.ts";
import { Switch } from "../../../../components/switch/switch.tsx";
import {
  ToolsButton,
  ToolsButtonComponentType,
  ToolsButtonTheme,
} from "../../../../components/toolsButton/toolsButton.tsx";
import { ToolsPanel, ToolsPanelSize, ToolsPanelTheme } from "../../../../organisms/toolsPanel/toolsPanel.tsx";
import type { EditListItem } from "../../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../../editList.store.tsx";
import { addNewItem } from "../../utilities/addNewItem.ts";
import { reachedItemsLimit } from "../../utilities/reachedItemsLimit.ts";
import { ImportDialog, openImportDialogPasteEnd } from "../importDialog/importDialog.tsx";
import { RemoveDialog, setStoreRemoveDialog } from "../removeDialog/removeDialog.tsx";

const toggleCheckable = () => setStoreEditList("isCheckable", !storeEditList.isCheckable);

const openRemoveDialog = () => setStoreRemoveDialog("openRemoveDialog", true);

function copyItemsToClipboard(items: EditListItem[]) {
  const textToCopy = items.map((item) => item.content.trim()).join("\n");
  navigator.clipboard.writeText(textToCopy).catch(() => {});
}

const EditListToolsPanel = () => {
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
            handleClick={() => copyItemsToClipboard(storeEditList.items)}
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
            handleClick={openRemoveDialog}
            testId={TOOLS_PANEL_BUTTON_REMOVE_LIST}
          >
            Удалить список
          </ToolsButton>
          <Portal>
            <RemoveDialog />
          </Portal>
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
          <Portal>
            <ImportDialog currentListId={storeEditList.id} />
          </Portal>

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
