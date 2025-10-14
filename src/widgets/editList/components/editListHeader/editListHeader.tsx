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
        isRequired={true}
        isDisabled={storeEditList.sendingNow !== false}
        defaultValue={storeEditList.name}
        onChange={(value) => handleHeaderDataChange("name", value)}
        placeholder={"Название списка"}
      />
      <CyberInput
        theme={CyberInputTheme.Primary}
        size={CyberInputSize.Medium}
        placeholder="Цель списка"
        maxLength={LIST_PURPOSE_INPUT_LIMIT}
        name={EditListFormNames.ListPurpose}
        testId={LIST_PURPOSE_INPUT}
        isDisabled={storeEditList.sendingNow !== false}
        defaultValue={storeEditList.purpose}
        onChange={(value) => handleHeaderDataChange("purpose", value)}
      />
      <Note
        title="Заметка"
        name={EditListFormNames.ListNote}
        isDisabled={storeEditList.sendingNow !== false}
        defaultValue={storeEditList.note}
        onChange={(value) => handleHeaderDataChange("note", value)}
      />
    </div>
  );
};
