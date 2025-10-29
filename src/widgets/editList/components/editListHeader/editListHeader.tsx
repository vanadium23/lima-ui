import { LIST_PURPOSE_INPUT_LIMIT, LIST_TITLE_INPUT_LIMIT } from "../../../../../configuration.ts";
import { LIST_PURPOSE_INPUT, LIST_TITLE_INPUT } from "../../../../../features/testIds.ts";
import { CyberInput, CyberInputSize, CyberInputTheme } from "../../../../components/cyberInput/cyberInput.tsx";
import { Note } from "../../../../components/note/note.tsx";
import { setStoreEditList, storeEditList } from "../../editList.store.tsx";

import "./editListHeader.css";

export const EditListHeader = () => {
  return (
    <div class="editListHeader">
      <CyberInput
        theme={CyberInputTheme.Secondary}
        size={CyberInputSize.ExtraLarge}
        maxLength={LIST_TITLE_INPUT_LIMIT}
        name={"List Title"}
        testId={LIST_TITLE_INPUT}
        required={true}
        disabled={storeEditList.sendingNow !== false}
        onChange={(value) => setStoreEditList("name", value)}
        placeholder={"Название списка"}
      >
        {storeEditList.name}
      </CyberInput>
      <CyberInput
        theme={CyberInputTheme.Primary}
        size={CyberInputSize.Medium}
        placeholder="Цель списка"
        maxLength={LIST_PURPOSE_INPUT_LIMIT}
        name={"List Purpose"}
        testId={LIST_PURPOSE_INPUT}
        disabled={storeEditList.sendingNow !== false}
        onChange={(value) => setStoreEditList("purpose", value)}
      >
        {storeEditList.purpose}
      </CyberInput>
      <Note
        title="Заметка"
        name={"List Purpose"}
        disabled={storeEditList.sendingNow !== false}
        onChange={(value) => setStoreEditList("note", value)}
      >
        {storeEditList.note}
      </Note>
    </div>
  );
};
