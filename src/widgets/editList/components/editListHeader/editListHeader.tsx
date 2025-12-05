import { Show } from "solid-js";

import { LIST_PURPOSE_INPUT_LIMIT, LIST_TITLE_INPUT_LIMIT } from "../../../../../configuration.ts";
import { DEFAULT_TEST_ID, LIST_PURPOSE_INPUT, LIST_TITLE_INPUT } from "../../../../../features/testIds.ts";
import { CyberInput, CyberInputSize, CyberInputTheme } from "../../../../components/cyberInput/cyberInput.tsx";
import { DropdownList } from "../../../../components/dropdownList/dropdownList.tsx";
import { IconName } from "../../../../components/icon/types.ts";
import { IconButton, IconButtonComponentType, IconButtonTheme } from "../../../../components/iconButton/iconButton.tsx";
import { Note } from "../../../../components/note/note.tsx";
import { setStoreEditList, storeEditList } from "../../editList.store.tsx";

import "./editListHeader.css";

export const EditListHeader = () => {
  return (
    <div class="editListHeader">
      <div class="editListHeader__title">
        <div class="editListHeader__exportedTo">
          <Show when={storeEditList.exportedTo.length > 0}>
            <DropdownList
              component={(props) => (
                <IconButton
                  ref={props.ref}
                  componentType={IconButtonComponentType.Button}
                  handleClick={props.handleClick}
                  testId={DEFAULT_TEST_ID}
                  iconName={IconName.Link}
                  theme={IconButtonTheme.Quaternary}
                  ariaLabel={"Меню импортов"}
                  disabled={Boolean(storeEditList.sendingNow)}
                />
              )}
              title={"Экспортирован в списки:"}
              testId={DEFAULT_TEST_ID}
            >
              {storeEditList.exportedTo}
            </DropdownList>
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
