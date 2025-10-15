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
import type { Item } from "../../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../../editList.store.tsx";
import { addEmptyItem } from "../../utilities/addEmptyItem.ts";
import { reachedItemsLimit } from "../../utilities/reachedItemsLimit.ts";
import { ImportDialog, setStoreImportDialog } from "../importDialog/importDialog.tsx";
import { RemoveDialog, setStoreRemoveDialog } from "../removeDialog/removeDialog.tsx";

const toggleCheckable = () => setStoreEditList("isCheckable", !storeEditList.isCheckable);

const openRemoveDialog = () => setStoreRemoveDialog("openRemoveDialog", true);

const openImportDialog = () => setStoreImportDialog("openImportDialog", true);

function copyItemsToClipboard(items: Item[]) {
  const textToCopy = items.map((item) => item.content.trim()).join("\n");
  navigator.clipboard.writeText(textToCopy).catch(() => {});
}

export const EditListToolsPanel = () => {
  return (
    <aside class="editList__toolsPanel">
      <ToolsPanel size={ToolsPanelSize.Medium} theme={ToolsPanelTheme.Primary} testId={TOOLS_PANEL}>
        <div class="toolsPanel__horizontalSection">
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.RowsPlusBottom}
            handleClick={() => addEmptyItem({ mode: "end", scroll: true, auto: false })}
            isDisabled={reachedItemsLimit() || storeEditList.sendingNow !== false}
            text={"Добавить пункт"}
            testId={TOOLS_PANEL_ADD_ITEM_BUTTON}
          />
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.CopySimple}
            text={"Копировать пункты"}
            isDisabled={storeEditList.isNewList || storeEditList.sendingNow !== false}
            handleClick={() => copyItemsToClipboard(storeEditList.items)}
            testId={TOOLS_PANEL_BUTTON_COPY_ITEMS}
          />
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.Trash}
            theme={ToolsButtonTheme.Dangerous}
            text={"Удалить список"}
            isLoading={storeEditList.sendingNow === "deleting"}
            isDisabled={storeEditList.isNewList || storeEditList.sendingNow === "saving"}
            handleClick={openRemoveDialog}
            testId={TOOLS_PANEL_BUTTON_REMOVE_LIST}
          />
          <RemoveDialog />
        </div>
        <Divider />
        <div class="toolsPanel__verticalSection">
          <Switch
            testId={CHECKLIST_SWITCH}
            text="Чек-лист"
            isDisabled={storeEditList.sendingNow !== false}
            isChecked={storeEditList.isCheckable}
            onChange={toggleCheckable}
          />
        </div>
        <Divider />
        <div class="toolsPanel__horizontalSection">
          <ToolsButton
            componentType={ToolsButtonComponentType.Button}
            iconName={IconName.SortAscending}
            isDisabled={reachedItemsLimit() || storeEditList.sendingNow !== false}
            text={"Импорт"}
            testId={TOOLS_PANEL_BUTTON_IMPORT_LIST}
            handleClick={openImportDialog}
          />
          <ImportDialog currentListId={storeEditList.id} />

          <ToolsButton
            componentType={ToolsButtonComponentType.Link}
            iconName={IconName.Printer}
            link={`./${storeEditList.id}/print?checkable=${storeEditList.isCheckable}`}
            text={"Напечатать список"}
            testId={TOOLS_PANEL_BUTTON_PRINT_LIST}
            isDisabled={storeEditList.isNewList || storeEditList.sendingNow !== false}
            openInNewTab={true}
          />
        </div>
      </ToolsPanel>
    </aside>
  );
};
