import { LIST_PURPOSE_INPUT_LIMIT, LIST_TITLE_INPUT_LIMIT } from "../../../../../configuration.ts";
import { LIST_PURPOSE_INPUT, LIST_TITLE_INPUT } from "../../../../../features/testIds.ts";
import { CyberInput, CyberInputSize, CyberInputTheme } from "../../../../components/cyberInput/cyberInput.tsx";
import { Note } from "../../../../components/note/note.tsx";
import { EditListFormNames, type List } from "../../../../types/types.ts";
import { setStoreEditList, storeEditList } from "../../editList.store.tsx";
import { checkChanges } from "../../utilities/checkChanges.ts";

import "./editListHeader.css";

function handleHeaderDataChange(key: keyof List, value: string) {
  setStoreEditList(key, value);
  checkChanges(storeEditList, setStoreEditList);
  // TODO впилить сторы внутрь функции
}

export const EditListHeader = () => {
  return (
    <div class="editListHeader">
      <CyberInput
        theme={CyberInputTheme.Secondary}
        size={CyberInputSize.ExtraLarge}
        maxLength={LIST_TITLE_INPUT_LIMIT}
        name={EditListFormNames.ListTitle}
        testId={LIST_TITLE_INPUT}
        required={true}
        disabled={storeEditList.sendingNow !== false}
        onChange={(value) => handleHeaderDataChange("name", value)}
        placeholder={"Название списка"}
      >
        {storeEditList.name}
      </CyberInput>
      <CyberInput
        theme={CyberInputTheme.Primary}
        size={CyberInputSize.Medium}
        placeholder="Цель списка"
        maxLength={LIST_PURPOSE_INPUT_LIMIT}
        name={EditListFormNames.ListPurpose}
        testId={LIST_PURPOSE_INPUT}
        disabled={storeEditList.sendingNow !== false}
        onChange={(value) => handleHeaderDataChange("purpose", value)}
      >
        {storeEditList.name}
      </CyberInput>
      <Note
        title="Заметка"
        name={EditListFormNames.ListNote}
        disabled={storeEditList.sendingNow !== false}
        onChange={(value) => handleHeaderDataChange("note", value)}
      >
        {storeEditList.name}
      </Note>
    </div>
  );
};
