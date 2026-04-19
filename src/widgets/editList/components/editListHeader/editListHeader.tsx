import { Show } from "solid-js";

import { LIST_PURPOSE_INPUT_LIMIT, LIST_TITLE_INPUT_LIMIT } from "../../../../../configuration.ts";
import { EXPORTED_TO_BUTTON, LIST_PURPOSE_INPUT, LIST_TITLE_INPUT } from "../../../../../features/testIds.ts";
import { CyberInput, CyberInputSize, CyberInputTheme } from "../../../../components/cyberInput/cyberInput.tsx";
import { Dropdown } from "../../../../components/dropdown/dropdown.tsx";
import { ExportedTo } from "../../../../components/exportedTo/exportedTo.tsx";
import { IconName } from "../../../../components/icon/types.ts";
import { IconButton, IconButtonTheme } from "../../../../components/iconButton/iconButton.tsx";
import { Note } from "../../../../components/note/note.tsx";
import { setStoreEditList, storeEditList } from "../../editList.store.tsx";

import "./editListHeader.css";

export const EditListHeader = () => {
  return (
    <div class="editListHeader">
      <div class="editListHeader__title">
        <div class="editListHeader__exportedTo">
          <Show when={storeEditList.exportedTo.length > 0}>
            <Dropdown
              defaultPlacement={"bottom-start"}
              anchor={(props) => (
                <IconButton
                  ref={props.ref}
                  handleClick={props.handleClick}
                  testId={EXPORTED_TO_BUTTON}
                  iconName={IconName.Link}
                  theme={IconButtonTheme.Quaternary}
                  ariaLabel={"Меню импортов"}
                  disabled={Boolean(storeEditList.sendingNow)}
                />
              )}
            >
              <ExportedTo title={"Целиком экспортирован в списки:"}>{storeEditList.exportedTo}</ExportedTo>
            </Dropdown>
          </Show>
        </div>

        <CyberInput
          theme={CyberInputTheme.Secondary}
          size={CyberInputSize.ExtraLarge}
          maxLength={LIST_TITLE_INPUT_LIMIT}
          name={"List Title"}
          testId={LIST_TITLE_INPUT}
          required={true}
          disabled={Boolean(storeEditList.sendingNow)}
          onChange={(value) => setStoreEditList("name", value)}
          placeholder={"Название списка"}
        >
          {storeEditList.name}
        </CyberInput>
      </div>
      <div class="editListHeader__headerInner">
        <CyberInput
          theme={CyberInputTheme.Primary}
          size={CyberInputSize.Medium}
          placeholder="Цель списка"
          maxLength={LIST_PURPOSE_INPUT_LIMIT}
          name={"List Purpose"}
          testId={LIST_PURPOSE_INPUT}
          disabled={Boolean(storeEditList.sendingNow)}
          onChange={(value) => setStoreEditList("purpose", value)}
        >
          {storeEditList.purpose}
        </CyberInput>
        <Note
          title="Заметка"
          name={"List Purpose"}
          disabled={Boolean(storeEditList.sendingNow)}
          onChange={(value) => setStoreEditList("note", value)}
        >
          {storeEditList.note}
        </Note>
      </div>
    </div>
  );
};
